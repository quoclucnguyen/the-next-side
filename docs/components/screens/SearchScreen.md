# SearchScreen Component

## Overview
Màn hình tìm kiếm nâng cao, cho phép tìm kiếm sản phẩm trong tủ bếp với nhiều bộ lọc, sorting options, và search suggestions. Hỗ trợ tìm kiếm theo tên, brand, category, và các thuộc tính khác.

## Props Interface
```typescript
interface SearchScreenProps {
  onProductSelect?: (product: Product) => void;
  onProductPress?: (product: Product) => void;
  onAddProduct?: () => void;
  initialQuery?: string;
  initialFilters?: SearchFilters;
  className?: string;
}

interface SearchFilters {
  query: string;
  categories: ProductCategory[];
  brands: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  expirationStatus?: 'all' | 'fresh' | 'expiring-soon' | 'expired';
  sortBy: 'relevance' | 'name' | 'expiration' | 'dateAdded';
  sortOrder: 'asc' | 'desc';
}

interface SearchResult {
  product: Product;
  relevanceScore: number;
  matchHighlights: MatchHighlight[];
}

interface MatchHighlight {
  field: string;
  value: string;
  highlightedText: string;
}

type SearchScope = 'all' | 'fridge' | 'freezer' | 'dry-pantry';
```

## State Management
```typescript
// Local state
const [searchState, setSearchState] = useState<SearchScreenState>({
  query: '',
  filters: {
    categories: [],
    brands: [],
    sortBy: 'relevance',
    sortOrder: 'desc',
  },
  results: [],
  suggestions: [],
  isLoading: false,
  isFilterPanelOpen: false,
  recentSearches: [],
  searchHistory: [],
  selectedScope: 'all',
});

// Global state interaction
const { 
  products: allProducts, 
  categories, 
  brands,
  recentSearches: globalRecentSearches 
} = useSelector((state: RootState) => state.pantry);
const dispatch = useDispatch();
```

## Dependencies
```typescript
// External dependencies
import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash-es';

// Internal dependencies
import { Container } from '../core/Container';
import { Header } from '../core/Header';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Chip } from '../common/Chip';
import { FilterPanel } from '../common/FilterPanel';
import { SearchSuggestions } from '../common/SearchSuggestions';
import { ProductCard } from '../pantry-features/ProductCard';
import { EmptyState } from '../common/EmptyState';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { cn } from '../utils/cn';
import { useDebounce } from '../hooks/useDebounce';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { calculateRelevanceScore } from '../utils/searchUtils';
import { formatSearchHighlight } from '../utils/formatUtils';
```

## Usage Example
```typescript
const SearchScreen: React.FC<SearchScreenProps> = ({
  onProductSelect,
  onProductPress,
  onAddProduct,
  initialQuery,
  initialFilters,
  className
}) => {
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { value: savedRecentSearches, setValue: setSavedRecentSearches } = useLocalStorage('pantry_recent_searches', []);

  // Initialize with props
  useEffect(() => {
    if (initialQuery) {
      setSearchState(prev => ({
        ...prev,
        query: initialQuery,
      }));
      performSearch(initialQuery);
    }
    
    if (initialFilters) {
      setSearchState(prev => ({
        ...prev,
        filters: { ...prev.filters, ...initialFilters },
      }));
    }
  }, [initialQuery, initialFilters]);

  // Debounced search
  const debouncedSearch = useDebounce(performSearch, 300);

  // Search functionality
  const performSearch = useCallback((query: string) => {
    if (!query.trim()) {
      setSearchState(prev => ({ ...prev, results: [], suggestions: [] }));
      return;
    }

    setSearchState(prev => ({ ...prev, isLoading: true }));

    try {
      const filteredResults = searchProducts(allProducts || [], query, searchState.filters);
      const suggestions = generateSearchSuggestions(query, allProducts || []);

      setSearchState(prev => ({
        ...prev,
        results: filteredResults,
        suggestions,
        isLoading: false,
      }));

      // Save to recent searches
      if (query && !savedRecentSearches.includes(query)) {
        const newRecentSearches = [query, ...savedRecentSearches.slice(0, 9)];
        setSavedRecentSearches(newRecentSearches);
        dispatch(updateRecentSearches(newRecentSearches));
      }
    } catch (error) {
      console.error('Search failed:', error);
      setSearchState(prev => ({ ...prev, isLoading: false }));
    }
  }, [allProducts, searchState.filters, savedRecentSearches, setSavedRecentSearches, dispatch]);

  // Filter products with relevance scoring
  const searchProducts = useCallback((products: Product[], query: string, filters: SearchFilters): SearchResult[] => {
    const queryLower = query.toLowerCase().trim();
    
    return products
      .filter(product => {
        // Text search across multiple fields
        const searchableText = [
          product.name,
          product.brand || '',
          product.category,
          product.notes || '',
        ].join(' ').toLowerCase();

        // Check if query matches any field
        const textMatches = searchableText.includes(queryLower);
        
        // Apply additional filters
        if (!textMatches) return false;
        if (filters.categories.length > 0 && !filters.categories.includes(product.category)) return false;
        if (filters.brands.length > 0 && product.brand && !filters.brands.includes(product.brand)) return false;
        if (filters.expirationStatus && filters.expirationStatus !== 'all') {
          const isExpired = isProductExpired(product);
          const isExpiringSoon = isProductExpiringSoon(product);
          
          switch (filters.expirationStatus) {
            case 'fresh':
              return !isExpired && !isExpiringSoon;
            case 'expiring-soon':
              return isExpiringSoon && !isExpired;
            case 'expired':
              return isExpired;
          }
        }
        
        return true;
      })
      .map(product => ({
        product,
        relevanceScore: calculateRelevanceScore(product, queryLower),
        matchHighlights: generateMatchHighlights(product, queryLower),
      }))
      .sort((a, b) => {
        // Sort by relevance first, then by selected sort option
        if (filters.sortBy === 'relevance') {
          return b.relevanceScore - a.relevanceScore;
        }
        
        return applySecondarySort(a.product, b.product, filters.sortBy, filters.sortOrder);
      });
  }, []);

  // Generate search suggestions
  const generateSearchSuggestions = useCallback((query: string, products: Product[]): string[] => {
    const queryLower = query.toLowerCase();
    const suggestions = new Set<string>();

    products.forEach(product => {
      // Name suggestions
      if (product.name.toLowerCase().includes(queryLower)) {
        suggestions.add(product.name);
      }
      
      // Brand suggestions
      if (product.brand && product.brand.toLowerCase().includes(queryLower)) {
        suggestions.add(product.brand);
      }
      
      // Category suggestions
      if (product.category.toLowerCase().includes(queryLower)) {
        suggestions.add(formatCategory(product.category));
      }
    });

    return Array.from(suggestions).slice(0, 5);
  }, []);

  // Event handlers
  const handleQueryChange = useCallback((query: string) => {
    setSearchState(prev => ({ ...prev, query }));
    debouncedSearch(query);
  }, [debouncedSearch]);

  const handleSuggestionSelect = useCallback((suggestion: string) => {
    setSearchState(prev => ({ ...prev, query: suggestion, suggestions: [] }));
    searchInputRef.current?.focus();
    performSearch(suggestion);
  }, [performSearch]);

  const handleFilterChange = useCallback((filterUpdates: Partial<SearchFilters>) => {
    setSearchState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...filterUpdates },
    }));
  }, []);

  const handleProductPress = useCallback((product: Product) => {
    onProductPress?.(product);
    navigate(`/product/${product.id}`);
  }, [navigate, onProductPress]);

  const handleAddProduct = useCallback(() => {
    onAddProduct?.();
    navigate('/add-product');
  }, [navigate, onAddProduct]);

  const clearFilters = useCallback(() => {
    setSearchState(prev => ({
      ...prev,
      filters: {
        query: prev.query,
        categories: [],
        brands: [],
        sortBy: 'relevance',
        sortOrder: 'desc',
      },
    }));
  }, []);

  const toggleFilterPanel = useCallback(() => {
    setSearchState(prev => ({ ...prev, isFilterPanelOpen: !prev.isFilterPanelOpen }));
  }, []);

  // Memoized results
  const filteredResults = useMemo(() => {
    return searchState.results.filter(result => 
      searchState.selectedScope === 'all' || result.product.category === searchState.selectedScope.toUpperCase()
    );
  }, [searchState.results, searchState.selectedScope]);

  const activeFiltersCount = useMemo(() => {
    return searchState.filters.categories.length + 
           searchState.filters.brands.length + 
           (searchState.filters.expirationStatus && searchState.filters.expirationStatus !== 'all' ? 1 : 0);
  }, [searchState.filters]);

  return (
    <Container variant="default" className="search-screen">
      <Header
        title="Search Pantry"
        showBackButton
        rightComponent={
          <Button
            variant="ghost"
            size="sm"
            onPress={toggleFilterPanel}
            aria-label="Toggle filters"
          >
            <Icon name="filter" size={20} />
            {activeFiltersCount > 0 && (
              <span className="search-screen__filter-badge">{activeFiltersCount}</span>
            )}
          </Button>
        }
      />

      {/* Search Input */}
      <div className="search-screen__input-section">
        <div className="search-input-wrapper">
          <Input
            ref={searchInputRef}
            value={searchState.query}
            onChangeText={handleQueryChange}
            placeholder="Search products, brands, categories..."
            autoFocus
            clearable
            onClear={() => setSearchState(prev => ({ ...prev, query: '', suggestions: [] }))}
            className="search-screen__input"
          />
          
          {searchState.suggestions.length > 0 && (
            <SearchSuggestions
              suggestions={searchState.suggestions}
              onSelect={handleSuggestionSelect}
              query={searchState.query}
              className="search-screen__suggestions"
            />
          )}
        </div>

        {/* Scope selector */}
        <div className="search-screen__scope">
          <Select
            value={searchState.selectedScope}
            onSelect={(scope: SearchScope) => setSearchState(prev => ({ ...prev, selectedScope: scope }))}
            options={[
              { value: 'all', label: 'All Products' },
              { value: 'fridge', label: 'Fridge' },
              { value: 'freezer', label: 'Freezer' },
              { value: 'dry-pantry', label: 'Dry Pantry' },
            ]}
            className="search-screen__scope-select"
          />
        </div>
      </div>

      {/* Active filters */}
      {activeFiltersCount > 0 && (
        <div className="search-screen__active-filters">
          <div className="active-filters__header">
            <span>Active Filters ({activeFiltersCount})</span>
            <Button
              variant="ghost"
              size="sm"
              onPress={clearFilters}
              className="active-filters__clear"
            >
              Clear All
            </Button>
          </div>
          
          <div className="active-filters__chips">
            {searchState.filters.categories.map(category => (
              <Chip
                key={category}
                label={formatCategory(category)}
                onRemove={() => handleFilterChange({
                  categories: searchState.filters.categories.filter(c => c !== category),
                })}
                variant="category"
              />
            ))}
            
            {searchState.filters.brands.map(brand => (
              <Chip
                key={brand}
                label={brand}
                onRemove={() => handleFilterChange({
                  brands: searchState.filters.brands.filter(b => b !== brand),
                })}
                variant="brand"
              />
            ))}
          </div>
        </div>
      )}

      {/* Filter Panel */}
      {searchState.isFilterPanelOpen && (
        <FilterPanel
          filters={searchState.filters}
          onFilterChange={handleFilterChange}
          onClose={() => setSearchState(prev => ({ ...prev, isFilterPanelOpen: false }))}
          categories={categories}
          brands={brands}
          className="search-screen__filter-panel"
        />
      )}

      {/* Results */}
      <div className="search-screen__results">
        {searchState.isLoading ? (
          <LoadingSpinner size="lg" />
        ) : filteredResults.length === 0 ? (
          <EmptyState
            title="No Products Found"
            description={
              searchState.query 
                ? `No products found for "${searchState.query}"`
                : 'No products match your current filters'
            }
            action={
              searchState.query ? (
                <Button onPress={() => navigate('/add-product')}>
                  Add {searchState.query} to Pantry
                </Button>
              ) : null
            }
          />
        ) : (
          <>
            <div className="search-results__header">
              <span>{filteredResults.length} results found</span>
              
              <Select
                value={`${searchState.filters.sortBy}-${searchState.filters.sortOrder}`}
                onSelect={(value: string) => {
                  const [sortBy, sortOrder] = value.split('-') as [SearchFilters['sortBy'], SearchFilters['sortOrder']];
                  handleFilterChange({ sortBy, sortOrder });
                }}
                options={[
                  { value: 'relevance-desc', label: 'Most Relevant' },
                  { value: 'name-asc', label: 'Name (A-Z)' },
                  { value: 'name-desc', label: 'Name (Z-A)' },
                  { value: 'expiration-asc', label: 'Expiration (Soonest)' },
                  { value: 'expiration-desc', label: 'Expiration (Latest)' },
                  { value: 'dateAdded-desc', label: 'Recently Added' },
                  { value: 'dateAdded-asc', label: 'Oldest First' },
                ]}
                className="search-results__sort"
              />
            </div>

            <div className="search-results__list">
              {filteredResults.map((result, index) => (
                <ProductCard
                  key={result.product.id}
                  product={result.product}
                  onPress={() => handleProductPress(result.product)}
                  onSelect={() => onProductSelect?.(result.product)}
                  matchHighlights={result.matchHighlights}
                  className="search-result__item"
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Recent Searches */}
      {savedRecentSearches.length > 0 && !searchState.query && (
        <div className="search-screen__recent">
          <h3 className="recent-searches__title">Recent Searches</h3>
          <div className="recent-searches__list">
            {savedRecentSearches.map((search, index) => (
              <button
                key={`${search}-${index}`}
                className="recent-search__item"
                onClick={() => handleSuggestionSelect(search)}
              >
                <Icon name="history" size={16} />
                <span>{search}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <Button
        variant="primary"
        onPress={handleAddProduct}
        className="search-screen__fab"
        aria-label="Add new product"
      >
        <Icon name="add" size={24} />
      </Button>
    </Container>
  );
};
```

## Features
### 1. Advanced Search Algorithm
```typescript
// Relevance scoring algorithm
const calculateRelevanceScore = (product: Product, query: string): number => {
  const queryLower = query.toLowerCase();
  let score = 0;

  // Name matching (highest weight)
  if (product.name.toLowerCase().includes(queryLower)) {
    if (product.name.toLowerCase() === queryLower) {
      score += 100; // Exact match
    } else if (product.name.toLowerCase().startsWith(queryLower)) {
      score += 80; // Starts with
    } else {
      score += 60; // Contains
    }
  }

  // Brand matching (medium weight)
  if (product.brand && product.brand.toLowerCase().includes(queryLower)) {
    score += 40;
  }

  // Category matching (low weight)
  if (product.category.toLowerCase().includes(queryLower)) {
    score += 20;
  }

  // Notes matching (lowest weight)
  if (product.notes && product.notes.toLowerCase().includes(queryLower)) {
    score += 10;
  }

  // Bonus for recently added items
  const daysSinceAdded = getDaysSince(product.addedDate);
  if (daysSinceAdded < 7) {
    score += 5;
  }

  // Penalty for expired items
  if (isProductExpired(product)) {
    score *= 0.5;
  }

  return score;
};

// Match highlighting
const generateMatchHighlights = (product: Product, query: string): MatchHighlight[] => {
  const highlights: MatchHighlight[] = [];
  const queryLower = query.toLowerCase();

  const highlightText = (text: string, field: string): MatchHighlight | null => {
    const textLower = text.toLowerCase();
    const index = textLower.indexOf(queryLower);
    
    if (index === -1) return null;

    return {
      field,
      value: text,
      highlightedText: formatSearchHighlight(text, queryLower),
    };
  };

  // Check each field for matches
  const nameMatch = highlightText(product.name, 'name');
  if (nameMatch) highlights.push(nameMatch);

  if (product.brand) {
    const brandMatch = highlightText(product.brand, 'brand');
    if (brandMatch) highlights.push(brandMatch);
  }

  const categoryMatch = highlightText(product.category, 'category');
  if (categoryMatch) highlights.push(categoryMatch);

  if (product.notes) {
    const notesMatch = highlightText(product.notes, 'notes');
    if (notesMatch) highlights.push(notesMatch);
  }

  return highlights;
};
```

### 2. Search Suggestions
```typescript
// Smart suggestions generation
const useSearchSuggestions = (query: string, products: Product[]) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);

    try {
      const queryLower = searchQuery.toLowerCase();
      const suggestionSet = new Set<string>();

      // Generate different types of suggestions
      products.forEach(product => {
        // Exact name matches
        if (product.name.toLowerCase() === queryLower) {
          suggestionSet.add(product.name);
        }

        // Partial name matches
        if (product.name.toLowerCase().includes(queryLower)) {
          suggestionSet.add(product.name);
        }

        // Brand suggestions
        if (product.brand && product.brand.toLowerCase().includes(queryLower)) {
          suggestionSet.add(product.brand);
        }

        // Category suggestions
        if (product.category.toLowerCase().includes(queryLower)) {
          suggestionSet.add(formatCategory(product.category));
        }

        // Auto-complete variations
        const words = searchQuery.split(' ');
        words.forEach(word => {
          if (product.name.toLowerCase().includes(word.toLowerCase())) {
            // Add partial matches
            const partialMatch = product.name.substring(0, word.length + 5);
            suggestionSet.add(partialMatch);
          }
        });
      });

      const suggestionArray = Array.from(suggestionSet)
        .slice(0, 8)
        .sort((a, b) => {
          // Prioritize exact matches and shorter suggestions
          const aExact = a.toLowerCase() === queryLower;
          const bExact = b.toLowerCase() === queryLower;
          
          if (aExact && !bExact) return -1;
          if (!aExact && bExact) return 1;
          return a.length - b.length;
        });

      setSuggestions(suggestionArray);
    } finally {
      setIsLoading(false);
    }
  }, [products]);

  return { suggestions, isLoading, generateSuggestions };
};
```

### 3. Search History
```typescript
// Search history management
const useSearchHistory = () => {
  const [history, setHistory] = useLocalStorage<string[]>('pantry_search_history', []);
  const [isExpanded, setIsExpanded] = useState(false);

  const addToHistory = useCallback((query: string) => {
    if (!query.trim()) return;

    const newHistory = [query, ...history.filter(item => item !== query)].slice(0, 20);
    setHistory(newHistory);
  }, [history, setHistory]);

  const removeFromHistory = useCallback((query: string) => {
    const newHistory = history.filter(item => item !== query);
    setHistory(newHistory);
  }, [history, setHistory]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  const getPopularSearches = useCallback(() => {
    const frequency = new Map<string, number>();
    
    history.forEach(query => {
      frequency.set(query, (frequency.get(query) || 0) + 1);
    });

    return Array.from(frequency.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([query]) => query);
  }, [history]);

  return {
    history,
    isExpanded,
    setIsExpanded,
    addToHistory,
    removeFromHistory,
    clearHistory,
    getPopularSearches,
  };
};
```

## Styling
```css
/* Screen container */
.search-screen {
  min-height: 100vh;
  padding-bottom: 80px;
}

/* Search input section */
.search-screen__input-section {
  position: sticky;
  top: 56px;
  z-index: 20;
  background-color: var(--background-color);
  border-bottom: 1px solid var(--border-color);
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-input-wrapper {
  flex: 1;
  position: relative;
}

.search-screen__input {
  width: 100%;
  font-size: 16px;
  padding: 12px 16px 12px 48px;
  border-radius: 8px;
  border: 2px solid var(--border-color);
  background-color: var(--background-color);
}

.search-screen__input:focus {
  border-color: var(--primary-color);
  outline: none;
}

.search-screen__suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 30;
  background-color: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Scope selector */
.search-screen__scope {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-screen__scope-select {
  min-width: 120px;
}

/* Filter badge */
.search-screen__filter-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

/* Active filters */
.search-screen__active-filters {
  background-color: var(--background-secondary);
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
}

.active-filters__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.active-filters__clear {
  font-size: 12px;
  color: var(--text-secondary);
}

.active-filters__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* Filter panel */
.search-screen__filter-panel {
  position: fixed;
  top: 56px;
  right: 0;
  bottom: 0;
  width: 320px;
  background-color: var(--background-color);
  border-left: 1px solid var(--border-color);
  z-index: 100;
  transform: translateX(100%);
  transition: transform 0.3s ease;
}

.search-screen__filter-panel--open {
  transform: translateX(0);
}

/* Results */
.search-screen__results {
  padding: 16px;
}

.search-results__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.search-results__sort {
  min-width: 160px;
}

.search-results__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.search-result__item {
  transition: transform 0.2s ease;
}

.search-result__item:hover {
  transform: translateX(4px);
}

/* Recent searches */
.search-screen__recent {
  padding: 24px 16px;
  background-color: var(--background-secondary);
}

.recent-searches__title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 16px 0;
}

.recent-searches__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.recent-search__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: none;
  border: none;
  border-radius: 8px;
  text-align: left;
  width: 100%;
  color: var(--text-primary);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.recent-search__item:hover {
  background-color: var(--background-hover);
}

/* Floating Action Button */
.search-screen__fab {
  position: fixed;
  bottom: 80px;
  right: 16px;
  width: 56px;
  height: 56px;
  border-radius: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 50;
}

/* Responsive design */
@media (max-width: 768px) {
  .search-screen__input-section {
    flex-direction: column;
    gap: 8px;
  }
  
  .search-screen__scope {
    width: 100%;
  }
  
  .search-screen__filter-panel {
    width: 100%;
  }
  
  .search-results__header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
}

@media (min-width: 769px) {
  .search-screen {
    max-width: 800px;
    margin: 0 auto;
  }
}

/* Animation states */
.search-screen__results {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Focus states */
.search-screen__input:focus-visible {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.2);
}

.recent-search__item:focus-visible {
  background-color: var(--primary-color);
  color: white;
}

/* Loading states */
.search-screen--loading {
  pointer-events: none;
  opacity: 0.7;
}

/* Dark theme support */
@media (prefers-color-scheme: dark) {
  .search-screen__filter-panel {
    box-shadow: -4px 0 12px rgba(0, 0, 0, 0.3);
  }
}
```

## Accessibility Features
```typescript
// Screen reader support
const AccessibleSearchScreen: React.FC<SearchScreenProps> = (props) => {
  const announceSearchResults = useCallback((count: number, query: string) => {
    const announcement = count === 0 
      ? `No results found for ${query}`
      : `${count} results found for ${query}`;
    const liveRegion = document.getElementById('screen-reader-announcements');
    if (liveRegion) {
      liveRegion.textContent = announcement;
    }
  }, []);

  const announceFilterChange = useCallback((filterCount: number) => {
    const announcement = `Applied ${filterCount} filters`;
    const liveRegion = document.getElementById('screen-reader-announcements');
    if (liveRegion) {
      liveRegion.textContent = announcement;
    }
  }, []);

  return (
    <div role="search" aria-label="Product search">
      {/* Hidden live region */}
      <div
        id="screen-reader-announcements"
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      />
      
      <SearchScreen
        {...props}
        onSearchComplete={(results, query) => {
          props.onSearchComplete?.(results, query);
          announceSearchResults(results.length, query);
        }}
        onFilterChange={(filters) => {
          props.onFilterChange?.(filters);
          const filterCount = Object.values(filters).filter(Boolean).length;
          announceFilterChange(filterCount);
        }}
      />
    </div>
  );
};

// Keyboard navigation
const handleKeyDown = useCallback((event: KeyboardEvent) => {
  const focusedElement = document.activeElement;
  
  if (!focusedElement?.closest('.search-screen')) return;

  switch (event.key) {
    case '/':
      event.preventDefault();
      searchInputRef.current?.focus();
      break;
    case 'f':
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        toggleFilterPanel();
      }
      break;
    case 'Escape':
      if (searchState.isFilterPanelOpen) {
        event.preventDefault();
        toggleFilterPanel();
      }
      break;
    case 'ArrowDown':
      if (document.activeElement === searchInputRef.current) {
        event.preventDefault();
        // Focus first suggestion or result
        const firstSuggestion = document.querySelector('.search-suggestion__item');
        const firstResult = document.querySelector('.search-result__item');
        (firstSuggestion || firstResult as HTMLElement)?.focus();
      }
      break;
    case 'Enter':
      if (document.activeElement === searchInputRef.current) {
        event.preventDefault();
        performSearch(searchState.query);
      }
      break;
  }
}, []);
```

## Performance Optimizations
### Memoization
```typescript
// Memoize search results
const searchResults = useMemo(() => {
  if (!searchState.query) return [];
  return searchProducts(allProducts || [], searchState.query, searchState.filters);
}, [allProducts, searchState.query, searchState.filters]);

// Memoize suggestions
const searchSuggestions = useMemo(() => {
  if (searchState.query.length < 2) return [];
  return generateSearchSuggestions(searchState.query, allProducts || []);
}, [searchState.query, allProducts]);

// Memoize filter count
const activeFiltersCount = useMemo(() => {
  return Object.values(searchState.filters).filter(Boolean).length;
}, [searchState.filters]);

// Memoize event handlers
const handleQueryChange = useCallback((query: string) => {
  setSearchState(prev => ({ ...prev, query }));
  debouncedSearch(query);
}, [debouncedSearch]);
```

### Virtual Scrolling
```typescript
// Virtual list for large result sets
const VirtualizedSearchResults: React.FC<{ results: SearchResult[] }> = ({ results }) => {
  const [shouldVirtualize, setShouldVirtualize] = useState(false);

  useEffect(() => {
    setShouldVirtualize(results.length > 50);
  }, [results.length]);

  if (shouldVirtualize) {
    return (
      <FixedSizeList
        height={window.innerHeight - 200}
        itemCount={results.length}
        itemSize={120}
        itemData={results}
      >
        {({ index, style, data }) => (
          <div style={style}>
            <ProductCard
              product={data[index].product}
              matchHighlights={data[index].matchHighlights}
            />
          </div>
        )}
      </FixedSizeList>
    );
  }

  return (
    <div className="search-results__list">
      {results.map((result, index) => (
        <ProductCard
          key={result.product.id}
          product={result.product}
          matchHighlights={result.matchHighlights}
        />
      ))}
    </div>
  );
};
```

## Testing Strategy
### Unit Tests
```typescript
describe('SearchScreen Component', () => {
  const mockProducts = [
    {
      id: '1',
      name: 'Tomatoes',
      quantity: 3,
      unit: 'pc',
      category: 'FRIDGE',
      expirationDate: '2024-12-25',
      addedDate: '2024-12-18',
    },
    {
      id: '2',
      name: 'Milk',
      quantity: 1,
      unit: 'gallon',
      category: 'FRIDGE',
      expirationDate: '2024-12-30',
      addedDate: '2024-12-15',
    },
  ];

  test('renders search input correctly', () => {
    render(<SearchScreen products={mockProducts} />);
    
    expect(screen.getByPlaceholderText('Search products, brands, categories...')).toBeInTheDocument();
    expect(screen.getByLabelText('Toggle filters')).toBeInTheDocument();
  });

  test('filters products based on query', async () => {
    render(<SearchScreen products={mockProducts} />);
    
    const searchInput = screen.getByPlaceholderText('Search products, brands, categories...');
    fireEvent.change(searchInput, { target: { value: 'Tomato' } });
    
    await waitFor(() => {
      expect(screen.getByText('Tomatoes')).toBeInTheDocument();
      expect(screen.queryByText('Milk')).not.toBeInTheDocument();
    });
  });

  test('shows search suggestions', async () => {
    render(<SearchScreen products={mockProducts} />);
    
    const searchInput = screen.getByPlaceholderText('Search products, brands, categories...');
    fireEvent.change(searchInput, { target: { value: 'Tom' } });
    
    await waitFor(() => {
      expect(screen.getByText('Tomatoes')).toBeInTheDocument();
    });
  });

  test('applies filters correctly', async () => {
    render(<SearchScreen products={mockProducts} />);
    
    fireEvent.click(screen.getByLabelText('Toggle filters'));
    
    const categoryFilter = screen.getByText('FRIDGE');
    fireEvent.click(categoryFilter);
    
    await waitFor(() => {
      expect(screen.getByText('Active Filters (1)')).toBeInTheDocument();
    });
  });

  test('sorts results correctly', async () => {
    render(<SearchScreen products={mockProducts} />);
    
    // Trigger search
    const searchInput = screen.getByPlaceholderText('Search products, brands, categories...');
    fireEvent.change(searchInput, { target: { value: 'Milk' } });
    
    await waitFor(() => {
      const sortSelect = screen.getByDisplayValue('Recently Added');
      fireEvent.change(sortSelect, { target: { value: 'name-asc' } });
      
      expect(screen.getByText('Milk')).toBeInTheDocument();
    });
  });

  test('navigates to product detail on press', () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      useNavigate: () => mockNavigate,
    }));
    
    render(<SearchScreen products={mockProducts} />);
    
    // Search and click result
    fireEvent.change(screen.getByPlaceholderText('Search products, brands, categories...'), { target: { value: 'Tomatoes' } });
    
    fireEvent.click(screen.getByText('Tomatoes'));
    expect(mockNavigate).toHaveBeenCalledWith('/product/1');
  });
});
```

### Integration Tests
```typescript
describe('SearchScreen Integration', () => {
  test('integrates with global state', () => {
    const mockDispatch = jest.fn();
    jest.mock('react-redux', () => ({
      useDispatch: () => mockDispatch,
      useSelector: () => ({
        pantry: {
          products: mockProducts,
          categories: ['FRIDGE', 'FREEZER', 'DRY_PANTRY'],
          brands: ['Great Value', 'Store Brand'],
        },
      }),
    }));
    
    render(<SearchScreen />);
    
    fireEvent.change(screen.getByPlaceholderText('Search products, brands, categories...'), { target: { value: 'test' } });
    
    // Verify search uses global state
    expect(screen.getByText('No Products Found')).toBeInTheDocument();
  });

  test('persists search history', () => {
    const { setItem, getItem } = localStorage;
    
    render(<SearchScreen />);
    
    const searchInput = screen.getByPlaceholderText('Search products, brands, categories...');
    fireEvent.change(searchInput, { target: { value: 'Tomatoes' } });
    
    expect(setItem).toHaveBeenCalledWith('pantry_recent_searches', expect.arrayContaining(['Tomatoes']));
  });
});
```

## Error Handling
```typescript
// Search error handling
const useSearchErrorHandling = () => {
  const [searchError, setSearchError] = useState<string>('');

  const handleSearchError = useCallback((error: Error) => {
    if (error instanceof NetworkError) {
      setSearchError('Network error. Please check your connection.');
    } else if (error instanceof TimeoutError) {
      setSearchError('Search timed out. Please try again.');
    } else {
      setSearchError('Search failed. Please try again.');
    }
    
    // Clear error after 5 seconds
    setTimeout(() => setSearchError(''), 5000);
  }, []);

  return { searchError, handleSearchError };
};

// Fallback search
const useFallbackSearch = () => {
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  const performFallbackSearch = useCallback(async (query: string): Promise<SearchResult[]> => {
    setIsUsingFallback(true);
    
    try {
      // Simple client-side search when API fails
      const results = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.brand?.toLowerCase().includes(query.toLowerCase())
      ).map(product => ({
        product,
        relevanceScore: calculateBasicRelevanceScore(product, query),
        matchHighlights: generateBasicHighlights(product, query),
      }));
      
      return results;
    } finally {
      setIsUsingFallback(false);
    }
  }, []);

  return { isUsingFallback, performFallbackSearch };
};
```

## Documentation Links
- [App Component](../core/App.md)
- [Layout Component](../core/Layout.md)
- [Header Component](../core/Header.md)
- [Input Component](../common/Input.md)
- [Select Component](../common/Select.md)
- [ProductCard Component](../pantry-features/ProductCard.md)
- [FilterPanel Component](../common/FilterPanel.md)
- [SearchSuggestions Component](../common/SearchSuggestions.md)

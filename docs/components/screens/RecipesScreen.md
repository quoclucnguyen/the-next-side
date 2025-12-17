# RecipesScreen Component

## Overview
Màn hình quản lý công thức nấu ăn, hiển thị danh sách công thức có thể làm với các sản phẩm hiện có trong tủ bếp. Bao gồm tìm kiếm công thức, bộ lọc theo ingredient, và chi tiết công thức.

## Props Interface
```typescript
interface RecipesScreenProps {
  onRecipeSelect?: (recipe: Recipe) => void;
  onRecipePress?: (recipe: Recipe) => void;
  onFavoriteToggle?: (recipeId: string, isFavorite: boolean) => void;
  initialQuery?: string;
  className?: string;
}

interface Recipe {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: RecipeIngredient[];
  instructions: RecipeStep[];
  cuisine: string;
  category: RecipeCategory;
  isFavorite: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

interface RecipeIngredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
  isAvailable: boolean; // based on pantry items
  product?: Product; // linked pantry product
}

interface RecipeStep {
  id: string;
  instruction: string;
  imageUrl?: string;
  duration: number; // seconds for this step
  temperature?: number;
}

type RecipeCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert' | 'beverage' | 'other';
```

## State Management
```typescript
// Local state
const [recipesState, setRecipesState] = useState<RecipesScreenState>({
  query: '',
  filters: {
    categories: [],
    difficulty: [],
    prepTimeRange: { min: 0, max: 120 },
    onlyAvailableIngredients: false,
    favoriteOnly: false,
  },
  sortBy: 'relevance' as 'relevance' | 'name' | 'prepTime' | 'rating' | 'difficulty',
  sortOrder: 'desc' as 'asc' | 'desc',
  viewMode: 'grid' as 'grid' | 'list',
  isLoading: false,
  isRefreshing: false,
});

// Global state interaction
const { 
  recipes: globalRecipes, 
  favorites, 
  categories 
} = useSelector((state: RootState) => state.recipes);
const dispatch = useDispatch();

const recipes = globalRecipes || [];
```

## Dependencies
```typescript
// External dependencies
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// Internal dependencies
import { Container } from '../core/Container';
import { Header } from '../core/Header';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Card } from '../common/Card';
import { RecipeCard } from '../product-features/RecipeCard';
import { RecipeDetail } from '../product-features/RecipeDetail';
import { EmptyState } from '../common/EmptyState';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { cn } from '../utils/cn';
import { useDebounce } from '../hooks/useDebounce';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { calculateRecipeRelevance } from '../utils/recipeUtils';
import { formatCookTime } from '../utils/formatUtils';
```

## Usage Example
```typescript
const RecipesScreen: React.FC<RecipesScreenProps> = ({
  onRecipeSelect,
  onRecipePress,
  onFavoriteToggle,
  initialQuery,
  className
}) => {
  const navigate = useNavigate();
  const { value: savedFavorites, setValue: setSavedFavorites } = useLocalStorage('pantry_recipe_favorites', []);

  // Initialize with props
  useEffect(() => {
    if (initialQuery) {
      setRecipesState(prev => ({
        ...prev,
        query: initialQuery,
      }));
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  // Debounced search
  const debouncedSearch = useDebounce(performSearch, 300);

  // Search functionality
  const performSearch = useCallback((query: string) => {
    if (!query.trim()) {
      setRecipesState(prev => ({ ...prev, results: [], suggestions: [] }));
      return;
    }

    setRecipesState(prev => ({ ...prev, isLoading: true }));

    try {
      const filteredRecipes = searchRecipes(recipes || [], query, recipesState.filters);
      const suggestions = generateRecipeSuggestions(query, recipes || []);

      setRecipesState(prev => ({
        ...prev,
        results: filteredRecipes,
        suggestions,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Recipe search failed:', error);
      setRecipesState(prev => ({ ...prev, isLoading: false }));
    }
  }, [recipes, recipesState.filters]);

  // Filter recipes with availability checking
  const searchRecipes = useCallback((recipes: Recipe[], query: string, filters: RecipeFilters): Recipe[] => {
    const queryLower = query.toLowerCase().trim();
    const availableIngredients = getAvailableIngredients();
    
    return recipes
      .filter(recipe => {
        // Text search across multiple fields
        const searchableText = [
          recipe.name,
          recipe.description,
          recipe.cuisine,
          recipe.category,
          ...recipe.ingredients.map(ing => ing.name),
        ].join(' ').toLowerCase();

        const textMatches = searchableText.includes(queryLower);
        if (!textMatches) return false;
        
        // Apply additional filters
        if (filters.categories.length > 0 && !filters.categories.includes(recipe.category)) return false;
        if (filters.difficulty.length > 0 && !filters.difficulty.includes(recipe.difficulty)) return false;
        if (filters.prepTimeRange) {
          const prepTime = recipe.prepTime;
          if (prepTime < filters.prepTimeRange.min || prepTime > filters.prepTimeRange.max) return false;
        }
        if (filters.favoriteOnly && !savedFavorites.includes(recipe.id)) return false;
        
        // Check ingredient availability
        if (filters.onlyAvailableIngredients) {
          const availableIngredientNames = new Set(availableIngredients.map(ing => ing.name.toLowerCase()));
          const hasAllIngredients = recipe.ingredients.every(ing => 
            availableIngredientNames.has(ing.name.toLowerCase())
          );
          
          if (!hasAllIngredients) return false;
        }
        
        return true;
      })
      .map(recipe => ({
        ...recipe,
        relevanceScore: calculateRecipeRelevance(recipe, queryLower, availableIngredients),
        isAvailableForCooking: hasAllIngredients,
      }))
      .sort((a, b) => {
        // Sort by relevance first, then by selected sort option
        if (filters.sortBy === 'relevance') {
          return b.relevanceScore - a.relevanceScore;
        }
        
        return applySecondarySort(a.recipe, b.recipe, filters.sortBy, filters.sortOrder);
      });
  }, []);

  // Get available ingredients from pantry
  const getAvailableIngredients = useCallback((): string[] => {
    // Mock implementation - would use actual pantry data
    const mockIngredients = ['tomatoes', 'milk', 'flour', 'eggs', 'cheese', 'onions'];
    return mockIngredients;
  }, []);

  // Event handlers
  const handleQueryChange = useCallback((query: string) => {
    setRecipesState(prev => ({ ...prev, query }));
    debouncedSearch(query);
  }, [debouncedSearch]);

  const handleFilterChange = useCallback((filterUpdates: Partial<RecipeFilters>) => {
    setRecipesState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...filterUpdates },
    }));
  }, []);

  const handleRecipePress = useCallback((recipe: Recipe) => {
    onRecipePress?.(recipe);
    navigate(`/recipe/${recipe.id}`);
  }, [navigate, onRecipePress]);

  const handleFavoriteToggle = useCallback((recipeId: string, isFavorite: boolean) => {
    const newFavorites = isFavorite 
      ? [...savedFavorites, recipeId]
      : savedFavorites.filter(id => id !== recipeId);
    
    setSavedFavorites(newFavorites);
    onFavoriteToggle?.(recipeId, isFavorite);
    
    // Update recipe in global state
    dispatch(updateRecipeFavorite({ recipeId, isFavorite }));
  }, [savedFavorites, setSavedFavorites, onFavoriteToggle, dispatch]);

  const handleRefresh = useCallback(async () => {
    setRecipesState(prev => ({ ...prev, isRefreshing: true }));
    
    try {
      await dispatch(fetchRecipes());
    } finally {
      setRecipesState(prev => ({ ...prev, isRefreshing: false }));
    }
  }, [dispatch]);

  // Memoized results
  const filteredRecipes = useMemo(() => {
    if (!recipesState.query) return [];
    return searchRecipes(recipes || [], recipesState.query, recipesState.filters);
  }, [recipes, recipesState.query, recipesState.filters]);

  const activeFiltersCount = useMemo(() => {
    return recipesState.filters.categories.length + 
           recipesState.filters.difficulty.length + 
           (recipesState.filters.prepTimeRange.min > 0 || recipesState.filters.prepTimeRange.max < 120 ? 1 : 0) + 
           (recipesState.filters.favoriteOnly ? 1 : 0) + 
           (recipesState.filters.onlyAvailableIngredients ? 1 : 0);
  }, [recipesState.filters]);

  return (
    <Container variant="default" className="recipes-screen">
      <Header
        title="Recipes"
        showBackButton
        rightComponent={
          <Button
            variant="ghost"
            size="sm"
            onPress={handleRefresh}
            disabled={recipesState.isRefreshing}
            aria-label="Refresh recipes"
          >
            <Icon name="refresh" size={20} />
          </Button>
        }
      />

      {/* Search Input */}
      <div className="recipes-screen__search-section">
        <Input
          value={recipesState.query}
          onChangeText={handleQueryChange}
          placeholder="Search recipes..."
          autoFocus
          clearable
          onClear={() => setRecipesState(prev => ({ ...prev, query: '', suggestions: [] }))}
          className="recipes-screen__search-input"
        />
      </div>

      {/* Filter Controls */}
      <div className="recipes-screen__filters">
        <div className="filter-row">
          <Select
            value={recipesState.filters.category || ''}
            onSelect={(category) => handleFilterChange({ category })}
            options={[
              { value: '', label: 'All Categories' },
              { value: 'breakfast', label: 'Breakfast' },
              { value: 'lunch', label: 'Lunch' },
              { value: 'dinner', label: 'Dinner' },
              { value: 'snack', label: 'Snack' },
              { value: 'dessert', label: 'Dessert' },
              { value: 'beverage', label: 'Beverage' },
              { value: 'other', label: 'Other' },
            ]}
            className="filter-select"
          />

          <Select
            value={recipesState.filters.difficulty || ''}
            onSelect={(difficulty) => handleFilterChange({ difficulty: difficulty ? [difficulty] : [] })}
            options={[
              { value: '', label: 'All Levels' },
              { value: 'easy', label: 'Easy' },
              { value: 'medium', label: 'Medium' },
              { value: 'hard', label: 'Hard' },
            ]}
            className="filter-select"
          />
        </div>

        <div className="filter-row">
          <Select
            value={recipesState.filters.prepTimeRange.min + '-' + recipesState.filters.prepTimeRange.max}
            onSelect={(range) => {
              const [min, max] = range.split('-').map(Number);
              handleFilterChange({ prepTimeRange: { min, max } });
            }}
            options={[
              { value: '0-120', label: 'Any Time' },
              { value: '0-15', label: 'Under 15 min' },
              { value: '15-30', label: '15-30 min' },
              { value: '30-60', label: '30-60 min' },
              { value: '60-120', label: 'Over 60 min' },
            ]}
            className="filter-select"
          />

          <Button
            variant={recipesState.filters.favoriteOnly ? 'primary' : 'outline'}
            size="sm"
            onPress={() => handleFilterChange({ favoriteOnly: !recipesState.filters.favoriteOnly })}
            className="favorite-filter"
          >
            <Icon name="favorite" size={16} />
            <span>Favorites</span>
          </Button>
        </div>

        <div className="filter-row">
          <Button
            variant={recipesState.filters.onlyAvailableIngredients ? 'primary' : 'outline'}
            size="sm"
            onPress={() => handleFilterChange({ onlyAvailableIngredients: !recipesState.filters.onlyAvailableIngredients })}
            className="available-filter"
          >
            <Icon name="check-circle" size={16} />
            <span>Available Ingredients</span>
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="recipes-screen__active-filters">
          <div className="active-filters__header">
            <span>Active Filters ({activeFiltersCount})</span>
            <Button
              variant="ghost"
              size="sm"
              onPress={() => setRecipesState(prev => ({
                ...prev,
                filters: {
                  query: prev.query,
                  categories: [],
                  difficulty: [],
                  prepTimeRange: { min: 0, max: 120 },
                  favoriteOnly: false,
                  onlyAvailableIngredients: false,
                },
              }))}
              className="clear-filters"
            >
              Clear All
            </Button>
          </div>
        </div>
      )}

      {/* Sort and View Controls */}
      <div className="recipes-screen__controls">
        <div className="control-group">
          <span className="control-label">Sort by:</span>
          <Select
            value={`${recipesState.sortBy}-${recipesState.sortOrder}`}
            onSelect={(value: string) => {
              const [sortBy, sortOrder] = value.split('-') as [RecipeFilters['sortBy'], RecipeFilters['sortOrder']];
              handleFilterChange({ sortBy, sortOrder });
            }}
            options={[
              { value: 'relevance-desc', label: 'Most Relevant' },
              { value: 'name-asc', label: 'Name (A-Z)' },
              { value: 'name-desc', label: 'Name (Z-A)' },
              { value: 'prepTime-asc', label: 'Prep Time (Shortest)' },
              { value: 'prepTime-desc', label: 'Prep Time (Longest)' },
              { value: 'rating-desc', label: 'Highest Rated' },
              { value: 'difficulty-asc', label: 'Easiest' },
              { value: 'difficulty-desc', label: 'Hardest' },
            ]}
            className="sort-select"
          />
        </div>

        <div className="control-group">
          <span className="control-label">View:</span>
          <div className="view-toggle">
            <button
              className={`view-option ${recipesState.viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setRecipesState(prev => ({ ...prev, viewMode: 'grid' }))}
              aria-label="Grid view"
            >
              <Icon name="grid-view" size={20} />
            </button>
            <button
              className={`view-option ${recipesState.viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setRecipesState(prev => ({ ...prev, viewMode: 'list' }))}
              aria-label="List view"
            >
              <Icon name="list-view" size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="recipes-screen__results">
        {recipesState.isLoading ? (
          <LoadingSpinner size="lg" />
        ) : filteredRecipes.length === 0 ? (
          <EmptyState
            title="No Recipes Found"
            description={
              recipesState.query 
                ? `No recipes found for "${recipesState.query}"`
                : 'No recipes match your current filters'
            }
            action={
              <Button onPress={() => navigate('/add-recipe')}>
                Create New Recipe
              </Button>
            }
          />
        ) : (
          <>
            <div className="results-header">
              <span>{filteredRecipes.length} recipes found</span>
            </div>

            <div className={`results-grid ${recipesState.viewMode === 'list' ? 'results-list' : ''}`}>
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onPress={() => handleRecipePress(recipe)}
                  onSelect={() => onRecipeSelect?.(recipe)}
                  onFavoriteToggle={() => handleFavoriteToggle(recipe.id, recipe.isFavorite)}
                  isFavorite={savedFavorites.includes(recipe.id)}
                  isAvailableForCooking={recipe.isAvailableForCooking}
                  viewMode={recipesState.viewMode}
                  className="recipe-item"
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Floating Action Button */}
      <Button
        variant="primary"
        onPress={() => navigate('/add-recipe')}
        className="recipes-screen__fab"
        aria-label="Add new recipe"
      >
        <Icon name="add" size={24} />
      </Button>
    </Container>
  );
};
```

## Features
### 1. Recipe Search Algorithm
```typescript
// Recipe relevance scoring
const calculateRecipeRelevance = (recipe: Recipe, query: string, availableIngredients: string[]): number => {
  const queryLower = query.toLowerCase();
  let score = 0;

  // Name matching (highest weight)
  if (recipe.name.toLowerCase().includes(queryLower)) {
    if (recipe.name.toLowerCase() === queryLower) {
      score += 100; // Exact match
    } else if (recipe.name.toLowerCase().startsWith(queryLower)) {
      score += 80; // Starts with
    } else {
      score += 60; // Contains
    }
  }

  // Description matching (medium weight)
  if (recipe.description && recipe.description.toLowerCase().includes(queryLower)) {
    score += 40;
  }

  // Ingredient matching (low weight)
  const ingredientMatches = recipe.ingredients.filter(ing => 
    ing.name.toLowerCase().includes(queryLower)
  ).length;
  score += ingredientMatches * 10;

  // Cuisine matching (low weight)
  if (recipe.cuisine && recipe.cuisine.toLowerCase().includes(queryLower)) {
    score += 20;
  }

  // Bonus for available ingredients
  const availableIngredientNames = new Set(availableIngredients.map(ing => ing.toLowerCase()));
  const availableIngredientsCount = recipe.ingredients.filter(ing => 
    availableIngredientNames.has(ing.name.toLowerCase())
  ).length;
  const availableRatio = availableIngredientsCount / recipe.ingredients.length;
  score += availableRatio * 25;

  // Bonus for favorites
  if (savedFavorites.includes(recipe.id)) {
    score += 15;
  }

  // Bonus for highly rated recipes
  if (recipe.rating >= 4.5) {
    score += 10;
  }

  return score;
};
```

### 2. Ingredient Availability Check
```typescript
// Check if recipe ingredients are available in pantry
const useIngredientAvailability = (recipeIngredients: RecipeIngredient[]) => {
  const [availableIngredients, setAvailableIngredients] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const checkAvailability = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Get available pantry ingredients
      const pantryItems = await dispatch(fetchPantryItems());
      const availableNames = pantryItems.map(item => item.name.toLowerCase());
      
      setAvailableIngredients(availableNames);
    } catch (error) {
      console.error('Failed to check ingredient availability:', error);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const isAvailable = useCallback((recipe: Recipe): boolean => {
    const recipeIngredientNames = recipe.ingredients.map(ing => ing.name.toLowerCase());
    return recipeIngredientNames.every(name => availableIngredients.includes(name));
  }, [availableIngredients]);

  return { availableIngredients, checkAvailability, isAvailable, isLoading };
};
```

### 3. Recipe Categories Management
```typescript
// Recipe categories with icons and colors
const RECIPE_CATEGORIES = {
  breakfast: {
    name: 'Breakfast',
    icon: 'breakfast',
    color: '#FFB74D',
  },
  lunch: {
    name: 'Lunch',
    icon: 'lunch',
    color: '#4CAF50',
  },
  dinner: {
    name: 'Dinner',
    icon: 'dinner',
    color: '#F44336',
  },
  snack: {
    name: 'Snack',
    icon: 'snack',
    color: '#FF9800',
  },
  dessert: {
    name: 'Dessert',
    icon: 'dessert',
    color: '#E91E63',
  },
  beverage: {
    name: 'Beverage',
    icon: 'beverage',
    color: '#9C27B0',
  },
  other: {
    name: 'Other',
    icon: 'restaurant',
    color: '#607D8B',
  },
};

const getCategoryIcon = (category: RecipeCategory): string => {
  return RECIPE_CATEGORIES[category]?.icon || 'restaurant';
};

const getCategoryColor = (category: RecipeCategory): string => {
  return RECIPE_CATEGORIES[category]?.color || '#607D8B';
};
```

## Styling
```css
/* Screen container */
.recipes-screen {
  min-height: 100vh;
  padding-bottom: 80px;
}

/* Search section */
.recipes-screen__search-section {
  padding: 16px;
  background-color: var(--background-color);
  border-bottom: 1px solid var(--border-color);
}

.recipes-screen__search-input {
  font-size: 16px;
  padding: 12px 16px;
  border-radius: 8px;
  border: 2px solid var(--border-color);
  background-color: var(--background-color);
  margin-bottom: 16px;
}

.recipes-screen__search-input:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.2);
}

/* Filter controls */
.recipes-screen__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 16px;
  background-color: var(--background-secondary);
  border-bottom: 1px solid var(--border-color);
}

.filter-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.filter-select {
  min-width: 150px;
  flex: 1;
}

.favorite-filter,
.available-filter {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.favorite-filter:hover,
.available-filter:hover {
  background-color: var(--background-hover);
}

/* Sort and view controls */
.recipes-screen__controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: var(--background-color);
  border-bottom: 1px solid var(--border-color);
}

.control-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  white-space: nowrap;
}

.view-toggle {
  display: flex;
  background-color: var(--background-secondary);
  border-radius: 8px;
  padding: 2px;
}

.view-option {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  background: none;
  border: none;
  border-radius: 6px;
  color: var(--text-secondary);
  transition: all 0.2s ease;
  cursor: pointer;
}

.view-option:hover {
  background-color: var(--background-hover);
}

.view-option.active {
  background-color: var(--primary-color);
  color: white;
}

.sort-select {
  min-width: 180px;
}

/* Active filters */
.recipes-screen__active-filters {
  background-color: var(--background-secondary);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.active-filters__header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.clear-filters {
  font-size: 12px;
  color: var(--text-secondary);
  padding: 6px 12px;
  border-radius: 6px;
  background: none;
  border: 1px solid var(--border-color);
}

.clear-filters:hover {
  background-color: var(--background-hover);
  color: var(--text-primary);
}

/* Results */
.recipes-screen__results {
  padding: 16px;
  flex: 1;
}

.results-header {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 16px;
  text-align: center;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  animation: fadeInUp 0.3s ease-out;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  animation: fadeInUp 0.3s ease-out;
}

.recipe-item {
  transition: transform 0.2s ease;
}

.recipe-item:hover {
  transform: translateY(-4px);
}

/* Floating Action Button */
.recipes-screen__fab {
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
  .results-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .filter-row {
    flex-direction: column;
    gap: 8px;
  }
  
  .filter-select {
    width: 100%;
  }
  
  .recipes-screen__controls {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
}

@media (min-width: 769px) {
  .recipes-screen {
    max-width: 1200px;
    margin: 0 auto;
  }
}

/* Animation states */
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
.recipes-screen__search-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.2);
}

.view-option:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* Dark theme support */
@media (prefers-color-scheme: dark) {
  .recipes-screen__filters,
  .recipes-screen__controls {
    background-color: var(--background-secondary-dark);
  }
}
```

## Accessibility Features
```typescript
// Screen reader support
const AccessibleRecipesScreen: React.FC<RecipesScreenProps> = (props) => {
  const announceSearchResults = useCallback((count: number, query: string) => {
    const announcement = count === 0 
      ? `No recipes found for ${query}`
      : `${count} recipes found for ${query}`;
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
    <div role="main" aria-label="Recipe search and browsing">
      {/* Hidden live region */}
      <div
        id="screen-reader-announcements"
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      />
      
      <RecipesScreen
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
  
  if (!focusedElement?.closest('.recipes-screen')) return;

  switch (event.key) {
    case '/':
      event.preventDefault();
      document.querySelector('.recipes-screen__search-input')?.focus();
      break;
    case 'f':
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        setRecipesState(prev => ({ ...prev, favoriteOnly: !prev.filters.favoriteOnly }));
      }
      break;
    case 'g':
      event.preventDefault();
      navigate('/add-recipe');
      break;
    case 'Escape':
      if (recipesState.query) {
        event.preventDefault();
        setRecipesState(prev => ({ ...prev, query: '', suggestions: [] }));
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
  if (!recipesState.query) return [];
  return searchRecipes(recipes || [], recipesState.query, recipesState.filters);
}, [recipes, recipesState.query, recipesState.filters]);

// Memoize filter count
const activeFiltersCount = useMemo(() => {
  return Object.values(recipesState.filters).filter(Boolean).length;
}, [recipesState.filters]);

// Memoize event handlers
const handleQueryChange = useCallback((query: string) => {
  setRecipesState(prev => ({ ...prev, query }));
  debouncedSearch(query);
}, [debouncedSearch]);
```

### Virtual Scrolling
```typescript
// Virtual list for large recipe sets
const VirtualizedRecipeResults: React.FC<{ results: Recipe[] }> = ({ results }) => {
  const [shouldVirtualize, setShouldVirtualize] = useState(false);

  useEffect(() => {
    setShouldVirtualize(results.length > 24);
  }, [results.length]);

  if (shouldVirtualize) {
    return (
      <FixedSizeList
        height={window.innerHeight - 200}
        itemCount={results.length}
        itemSize={280}
        itemData={results}
      >
        {({ index, style, data }) => (
          <div style={style}>
            <RecipeCard
              recipe={data[index]}
              viewMode="grid"
            />
          </div>
        )}
      </FixedSizeList>
    );
  }

  return (
    <div className="results-grid">
      {results.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          viewMode="grid"
        />
      ))}
    </div>
  );
};
```

## Testing Strategy
### Unit Tests
```typescript
describe('RecipesScreen Component', () => {
  const mockRecipes = [
    {
      id: '1',
      name: 'Tomato Soup',
      description: 'A delicious tomato soup',
      prepTime: 30,
      cookTime: 45,
      servings: 4,
      difficulty: 'easy',
      ingredients: [
        { id: '1', name: 'tomatoes', quantity: 4, unit: 'pc', isAvailable: true },
        { id: '2', name: 'onion', quantity: 1, unit: 'pc', isAvailable: true },
      ],
      category: 'lunch',
      isFavorite: false,
      rating: 4.5,
    },
  ];

  test('renders search input correctly', () => {
    render(<RecipesScreen recipes={mockRecipes} />);
    
    expect(screen.getByPlaceholderText('Search recipes...')).toBeInTheDocument();
    expect(screen.getByLabelText('Refresh recipes')).toBeInTheDocument();
  });

  test('filters recipes based on query', async () => {
    render(<RecipesScreen recipes={mockRecipes} />);
    
    const searchInput = screen.getByPlaceholderText('Search recipes...');
    fireEvent.change(searchInput, { target: { value: 'Tomato' } });
    
    await waitFor(() => {
      expect(screen.getByText('Tomato Soup')).toBeInTheDocument();
      expect(screen.queryByText('Chicken Soup')).not.toBeInTheDocument();
    });
  });

  test('applies category filter correctly', async () => {
    render(<RecipesScreen recipes={mockRecipes} />);
    
    const categoryFilter = screen.getByDisplayValue('All Categories');
    fireEvent.change(categoryFilter, { target: { value: 'lunch' } });
    
    await waitFor(() => {
      expect(screen.getByText('Tomato Soup')).toBeInTheDocument();
      expect(screen.queryByText('Breakfast Items')).not.toBeInTheDocument();
    });
  });

  test('toggles favorite status correctly', () => {
    const mockOnFavoriteToggle = jest.fn();
    
    render(<RecipesScreen recipes={mockRecipes} onFavoriteToggle={mockOnFavoriteToggle} />);
    
    const favoriteButton = screen.getByLabelText('Add to favorites');
    fireEvent.click(favoriteButton);
    
    expect(mockOnFavoriteToggle).toHaveBeenCalledWith('1', true);
  });

  test('switches view modes correctly', () => {
    render(<RecipesScreen recipes={mockRecipes} />);
    
    const listViewButton = screen.getByLabelText('List view');
    fireEvent.click(listViewButton);
    
    expect(screen.getByLabelText('List view')).toHaveClass('active');
  });
});
```

### Integration Tests
```typescript
describe('RecipesScreen Integration', () => {
  test('integrates with global state', () => {
    const mockDispatch = jest.fn();
    jest.mock('react-redux', () => ({
      useDispatch: () => mockDispatch,
      useSelector: () => ({
        recipes: {
          recipes: mockRecipes,
          favorites: ['1'],
        },
      }),
    }));
    
    render(<RecipesScreen />);
    
    expect(screen.getByPlaceholderText('Search recipes...')).toBeInTheDocument();
  });

  test('persists favorite recipes', () => {
    const { setItem, getItem } = localStorage;
    
    render(<RecipesScreen recipes={mockRecipes} />);
    
    // Toggle favorite
    const favoriteButton = screen.getByLabelText('Add to favorites');
    fireEvent.click(favoriteButton);
    
    expect(setItem).toHaveBeenCalledWith(
      'pantry_recipe_favorites',
      expect.arrayContaining(['1'])
    );
  });
});
```

## Error Handling
```typescript
// Recipe search error handling
const useRecipeSearchErrorHandling = () => {
  const [searchError, setSearchError] = useState<string>('');

  const handleSearchError = useCallback((error: Error) => {
    if (error instanceof NetworkError) {
      setSearchError('Network error. Please check your connection.');
    } else if (error instanceof TimeoutError) {
      setSearchError('Recipe search timed out. Please try again.');
    } else {
      setSearchError('Recipe search failed. Please try again.');
    }
    
    // Clear error after 5 seconds
    setTimeout(() => setSearchError(''), 5000);
  }, []);

  return { searchError, handleSearchError };
};

// Fallback recipe display
const useFallbackRecipeDisplay = () => {
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  const displayFallbackRecipes = useCallback(() => {
    setIsUsingFallback(true);
    
    // Show cached or default recipes when API fails
    const cachedRecipes = getCachedRecipes();
    if (cachedRecipes.length > 0) {
      return cachedRecipes;
    }
    
    // Return default recipe suggestions
    return getDefaultRecipeSuggestions();
  }, []);

  return { isUsingFallback, displayFallbackRecipes };
};
```

## Documentation Links
- [App Component](../core/App.md)
- [Layout Component](../core/Layout.md)
- [Header Component](../core/Header.md)
- [Input Component](../common/Input.md)
- [Select Component](../common/Select.md)
- [RecipeCard Component](../product-features/RecipeCard.md)
- [RecipeDetail Component](../product-features/RecipeDetail.md)

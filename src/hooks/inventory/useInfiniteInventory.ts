import { useCallback, useMemo } from 'react';
import { useInventoryStore } from '@/stores/inventory/inventoryStore';

/**
 * Hook for managing infinite inventory list with pagination and filtering
 * 
 * @returns Object containing data, loading states, and actions
 */
export function useInfiniteInventory() {
  // Select individual pieces from store to avoid unnecessary re-renders
  const foodItems = useInventoryStore((state) => state.foodItems);
  const isLoading = useInventoryStore((state) => state.isLoading);
  const isFetching = useInventoryStore((state) => state.isFetching);
  const hasMore = useInventoryStore((state) => state.hasMore);
  const categoryFilter = useInventoryStore((state) => state.categoryFilter);
  const searchQuery = useInventoryStore((state) => state.searchQuery);

  // Actions from store
  const loadMoreItems = useInventoryStore((state) => state.loadMoreItems);
  const refetch = useInventoryStore((state) => state.refetch);
  const resetPagination = useInventoryStore((state) => state.resetPagination);
  const setCategoryFilter = useInventoryStore((state) => state.setCategoryFilter);
  const setSearchQuery = useInventoryStore((state) => state.setSearchQuery);
  const clearFilters = useInventoryStore((state) => state.clearFilters);

  // Computed: filtered items based on current filters
  const filteredItems = useMemo(() => {
    let filtered = [...foodItems];
    
    if (categoryFilter) {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }
    
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(lowerQuery)
      );
    }
    
    return filtered;
  }, [foodItems, categoryFilter, searchQuery]);

  // Computed: total count
  const totalCount = useMemo(() => foodItems.length, [foodItems.length]);

  // Computed: filtered count
  const filteredCount = useMemo(() => filteredItems.length, [filteredItems.length]);

  // Handler: fetch next page
  const handleFetchNextPage = useCallback(async () => {
    if (!isFetching && hasMore) {
      await loadMoreItems();
    }
  }, [isFetching, hasMore, loadMoreItems]);

  // Handler: refetch data
  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  // Handler: set category filter with pagination reset
  const handleSetCategoryFilter = useCallback(
    (category: string | null) => {
      setCategoryFilter(category);
      resetPagination();
    },
    [setCategoryFilter, resetPagination]
  );

  // Handler: set search query with pagination reset
  const handleSetSearchQuery = useCallback(
    (query: string) => {
      setSearchQuery(query || null);
      resetPagination();
    },
    [setSearchQuery, resetPagination]
  );

  // Handler: clear all filters
  const handleClearFilters = useCallback(() => {
    clearFilters();
    resetPagination();
  }, [clearFilters, resetPagination]);

  return {
    // Data
    foodItems,
    filteredItems,

    // Loading states
    isLoading,
    isFetching,
    hasMore,

    // Actions
    fetchNextPage: handleFetchNextPage,
    refetch: handleRefetch,

    // Filters
    categoryFilter,
    searchQuery: searchQuery || '',
    setCategoryFilter: handleSetCategoryFilter,
    setSearchQuery: handleSetSearchQuery,
    clearFilters: handleClearFilters,

    // Stats
    totalCount,
    filteredCount,
  };
}
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type {} from '@redux-devtools/extension';
import type { FoodItem } from '@/types/inventory/types';
import { MOCK_FOOD_ITEMS } from '@/mocks/inventory/foodItems';
import { getFoodItemStatus } from '@/types/inventory/types';
import { PAGE_SIZE } from '@/types/inventory/constants';

/**
 * Inventory store state interface
 */
interface InventoryState {
  // Data
  foodItems: FoodItem[];
  
  // Loading States
  isLoading: boolean;
  isFetching: boolean;
  
  // Pagination
  hasMore: boolean;
  currentPage: number;
  pageSize: number;
  
  // Filters
  categoryFilter: string | null;
  searchQuery: string | null;
  
  // Actions - Data Management
  addFoodItem: (item: FoodItem) => void;
  updateFoodItem: (id: string, data: Partial<FoodItem>) => void;
  deleteFoodItem: (id: string) => void;
  
  // Actions - Pagination
  loadMoreItems: () => Promise<void>;
  refetch: () => Promise<void>;
  resetPagination: () => void;
  
  // Actions - Filters
  setCategoryFilter: (category: string | null) => void;
  setSearchQuery: (query: string | null) => void;
  clearFilters: () => void;
  
  // Actions - Loading
  setLoading: (loading: boolean) => void;
  setFetching: (fetching: boolean) => void;
  
  // Actions - Utilities
  clearItems: () => void;
  getItemById: (id: string) => FoodItem | undefined;
  getExpiringItems: (days?: number) => FoodItem[];
  getFilteredItems: () => FoodItem[];
}

/**
 * Create inventory store with devtools and persist middleware
 */
export const useInventoryStore = create<InventoryState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        foodItems: [],
        isLoading: false,
        isFetching: false,
        hasMore: true,
        currentPage: 1,
        pageSize: PAGE_SIZE,
        categoryFilter: null,
        searchQuery: null,

        // Actions - Data Management
        addFoodItem: (item) => {
          set((state) => ({
            foodItems: [item, ...state.foodItems],
          }));
        },

        updateFoodItem: (id, data) => {
          set((state) => ({
            foodItems: state.foodItems.map((item) =>
              item.id === id ? { ...item, ...data, updatedAt: new Date().toISOString() } : item
            ),
          }));
        },

        deleteFoodItem: (id) => {
          set((state) => ({
            foodItems: state.foodItems.filter((item) => item.id !== id),
          }));
        },

        // Actions - Pagination
        loadMoreItems: async () => {
          const { currentPage, pageSize, categoryFilter, searchQuery, isFetching } = get();
          
          if (isFetching) return;
          
          set({ isFetching: true });
          
          // Simulate API call delay
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          // Get filtered items
          let filteredItems = [...MOCK_FOOD_ITEMS];
          
          if (categoryFilter) {
            filteredItems = filteredItems.filter((item) => item.category === categoryFilter);
          }
          
          if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            filteredItems = filteredItems.filter((item) =>
              item.name.toLowerCase().includes(lowerQuery)
            );
          }
          
          // Get next page
          const start = currentPage * pageSize;
          const end = start + pageSize;
          const newItems = filteredItems.slice(start, end);
          
          set((state) => ({
            foodItems: [...state.foodItems, ...newItems],
            currentPage: currentPage + 1,
            hasMore: end < filteredItems.length,
            isFetching: false,
          }));
        },

        refetch: async () => {
          const { pageSize, categoryFilter, searchQuery } = get();
          
          set({ isLoading: true, foodItems: [], currentPage: 1 });
          
          // Simulate API call delay
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          // Get filtered items
          let filteredItems = [...MOCK_FOOD_ITEMS];
          
          if (categoryFilter) {
            filteredItems = filteredItems.filter((item) => item.category === categoryFilter);
          }
          
          if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            filteredItems = filteredItems.filter((item) =>
              item.name.toLowerCase().includes(lowerQuery)
            );
          }
          
          // Get first page
          const end = pageSize;
          const firstPageItems = filteredItems.slice(0, end);
          
          set({
            foodItems: firstPageItems,
            hasMore: end < filteredItems.length,
            isLoading: false,
          });
        },

        resetPagination: () => {
          set({
            currentPage: 1,
            hasMore: true,
            foodItems: [],
          });
        },

        // Actions - Filters
        setCategoryFilter: (category) => {
          set({ categoryFilter: category });
        },

        setSearchQuery: (query) => {
          set({ searchQuery: query });
        },

        clearFilters: () => {
          set({
            categoryFilter: null,
            searchQuery: null,
          });
        },

        // Actions - Loading
        setLoading: (loading) => {
          set({ isLoading: loading });
        },

        setFetching: (fetching) => {
          set({ isFetching: fetching });
        },

        // Actions - Utilities
        clearItems: () => {
          set({ foodItems: [] });
        },

        getItemById: (id) => {
          return get().foodItems.find((item) => item.id === id);
        },

        getExpiringItems: (days = 7) => {
          const { foodItems } = get();
          const threshold = new Date();
          threshold.setDate(threshold.getDate() + days);
          
          return foodItems.filter((item) => {
            if (!item.expirationDate) return false;
            const status = getFoodItemStatus(item.expirationDate);
            return status === 'expiring-soon' || status === 'expired';
          });
        },

        getFilteredItems: () => {
          const { foodItems, categoryFilter, searchQuery } = get();
          
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
        },
      }),
      {
        name: 'inventory-storage',
        partialize: (state) => ({
          foodItems: state.foodItems,
          categoryFilter: state.categoryFilter,
          searchQuery: state.searchQuery,
        }),
      }
    ),
    { name: 'InventoryStore' }
  )
);

/**
 * Selectors for common use cases
 */
export const selectFoodItems = (state: InventoryState) => state.foodItems;
export const selectIsLoading = (state: InventoryState) => state.isLoading;
export const selectIsFetching = (state: InventoryState) => state.isFetching;
export const selectHasMore = (state: InventoryState) => state.hasMore;
export const selectCategoryFilter = (state: InventoryState) => state.categoryFilter;
export const selectSearchQuery = (state: InventoryState) => state.searchQuery;
export const selectFilteredItems = (state: InventoryState) => state.getFilteredItems();
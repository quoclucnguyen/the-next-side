# ProductDetailScreen Component

## Overview
Màn hình chi tiết sản phẩm, hiển thị thông tin đầy đủ về một mặt hàng cụ thể trong tủ bếp. Bao gồm hình ảnh, thông tin cơ bản, lịch sử mua hàng, và gợi ý công thức sử dụng sản phẩm.

## Props Interface
```typescript
interface ProductDetailScreenProps {
  productId: string;
  product?: Product;
  loading?: boolean;
  error?: string | null;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
  onShare?: (product: Product) => void;
  onRefresh?: () => Promise<void>;
  className?: string;
}

interface Product {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: ProductCategory;
  expirationDate: string;
  addedDate: string;
  brand?: string;
  imageUrl?: string;
  notes?: string;
  purchaseHistory: PurchaseRecord[];
  nutritionalInfo?: NutritionalInfo;
  storageInstructions?: string;
}

interface PurchaseRecord {
  id: string;
  date: string;
  store: string;
  price: number;
  quantity: number;
  unit: string;
}

interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

type ProductCategory = 'FRIDGE' | 'FREEZER' | 'DRY_PANTRY' | 'OTHER';
```

## State Management
```typescript
// Local state
const [screenState, setScreenState] = useState({
    isEditing: false,
    isDeleting: false,
    isSharing: false,
    activeTab: 'details' as 'details' | 'history' | 'recipes',
    showFullImage: false,
  });

// Global state interaction
const { 
  product: globalProduct, 
  loading: globalLoading, 
  error: globalError 
} = useSelector((state: RootState) => state.productDetail);
const dispatch = useDispatch();

const product = propProduct || globalProduct;
const loading = loading !== undefined ? loading : globalLoading;
const error = error !== undefined ? error : globalError;
```

## Dependencies
```typescript
// External dependencies
import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Internal dependencies
import { Container } from '../core/Container';
import { Header } from '../core/Header';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorState } from '../common/ErrorState';
import { ProductImage } from '../product-features/ProductImage';
import { ProductDetails } from '../product-features/ProductDetails';
import { PurchaseHistory } from '../product-features/PurchaseHistory';
import { RecipeSuggestions } from '../product-features/RecipeSuggestions';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { ShareDialog } from '../common/ShareDialog';
import { cn } from '../utils/cn';
import { useImageModal } from '../hooks/useImageModal';
import { formatDate } from '../utils/dateUtils';
import { formatCurrency } from '../utils/currencyUtils';
```

## Usage Example
```typescript
const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  productId,
  product: propProduct,
  loading: propLoading,
  error: propError,
  onEdit,
  onDelete,
  onShare,
  onRefresh,
  className
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const actualProductId = productId || id;

  // Global state integration
  const dispatch = useDispatch();
  const { product: globalProduct, loading: globalLoading } = useSelector((state: RootState) => state.productDetail);

  const product = propProduct || globalProduct;
  const loading = propLoading !== undefined ? propLoading : globalLoading;

  // Load product data
  useEffect(() => {
    if (actualProductId && !product) {
      dispatch(fetchProductDetail(actualProductId));
    }
  }, [actualProductId, product, dispatch]);

  // Event handlers
  const handleEdit = useCallback(() => {
    setScreenState(prev => ({ ...prev, isEditing: true }));
    onEdit?.(product);
    navigate(`/edit-product/${actualProductId}`);
  }, [product, onEdit, navigate, actualProductId]);

  const handleDelete = useCallback(async () => {
    setScreenState(prev => ({ ...prev, isDeleting: true }));
    
    try {
      await dispatch(deleteProduct(actualProductId));
      navigate('/');
    } catch (error) {
      console.error('Failed to delete product:', error);
    } finally {
      setScreenState(prev => ({ ...prev, isDeleting: false }));
    }
  }, [actualProductId, dispatch, navigate]);

  const handleShare = useCallback(async () => {
    setScreenState(prev => ({ ...prev, isSharing: true }));
    
    try {
      await onShare?.(product);
    } finally {
      setScreenState(prev => ({ ...prev, isSharing: false }));
    }
  }, [product, onShare]);

  const handleRefresh = useCallback(async () => {
    setScreenState(prev => ({ ...prev, isRefreshing: true }));
    
    try {
      await onRefresh?.();
      await dispatch(fetchProductDetail(actualProductId));
    } finally {
      setScreenState(prev => ({ ...prev, isRefreshing: false }));
    }
  }, [actualProductId, dispatch, onRefresh]);

  const handleImagePress = useCallback(() => {
    setScreenState(prev => ({ ...prev, showFullImage: true }));
  }, []);

  const handleTabChange = useCallback((tab: typeof screenState.activeTab) => {
    setScreenState(prev => ({ ...prev, activeTab: tab }));
  }, []);

  const isExpired = product ? isProductExpired(product) : false;
  const isExpiringSoon = product ? isProductExpiringSoon(product) : false;

  return (
    <Container variant="default" className="product-detail-screen">
      {/* Header */}
      <Header
        title={product?.name || 'Product Details'}
        showBackButton
        rightComponent={
          <div className="product-detail-screen__header-actions">
            <Button
              variant="ghost"
              size="sm"
              onPress={handleShare}
              disabled={screenState.isSharing}
              aria-label="Share product"
            >
              <Icon name="share" size={20} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onPress={handleEdit}
              aria-label="Edit product"
            >
              <Icon name="edit" size={20} />
            </Button>
          </div>
        }
      />

      {/* Content */}
      {loading ? (
        <LoadingSpinner size="lg" />
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={handleRefresh}
        />
      ) : !product ? (
        <div className="product-detail-screen__not-found">
          <h2>Product Not Found</h2>
          <p>The product you're looking for doesn't exist.</p>
          <Button onPress={() => navigate('/')}>
            Go Back to Pantry
          </Button>
        </div>
      ) : (
        <div className="product-detail-screen__content">
          {/* Product Header */}
          <div className="product-detail-screen__header">
            <ProductImage
              src={product.imageUrl}
              alt={product.name}
              onPress={handleImagePress}
              className="product-detail-screen__image"
            />
            
            <div className="product-detail-screen__basic-info">
              <h1 className="product-detail-screen__title">
                {product.name}
              </h1>
              
              <div className="product-detail-screen__meta">
                <span className={`product-detail-screen__category category--${product.category.toLowerCase()}`}>
                  {formatCategory(product.category)}
                </span>
                
                <span className={`product-detail-screen__status ${isExpired ? 'status--expired' : isExpiringSoon ? 'status--expiring-soon' : 'status--fresh'}`}>
                  {isExpired ? 'Expired' : isExpiringSoon ? `${getDaysUntilExpiration(product)} days left` : 'Fresh'}
                </span>
              </div>
              
              <div className="product-detail-screen__quantity">
                <span className="quantity-value">{product.quantity}</span>
                <span className="quantity-unit">{product.unit}</span>
              </div>
              
              {product.brand && (
                <div className="product-detail-screen__brand">
                  <span className="brand-label">Brand:</span>
                  <span className="brand-name">{product.brand}</span>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="product-detail-screen__tabs">
            <button
              className={`tab ${screenState.activeTab === 'details' ? 'tab--active' : ''}`}
              onClick={() => handleTabChange('details')}
            >
              Details
            </button>
            <button
              className={`tab ${screenState.activeTab === 'history' ? 'tab--active' : ''}`}
              onClick={() => handleTabChange('history')}
            >
              Purchase History
            </button>
            <button
              className={`tab ${screenState.activeTab === 'recipes' ? 'tab--active' : ''}`}
              onClick={() => handleTabChange('recipes')}
            >
              Recipes
            </button>
          </div>

          {/* Tab Content */}
          <div className="product-detail-screen__tab-content">
            {screenState.activeTab === 'details' && (
              <ProductDetails
                product={product}
                onEdit={handleEdit}
                onRefresh={handleRefresh}
              />
            )}
            
            {screenState.activeTab === 'history' && (
              <PurchaseHistory
                purchaseHistory={product.purchaseHistory}
                onRefresh={handleRefresh}
              />
            )}
            
            {screenState.activeTab === 'recipes' && (
              <RecipeSuggestions
                product={product}
                onViewRecipe={(recipe) => navigate(`/recipe/${recipe.id}`)}
              />
            )}
          </div>
        </div>
      )}

      {/* Delete button */}
      {product && (
        <div className="product-detail-screen__actions">
          <Button
            variant="danger"
            onPress={() => setScreenState(prev => ({ ...prev, showDeleteConfirm: true }))}
            disabled={screenState.isDeleting}
            className="product-detail-screen__delete-btn"
          >
            {screenState.isDeleting ? 'Deleting...' : 'Delete Product'}
          </Button>
        </div>
      )}

      {/* Image Modal */}
      {screenState.showFullImage && product?.imageUrl && (
        <ImageModal
          src={product.imageUrl}
          alt={product.name}
          onClose={() => setScreenState(prev => ({ ...prev, showFullImage: false }))}
        />
      )}

      {/* Delete Confirmation */}
      {screenState.showDeleteConfirm && (
        <ConfirmDialog
          title="Delete Product"
          message={`Are you sure you want to delete "${product?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleDelete}
          onCancel={() => setScreenState(prev => ({ ...prev, showDeleteConfirm: false }))}
          isLoading={screenState.isDeleting}
        />
      )}
    </Container>
  );
};
```

## Features
### 1. Product Status Calculation
```typescript
// Product expiration logic
const useProductStatus = (product: Product) => {
  const [status, setStatus] = useState<'fresh' | 'expiring-soon' | 'expired'>('fresh');
  const [daysUntil, setDaysUntil] = useState<number>(0);

  useEffect(() => {
    if (!product?.expirationDate) return;

    const today = new Date();
    const expirationDate = new Date(product.expirationDate);
    const diffTime = expirationDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    setDaysUntil(diffDays);

    if (diffDays < 0) {
      setStatus('expired');
    } else if (diffDays <= 3) {
      setStatus('expiring-soon');
    } else {
      setStatus('fresh');
    }
  }, [product?.expirationDate]);

  return { status, daysUntil, isExpired: status === 'expired', isExpiringSoon: status === 'expiring-soon' };
};
```

### 2. Image Modal
```typescript
// Full-screen image viewer
const useImageModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const openModal = useCallback((url: string) => {
    setImageUrl(url);
    setIsOpen(true);
    setIsLoading(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setImageUrl('');
    setIsLoading(false);
  }, []);

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const ImageModal: React.FC = () => {
    if (!isOpen) return null;

    return (
      <div className="image-modal" onClick={closeModal}>
        <div className="image-modal__content">
          {isLoading && <LoadingSpinner />}
          <img
            src={imageUrl}
            alt="Product image"
            onLoad={handleImageLoad}
            className="image-modal__image"
          />
          <button
            className="image-modal__close"
            onClick={closeModal}
            aria-label="Close image"
          >
            <Icon name="close" size={24} />
          </button>
        </div>
      </div>
    );
  };

  return { ImageModal, openModal, closeModal };
};
```

### 3. Share Functionality
```typescript
// Product sharing
const useProductShare = () => {
  const [isSharing, setIsSharing] = useState(false);

  const shareProduct = useCallback(async (product: Product) => {
    setIsSharing(true);

    try {
      const shareData = {
        title: `${product.name} - Pantry Management`,
        text: `Check out ${product.quantity} ${product.unit} of ${product.name} in my pantry!`,
        url: `${window.location.origin}/product/${product.id}`,
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(
          `${shareData.text} ${shareData.url}`
        );
        
        // Show toast notification
        showToast('Product link copied to clipboard!');
      }
    } catch (error) {
      console.error('Failed to share product:', error);
      showToast('Failed to share product');
    } finally {
      setIsSharing(false);
    }
  }, []);

  return { shareProduct, isSharing };
};
```

## Styling
```css
/* Screen container */
.product-detail-screen {
  min-height: 100vh;
  padding-bottom: 24px;
}

/* Header actions */
.product-detail-screen__header-actions {
  display: flex;
  gap: 8px;
}

/* Product header section */
.product-detail-screen__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 24px 16px;
  background: linear-gradient(135deg, var(--background-color) 0%, var(--background-secondary) 100%);
  border-radius: 0 0 24px 24px;
  margin-bottom: 24px;
}

.product-detail-screen__image {
  margin-bottom: 20px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.product-detail-screen__basic-info {
  width: 100%;
}

.product-detail-screen__title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 12px 0;
  line-height: 1.2;
}

.product-detail-screen__meta {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.product-detail-screen__category {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.category--fridge {
  background-color: #e3f2fd;
  color: #1976d2;
}

.category--freezer {
  background-color: #f3e5f5;
  color: #7b1fa2;
}

.category--dry-pantry {
  background-color: #fff3e0;
  color: #f57c00;
}

.category--other {
  background-color: #f1f3f4;
  color: #546e7a;
}

.product-detail-screen__status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status--fresh {
  background-color: #e8f5e8;
  color: #2e7d32;
}

.status--expiring-soon {
  background-color: #fff8e1;
  color: #f57f17;
}

.status--expired {
  background-color: #ffebee;
  color: #d32f2f;
}

.product-detail-screen__quantity {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
  margin-bottom: 12px;
}

.quantity-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--primary-color);
}

.quantity-unit {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-secondary);
}

.product-detail-screen__brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-secondary);
}

.brand-label {
  font-weight: 600;
}

.brand-name {
  font-weight: 500;
}

/* Tabs */
.product-detail-screen__tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 24px;
}

.tab {
  flex: 1;
  padding: 16px 8px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab:hover {
  color: var(--text-primary);
  background-color: var(--background-hover);
}

.tab--active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
  font-weight: 600;
}

/* Tab content */
.product-detail-screen__tab-content {
  padding: 0 16px;
}

/* Actions */
.product-detail-screen__actions {
  padding: 24px 16px;
  border-top: 1px solid var(--border-color);
}

.product-detail-screen__delete-btn {
  width: 100%;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
}

/* Not found state */
.product-detail-screen__not-found {
  text-align: center;
  padding: 48px 24px;
}

.product-detail-screen__not-found h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.product-detail-screen__not-found p {
  font-size: 16px;
  color: var(--text-secondary);
  margin-bottom: 24px;
  line-height: 1.5;
}

/* Image modal */
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.image-modal__content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-modal__image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.image-modal__close {
  position: absolute;
  top: 16px;
  right: 16px;
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-primary);
}

/* Responsive design */
@media (max-width: 768px) {
  .product-detail-screen__header {
    padding: 16px 12px;
  }
  
  .product-detail-screen__title {
    font-size: 20px;
  }
  
  .quantity-value {
    font-size: 28px;
  }
  
  .tab {
    padding: 12px 6px;
    font-size: 13px;
  }
}

@media (min-width: 769px) {
  .product-detail-screen__header {
    flex-direction: row;
    text-align: left;
    padding: 32px;
  }
  
  .product-detail-screen__image {
    margin-bottom: 0;
    margin-right: 32px;
    max-width: 200px;
  }
  
  .product-detail-screen__basic-info {
    flex: 1;
  }
}

/* Animation states */
.product-detail-screen__content {
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

.image-modal {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Focus states */
.product-detail-screen__header-actions button:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.tab:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: -2px;
}
```

## Accessibility Features
```typescript
// Screen reader support
const AccessibleProductDetailScreen: React.FC<ProductDetailScreenProps> = (props) => {
  const announceTabChange = useCallback((tab: string) => {
    const announcement = `Switched to ${tab} tab.`;
    const liveRegion = document.getElementById('screen-reader-announcements');
    if (liveRegion) {
      liveRegion.textContent = announcement;
    }
  }, []);

  const announceStatusChange = useCallback((status: string, daysUntil: number) => {
    const announcement = `Product status: ${status}. ${daysUntil > 0 ? `${daysUntil} days until expiration` : 'Product has expired'}.`;
    const liveRegion = document.getElementById('screen-reader-announcements');
    if (liveRegion) {
      liveRegion.textContent = announcement;
    }
  }, []);

  return (
    <div role="main" aria-label="Product details">
      {/* Hidden live region */}
      <div
        id="screen-reader-announcements"
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      />
      
      <ProductDetailScreen
        {...props}
        onTabChange={(tab) => {
          props.onTabChange?.(tab);
          announceTabChange(tab);
        }}
      />
    </div>
  );
};

// Keyboard navigation
const handleKeyDown = useCallback((event: KeyboardEvent) => {
  const focusedElement = document.activeElement;
  
  if (!focusedElement?.closest('.product-detail-screen')) return;

  switch (event.key) {
    case 'e':
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        handleEdit();
      }
      break;
    case 'Delete':
      if (event.shiftKey) {
        event.preventDefault();
        setScreenState(prev => ({ ...prev, showDeleteConfirm: true }));
      }
      break;
    case 's':
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        handleShare();
      }
      break;
    case 'Escape':
      if (screenState.showFullImage) {
        event.preventDefault();
        setScreenState(prev => ({ ...prev, showFullImage: false }));
      }
      break;
  }
}, []);
```

## Performance Optimizations
### Memoization
```typescript
// Memoize status calculations
const productStatus = useMemo(() => {
  if (!product) return null;
  
  return calculateProductStatus(product);
}, [product]);

// Memoize tab content
const tabContent = useMemo(() => {
  switch (screenState.activeTab) {
    case 'details':
      return <ProductDetails product={product} onEdit={handleEdit} />;
    case 'history':
      return <PurchaseHistory purchaseHistory={product?.purchaseHistory || []} />;
    case 'recipes':
      return <RecipeSuggestions product={product} />;
    default:
      return null;
  }
}, [screenState.activeTab, product, handleEdit]);

// Memoize event handlers
const handleEdit = useCallback(() => {
  setScreenState(prev => ({ ...prev, isEditing: true }));
  onEdit?.(product);
  navigate(`/edit-product/${actualProductId}`);
}, [product, onEdit, navigate, actualProductId]);
```

### Image Optimization
```typescript
// Lazy loading and optimization
const OptimizedProductImage: React.FC<{ src?: string; alt: string }> = ({ src, alt }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  if (imageError) {
    return (
      <div className="product-image__placeholder">
        <Icon name="image" size={48} color={var(--text-secondary)} />
        <span>No image available</span>
      </div>
    );
  }

  return (
    <div className="product-image__container">
      {!imageLoaded && <LoadingSpinner size="sm" />}
      <img
        src={src}
        alt={alt}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={`product-image ${imageLoaded ? 'product-image--loaded' : 'product-image--loading'}`}
        loading="lazy"
      />
    </div>
  );
};
```

## Testing Strategy
### Unit Tests
```typescript
describe('ProductDetailScreen Component', () => {
  const mockProduct = {
    id: '1',
    name: 'Tomatoes',
    quantity: 3,
    unit: 'pc',
    category: 'FRIDGE',
    expirationDate: '2024-12-25',
    addedDate: '2024-12-18',
    brand: 'Great Value',
    imageUrl: 'https://example.com/tomatoes.jpg',
    purchaseHistory: [
      {
        id: '1',
        date: '2024-12-18',
        store: 'Walmart',
        price: 4.98,
        quantity: 3,
        unit: 'pc',
      },
    ],
  };

  test('renders product details correctly', () => {
    render(
      <ProductDetailScreen
        productId="1"
        product={mockProduct}
      />
    );
    
    expect(screen.getByText('Tomatoes')).toBeInTheDocument();
    expect(screen.getByText('Great Value')).toBeInTheDocument();
    expect(screen.getByText('3 pc')).toBeInTheDocument();
  });

  test('shows loading state', () => {
    render(<ProductDetailScreen productId="1" loading={true} />);
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('shows error state', () => {
    render(
      <ProductDetailScreen
        productId="1"
        error="Failed to load product"
      />
    );
    
    expect(screen.getByText('Failed to load product')).toBeInTheDocument();
  });

  test('shows not found state', () => {
    render(<ProductDetailScreen productId="invalid" product={null} />);
    
    expect(screen.getByText('Product Not Found')).toBeInTheDocument();
  });

  test('navigates to edit on edit button press', () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      useNavigate: () => mockNavigate,
    }));
    
    render(
      <ProductDetailScreen
        productId="1"
        product={mockProduct}
      />
    );
    
    fireEvent.click(screen.getByLabelText('Edit product'));
    expect(mockNavigate).toHaveBeenCalledWith('/edit-product/1');
  });

  test('handles delete confirmation', () => {
    render(
      <ProductDetailScreen
        productId="1"
        product={mockProduct}
      />
    );
    
    fireEvent.click(screen.getByText('Delete Product'));
    expect(screen.getByText('Are you sure you want to delete')).toBeInTheDocument();
  });

  test('switches tabs correctly', () => {
    render(
      <ProductDetailScreen
        productId="1"
        product={mockProduct}
      />
    );
    
    fireEvent.click(screen.getByText('Purchase History'));
    expect(screen.getByText('Purchase History')).toHaveClass('tab--active');
  });
});
```

### Integration Tests
```typescript
describe('ProductDetailScreen Integration', () => {
  test('loads product data on mount', async () => {
    const mockDispatch = jest.fn();
    jest.mock('react-redux', () => ({
      useDispatch: () => mockDispatch,
    }));
    
    render(<ProductDetailScreen productId="1" />);
    
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(fetchProductDetail('1'));
    });
  });

  test('shares product correctly', async () => {
    Object.defineProperty(navigator, 'share', {
      writable: true,
      value: jest.fn().mockResolvedValue(undefined),
    });
    
    render(
      <ProductDetailScreen
        productId="1"
        product={mockProduct}
      />
    );
    
    fireEvent.click(screen.getByLabelText('Share product'));
    await waitFor(() => {
      expect(navigator.share).toHaveBeenCalledWith({
        title: 'Tomatoes - Pantry Management',
        text: 'Check out 3 pc of Tomatoes in my pantry!',
        url: expect.stringContaining('/product/1'),
      });
    });
  });
});
```

## Error Handling
```typescript
// Error boundary for product detail
const ProductDetailErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      fallback={
        <Container>
          <div className="product-detail-screen__error">
            <h2>Something went wrong</h2>
            <p>Unable to load product details. Please try again.</p>
            <Button onPress={() => window.location.reload()}>
              Reload Page
            </Button>
          </div>
        </Container>
      }
    >
      {children}
    </ErrorBoundary>
  );
};

// Retry mechanism with exponential backoff
const useProductDetailRetry = (productId: string) => {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const retryWithBackoff = useCallback(async () => {
    const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
    
    setIsRetrying(true);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    try {
      await dispatch(fetchProductDetail(productId));
      setRetryCount(0);
    } catch (error) {
      setRetryCount(prev => prev + 1);
    } finally {
      setIsRetrying(false);
    }
  }, [productId, retryCount, dispatch]);

  return { retryWithBackoff, retryCount, isRetrying };
};
```

## Documentation Links
- [App Component](../core/App.md)
- [Layout Component](../core/Layout.md)
- [Header Component](../core/Header.md)
- [ProductImage Component](../product-features/ProductImage.md)
- [ProductDetails Component](../product-features/ProductDetails.md)
- [PurchaseHistory Component](../product-features/PurchaseHistory.md)
- [RecipeSuggestions Component](../product-features/RecipeSuggestions.md)

# AddProductScreen Component

## Overview
Màn hình thêm sản phẩm mới vào tủ bếp, cung cấp form để nhập thông tin chi tiết, quét barcode, và upload hình ảnh sản phẩm. Hỗ trợ cả nhập thủ công và tự động.

## Props Interface
```typescript
interface AddProductScreenProps {
  initialProduct?: Partial<Product>;
  onSave?: (product: Omit<Product, 'id'>) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  className?: string;
}

interface ProductFormData {
  name: string;
  quantity: number;
  unit: string;
  category: ProductCategory;
  expirationDate: string;
  brand?: string;
  notes?: string;
  imageUrl?: string;
  nutritionalInfo?: NutritionalInfo;
  storageInstructions?: string;
}

interface ProductCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface Unit {
  id: string;
  name: string;
  abbreviation: string;
  type: 'weight' | 'volume' | 'count';
}

type FormStep = 'basic' | 'details' | 'image' | 'review';
```

## State Management
```typescript
// Local state
const [formState, setFormState] = useState<AddProductScreenState>({
  currentStep: 'basic',
  formData: {
    name: '',
    quantity: 1,
    unit: 'pc',
    category: 'OTHER',
    expirationDate: '',
    brand: '',
    notes: '',
    imageUrl: '',
  },
  errors: {},
  isSubmitting: false,
  isScanningBarcode: false,
  capturedImage: null,
});

// Global state interaction
const { categories, units, suggestions } = useSelector((state: RootState) => state.products);
const dispatch = useDispatch();
```

## Dependencies
```typescript
// External dependencies
import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Internal dependencies
import { Container } from '../core/Container';
import { Header } from '../core/Header';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { ImageUpload } from '../common/ImageUpload';
import { BarcodeScanner } from '../common/BarcodeScanner';
import { FormStepper } from '../common/FormStepper';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { cn } from '../utils/cn';
import { useFormValidation } from '../hooks/useFormValidation';
import { useBarcodeScanner } from '../hooks/useBarcodeScanner';
import { useCamera } from '../hooks/useCamera';
import { formatExpirationDate } from '../utils/dateUtils';
import { validateProductData } from '../utils/validation';
```

## Usage Example
```typescript
const AddProductScreen: React.FC<AddProductScreenProps> = ({
  initialProduct,
  onSave,
  onCancel,
  loading: propLoading,
  className
}) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form with initial data
  useEffect(() => {
    if (initialProduct) {
      setFormState(prev => ({
        ...prev,
        formData: {
          ...prev.formData,
          ...initialProduct,
        },
      }));
    }
  }, [initialProduct]);

  // Form validation
  const { errors, validateForm, isValid } = useFormValidation(
    formState.formData,
    validateProductData
  );

  // Barcode scanner
  const { startScanning, stopScanning, scannedCode } = useBarcodeScanner();

  // Camera for image capture
  const { captureImage, hasCamera } = useCamera();

  // Event handlers
  const handleInputChange = useCallback((field: keyof ProductFormData, value: any) => {
    setFormState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        [field]: value,
      },
      errors: {
        ...prev.errors,
        [field]: undefined,
      },
    }));
  }, []);

  const handleBarcodeScan = useCallback(async () => {
    setFormState(prev => ({ ...prev, isScanningBarcode: true }));
    
    try {
      const barcode = await startScanning();
      if (barcode) {
        const productInfo = await dispatch(fetchProductByBarcode(barcode));
        if (productInfo) {
          setFormState(prev => ({
            ...prev,
            formData: {
              ...prev.formData,
              name: productInfo.name,
              brand: productInfo.brand,
              unit: productInfo.unit,
            },
          }));
        }
      }
    } catch (error) {
      console.error('Barcode scan failed:', error);
    } finally {
      setFormState(prev => ({ ...prev, isScanningBarcode: false }));
      stopScanning();
    }
  }, [startScanning, stopScanning, dispatch]);

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setFormState(prev => ({
        ...prev,
        formData: {
          ...prev.formData,
          imageUrl,
        },
        capturedImage: file,
      }));
    };
    reader.readAsDataURL(file);
  }, []);

  const handleCameraCapture = useCallback(async () => {
    try {
      const imageFile = await captureImage();
      if (imageFile) {
        handleImageUpload(imageFile);
      }
    } catch (error) {
      console.error('Camera capture failed:', error);
    }
  }, [captureImage, handleImageUpload]);

  const handleSubmit = useCallback(async () => {
    if (!isValid()) return;

    setFormState(prev => ({ ...prev, isSubmitting: true }));

    try {
      const productData = {
        ...formState.formData,
        addedDate: new Date().toISOString(),
        purchaseHistory: [],
      };

      await onSave?.(productData);
      navigate('/');
    } catch (error) {
      console.error('Failed to save product:', error);
      setFormState(prev => ({
        ...prev,
        errors: {
          submit: 'Failed to save product. Please try again.',
        },
      }));
    } finally {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [formState.formData, isValid, onSave, navigate]);

  const handleNextStep = useCallback(() => {
    const steps: FormStep[] = ['basic', 'details', 'image', 'review'];
    const currentIndex = steps.indexOf(formState.currentStep);
    if (currentIndex < steps.length - 1) {
      setFormState(prev => ({ ...prev, currentStep: steps[currentIndex + 1] }));
    }
  }, [formState.currentStep]);

  const handlePrevStep = useCallback(() => {
    const steps: FormStep[] = ['basic', 'details', 'image', 'review'];
    const currentIndex = steps.indexOf(formState.currentStep);
    if (currentIndex > 0) {
      setFormState(prev => ({ ...prev, currentStep: steps[currentIndex - 1] }));
    }
  }, [formState.currentStep]);

  const currentStepIndex = ['basic', 'details', 'image', 'review'].indexOf(formState.currentStep);
  const totalSteps = 4;

  return (
    <Container variant="default" className="add-product-screen">
      <Header
        title={initialProduct ? 'Edit Product' : 'Add New Product'}
        showBackButton
        onBackPress={onCancel}
        rightComponent={
          <Button
            variant="ghost"
            size="sm"
            onPress={handleBarcodeScan}
            disabled={formState.isScanningBarcode}
            aria-label="Scan barcode"
          >
            <Icon name="qr-code-scanner" size={20} />
          </Button>
        }
      />

      {/* Progress stepper */}
      <FormStepper
        currentStep={currentStepIndex}
        totalSteps={totalSteps}
        steps={['Basic Info', 'Details', 'Image', 'Review']}
        className="add-product-screen__stepper"
      />

      {/* Form content */}
      <div className="add-product-screen__content">
        {formState.isScanningBarcode ? (
          <BarcodeScanner
            onScanComplete={(code) => {
              setFormState(prev => ({ ...prev, isScanningBarcode: false }));
              // Handle barcode result
            }}
            onCancel={() => setFormState(prev => ({ ...prev, isScanningBarcode: false }))}
          />
        ) : (
          <>
            {/* Step 1: Basic Information */}
            {formState.currentStep === 'basic' && (
              <div className="form-step">
                <h2 className="form-step__title">Basic Information</h2>
                
                <Input
                  label="Product Name"
                  value={formState.formData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                  error={errors.name}
                  placeholder="e.g., Tomatoes"
                  required
                  autoFocus
                />

                <div className="form-row">
                  <Input
                    label="Quantity"
                    value={formState.formData.quantity.toString()}
                    onChangeText={(value) => handleInputChange('quantity', parseFloat(value) || 1)}
                    error={errors.quantity}
                    type="number"
                    min="1"
                    step="0.1"
                    className="form-row__item"
                  />

                  <Select
                    label="Unit"
                    value={formState.formData.unit}
                    onSelect={(value) => handleInputChange('unit', value)}
                    error={errors.unit}
                    options={units}
                    className="form-row__item"
                  />
                </div>

                <Select
                  label="Category"
                  value={formState.formData.category}
                  onSelect={(value) => handleInputChange('category', value)}
                  error={errors.category}
                  options={categories}
                />

                <Input
                  label="Expiration Date"
                  value={formState.formData.expirationDate}
                  onChangeText={(value) => handleInputChange('expirationDate', value)}
                  error={errors.expirationDate}
                  type="date"
                  min={formatExpirationDate(new Date())}
                  required
                />
              </div>
            )}

            {/* Step 2: Additional Details */}
            {formState.currentStep === 'details' && (
              <div className="form-step">
                <h2 className="form-step__title">Additional Details</h2>
                
                <Input
                  label="Brand (Optional)"
                  value={formState.formData.brand || ''}
                  onChangeText={(value) => handleInputChange('brand', value)}
                  error={errors.brand}
                  placeholder="e.g., Great Value"
                />

                <Input
                  label="Notes (Optional)"
                  value={formState.formData.notes || ''}
                  onChangeText={(value) => handleInputChange('notes', value)}
                  error={errors.notes}
                  multiline
                  rows={3}
                  placeholder="Any additional notes about this product"
                />
              </div>
            )}

            {/* Step 3: Product Image */}
            {formState.currentStep === 'image' && (
              <div className="form-step">
                <h2 className="form-step__title">Product Image</h2>
                
                <ImageUpload
                  value={formState.formData.imageUrl}
                  onChange={handleImageUpload}
                  onCameraCapture={hasCamera ? handleCameraCapture : undefined}
                  placeholder="Upload or capture product image"
                  className="add-product-screen__image-upload"
                />
              </div>
            )}

            {/* Step 4: Review */}
            {formState.currentStep === 'review' && (
              <div className="form-step">
                <h2 className="form-step__title">Review Product</h2>
                
                <div className="product-review">
                  {formState.formData.imageUrl && (
                    <div className="product-review__image">
                      <img
                        src={formState.formData.imageUrl}
                        alt={formState.formData.name}
                        className="product-review__img"
                      />
                    </div>
                  )}
                  
                  <div className="product-review__info">
                    <h3>{formState.formData.name}</h3>
                    <div className="product-review__details">
                      <p><strong>Quantity:</strong> {formState.formData.quantity} {formState.formData.unit}</p>
                      <p><strong>Category:</strong> {formatCategory(formState.formData.category)}</p>
                      <p><strong>Expiration:</strong> {formatDate(formState.formData.expirationDate)}</p>
                      {formState.formData.brand && (
                        <p><strong>Brand:</strong> {formState.formData.brand}</p>
                      )}
                      {formState.formData.notes && (
                        <p><strong>Notes:</strong> {formState.formData.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Form actions */}
      <div className="add-product-screen__actions">
        {formState.currentStep > 0 && (
          <Button
            variant="outline"
            onPress={handlePrevStep}
            disabled={formState.isSubmitting}
          >
            Previous
          </Button>
        )}

        {formState.currentStep < totalSteps - 1 ? (
          <Button
            onPress={handleNextStep}
            disabled={!isValid() || formState.isSubmitting}
          >
            Next
          </Button>
        ) : (
          <Button
            variant="primary"
            onPress={handleSubmit}
            disabled={!isValid() || formState.isSubmitting || propLoading}
            loading={formState.isSubmitting || propLoading}
          >
            {initialProduct ? 'Update Product' : 'Add Product'}
          </Button>
        )}
      </div>
    </Container>
  );
};
```

## Features
### 1. Multi-Step Form
```typescript
// Step management
const useFormStepper = (initialStep: FormStep = 'basic') => {
  const [currentStep, setCurrentStep] = useState<FormStep>(initialStep);
  const [stepHistory, setStepHistory] = useState<FormStep[]>([initialStep]);

  const nextStep = useCallback(() => {
    const steps: FormStep[] = ['basic', 'details', 'image', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      setCurrentStep(nextStep);
      setStepHistory(prev => [...prev, nextStep]);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (stepHistory.length > 1) {
      const prevStep = stepHistory[stepHistory.length - 2];
      setCurrentStep(prevStep);
      setStepHistory(prev => prev.slice(0, -1));
    }
  }, [stepHistory]);

  const goToStep = useCallback((step: FormStep) => {
    const stepIndex = stepHistory.indexOf(step);
    if (stepIndex >= 0) {
      setCurrentStep(step);
      setStepHistory(prev => prev.slice(0, stepIndex + 1));
    }
  }, [stepHistory]);

  return { currentStep, nextStep, prevStep, goToStep, stepHistory };
};
```

### 2. Barcode Scanning
```typescript
// Barcode scanner integration
const useBarcodeScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string>('');

  const startScanning = useCallback(async (): Promise<string | null> => {
    setIsScanning(true);
    
    try {
      // Check if BarcodeDetector API is available
      if ('BarcodeDetector' in window) {
        const barcodeDetector = new (window as any).BarcodeDetector({
          formats: ['qr_code', 'ean_13', 'ean_8', 'upc_a', 'upc_e'],
        });

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facing: 'environment' },
        });

        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();

        // Detect barcodes continuously
        const detectBarcodes = async () => {
          const barcodes = await barcodeDetector.detect(video);
          if (barcodes.length > 0) {
            setLastScannedCode(barcodes[0].rawValue);
            stream.getTracks().forEach(track => track.stop());
            return barcodes[0].rawValue;
          }
          
          if (isScanning) {
            requestAnimationFrame(detectBarcodes);
          }
        };

        return new Promise((resolve) => {
          detectBarcodes();
        });
      } else {
        // Fallback to third-party barcode scanner library
        const { Quagga } = await import('quagga');
        
        return new Promise((resolve, reject) => {
          Quagga.init({
            inputStream: {
              name: "Live",
              type: "LiveStream",
              target: document.querySelector('#scanner-container'),
              constraints: {
                width: 640,
                height: 480,
                facingMode: "environment"
              },
            },
            decoder: {
              readers: ["ean_reader", "ean_8_reader", "code_128_reader"]
            },
          }, (err) => {
            if (err) {
              reject(err);
            } else {
              Quagga.onDetected((result) => {
                if (result.codeResult) {
                  resolve(result.codeResult.code);
                  Quagga.stop();
                }
              });
            }
          });
        });
      }
    } catch (error) {
      console.error('Barcode scanning failed:', error);
      setIsScanning(false);
      return null;
    }
  }, [isScanning]);

  const stopScanning = useCallback(() => {
    setIsScanning(false);
    // Stop camera streams and cleanup
  }, []);

  return { startScanning, stopScanning, isScanning, lastScannedCode };
};
```

### 3. Image Processing
```typescript
// Image upload and processing
const useImageProcessing = () => {
  const [processedImage, setProcessedImage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const processImage = useCallback(async (file: File): Promise<string> => {
    setIsProcessing(true);

    try {
      // Compress image
      const compressedImage = await compressImage(file, {
        maxWidth: 800,
        maxHeight: 600,
        quality: 0.8,
        format: 'webp',
      });

      // Generate thumbnail
      const thumbnail = await generateThumbnail(compressedImage, {
        width: 100,
        height: 100,
        quality: 0.6,
      });

      setProcessedImage(compressedImage);
      return compressedImage;
    } catch (error) {
      console.error('Image processing failed:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const compressImage = (file: File, options: any): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate dimensions
        let { width, height } = img;
        if (width > options.maxWidth) {
          height = (height * options.maxWidth) / width;
          width = options.maxWidth;
        }
        if (height > options.maxHeight) {
          width = (width * options.maxHeight) / height;
          height = options.maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL(`image/${options.format}`, options.quality));
      };

      img.src = URL.createObjectURL(file);
    });
  };

  return { processImage, processedImage, isProcessing };
};
```

## Styling
```css
/* Screen container */
.add-product-screen {
  min-height: 100vh;
  padding-bottom: 24px;
}

/* Stepper */
.add-product-screen__stepper {
  margin: 24px 16px;
}

/* Form content */
.add-product-screen__content {
  padding: 16px 0;
  flex: 1;
}

/* Form steps */
.form-step {
  animation: stepFadeIn 0.3s ease-out;
}

@keyframes stepFadeIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.form-step__title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 24px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--primary-color);
}

.form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.form-row__item {
  flex: 1;
}

/* Image upload */
.add-product-screen__image-upload {
  margin: 24px 0;
}

/* Product review */
.product-review {
  display: flex;
  gap: 24px;
  margin: 24px 0;
  padding: 24px;
  background-color: var(--background-secondary);
  border-radius: 12px;
}

.product-review__image {
  flex-shrink: 0;
  width: 120px;
  height: 120px;
}

.product-review__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-review__info {
  flex: 1;
}

.product-review__info h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 16px 0;
}

.product-review__details p {
  margin: 8px 0;
  color: var(--text-secondary);
  line-height: 1.5;
}

.product-review__details strong {
  color: var(--text-primary);
  font-weight: 600;
}

/* Form actions */
.add-product-screen__actions {
  display: flex;
  gap: 12px;
  padding: 24px 16px;
  border-top: 1px solid var(--border-color);
  position: sticky;
  bottom: 0;
  background-color: var(--background-color);
}

/* Barcode scanner */
.barcode-scanner-container {
  position: relative;
  width: 100%;
  height: 300px;
  background-color: #000;
  border-radius: 8px;
  overflow: hidden;
  margin: 20px 0;
}

.barcode-scanner-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  border: 2px solid var(--primary-color);
  border-radius: 8px;
  pointer-events: none;
}

.barcode-scanner-message {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  z-index: 10;
}

/* Responsive design */
@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .product-review {
    flex-direction: column;
    text-align: center;
  }
  
  .product-review__image {
    width: 100%;
    height: 200px;
    margin-bottom: 20px;
  }
  
  .add-product-screen__actions {
    flex-direction: column;
  }
  
  .add-product-screen__actions button {
    width: 100%;
  }
}

@media (min-width: 769px) {
  .add-product-screen {
    max-width: 600px;
    margin: 0 auto;
  }
}

/* Animation states */
.add-product-screen--submitting {
  pointer-events: none;
  opacity: 0.7;
}

/* Focus states */
.form-step:focus-within {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
  border-radius: 8px;
}
```

## Accessibility Features
```typescript
// Screen reader support
const AccessibleAddProductScreen: React.FC<AddProductScreenProps> = (props) => {
  const announceStepChange = useCallback((step: string) => {
    const announcement = `Moving to ${step} step.`;
    const liveRegion = document.getElementById('screen-reader-announcements');
    if (liveRegion) {
      liveRegion.textContent = announcement;
    }
  }, []);

  const announceFormErrors = useCallback((errors: Record<string, string>) => {
    const errorMessages = Object.values(errors).filter(Boolean);
    if (errorMessages.length > 0) {
      const announcement = `Form has ${errorMessages.length} error${errorMessages.length > 1 ? 's' : ''}: ${errorMessages.join(', ')}`;
      const liveRegion = document.getElementById('screen-reader-announcements');
      if (liveRegion) {
        liveRegion.textContent = announcement;
      }
    }
  }, []);

  return (
    <div role="main" aria-label="Add product form">
      {/* Hidden live region */}
      <div
        id="screen-reader-announcements"
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      />
      
      <AddProductScreen
        {...props}
        onStepChange={(step) => {
          props.onStepChange?.(step);
          announceStepChange(step);
        }}
        onFormError={(errors) => {
          announceFormErrors(errors);
        }}
      />
    </div>
  );
};

// Keyboard navigation
const handleKeyDown = useCallback((event: KeyboardEvent) => {
  const focusedElement = document.activeElement;
  
  if (!focusedElement?.closest('.add-product-screen')) return;

  switch (event.key) {
    case 'Enter':
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        handleSubmit();
      }
      break;
    case 'b':
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        handleBarcodeScan();
      }
      break;
    case 'u':
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        handleImageUpload();
      }
      break;
    case 'ArrowRight':
      if (event.ctrlKey) {
        event.preventDefault();
        handleNextStep();
      }
      break;
    case 'ArrowLeft':
      if (event.ctrlKey) {
        event.preventDefault();
        handlePrevStep();
      }
      break;
  }
}, []);
```

## Performance Optimizations
### Memoization
```typescript
// Memoize form data
const formValidation = useMemo(() => {
  return validateProductData(formState.formData);
}, [formState.formData]);

// Memoize step components
const StepComponent = useMemo(() => {
  switch (formState.currentStep) {
    case 'basic':
      return BasicInfoStep;
    case 'details':
      return DetailsStep;
    case 'image':
      return ImageStep;
    case 'review':
      return ReviewStep;
    default:
      return null;
  }
}, [formState.currentStep]);

// Memoize event handlers
const handleInputChange = useCallback((field: keyof ProductFormData, value: any) => {
  setFormState(prev => ({
    ...prev,
    formData: {
      ...prev.formData,
      [field]: value,
    },
    errors: {
      ...prev.errors,
      [field]: undefined,
    },
  }));
}, []);
```

### Image Optimization
```typescript
// Progressive image loading
const ProgressiveImageUpload: React.FC<{
  value: string;
  onChange: (url: string) => void;
}> = ({ value, onChange }) => {
  const [previewUrl, setPreviewUrl] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);

  const handleFileSelect = useCallback(async (file: File) => {
    setIsCompressing(true);
    
    try {
      // Create preview immediately
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
      
      // Compress in background
      const compressed = await compressImage(file);
      onChange(compressed);
      setPreviewUrl(compressed);
    } finally {
      setIsCompressing(false);
    }
  }, [onChange]);

  return (
    <div className="progressive-image-upload">
      <ImageUpload
        value={value}
        onChange={handleFileSelect}
        isProcessing={isCompressing}
      />
      
      {previewUrl && (
        <div className="image-preview">
          <img src={previewUrl} alt="Preview" />
          {isCompressing && (
            <div className="image-preview__overlay">
              <LoadingSpinner size="sm" />
              <span>Processing...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
```

## Testing Strategy
### Unit Tests
```typescript
describe('AddProductScreen Component', () => {
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form correctly', () => {
    render(<AddProductScreen onSave={mockOnSave} />);
    
    expect(screen.getByText('Add New Product')).toBeInTheDocument();
    expect(screen.getByLabelText('Product Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Quantity')).toBeInTheDocument();
    expect(screen.getByLabelText('Unit')).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    render(<AddProductScreen onSave={mockOnSave} />);
    
    const submitButton = screen.getByText('Add Product');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Product name is required')).toBeInTheDocument();
      expect(screen.getByText('Expiration date is required')).toBeInTheDocument();
    });
  });

  test('navigates between steps', () => {
    render(<AddProductScreen onSave={mockOnSave} />);
    
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);
    
    expect(screen.getByText('Additional Details')).toBeInTheDocument();
    
    const prevButton = screen.getByText('Previous');
    fireEvent.click(prevButton);
    
    expect(screen.getByText('Basic Information')).toBeInTheDocument();
  });

  test('submits form with valid data', async () => {
    mockOnSave.mockResolvedValue(undefined);
    
    render(<AddProductScreen onSave={mockOnSave} />);
    
    // Fill form
    fireEvent.change(screen.getByLabelText('Product Name'), { target: { value: 'Tomatoes' } });
    fireEvent.change(screen.getByLabelText('Quantity'), { target: { value: '3' } });
    fireEvent.change(screen.getByLabelText('Unit'), { target: { value: 'pc' } });
    
    // Navigate to submit
    fireEvent.click(screen.getByText('Next'));
    fireEvent.click(screen.getByText('Next'));
    fireEvent.click(screen.getByText('Next'));
    
    const submitButton = screen.getByText('Add Product');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Tomatoes',
          quantity: 3,
          unit: 'pc',
        })
      );
    });
  });

  test('handles image upload', async () => {
    render(<AddProductScreen onSave={mockOnSave} />);
    
    const fileInput = screen.getByLabelText('Upload product image');
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    });
    
    fireEvent.change(fileInput);
    
    await waitFor(() => {
      expect(screen.getByAltText('Product image')).toBeInTheDocument();
    });
  });
});
```

### Integration Tests
```typescript
describe('AddProductScreen Integration', () => {
  test('integrates with barcode scanner', async () => {
    const mockScanBarcode = jest.fn().mockResolvedValue('123456789');
    
    render(<AddProductScreen onSave={mockOnSave} />);
    
    fireEvent.click(screen.getByLabelText('Scan barcode'));
    
    await waitFor(() => {
      expect(mockScanBarcode).toHaveBeenCalled();
    });
  });

  test('saves product to global state', async () => {
    const mockDispatch = jest.fn();
    jest.mock('react-redux', () => ({
      useDispatch: () => mockDispatch,
    }));
    
    render(<AddProductScreen onSave={mockOnSave} />);
    
    // Fill and submit form
    // ... form filling code ...
    
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'products/addProduct',
        })
      );
    });
  });
});
```

## Error Handling
```typescript
// Form error handling
const useFormErrorHandling = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFieldError = useCallback((field: string, error: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: error,
    }));
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => {
      const { [field]: removed, ...rest } = prev;
      return rest;
    });
  }, []);

  const hasErrors = useMemo(() => {
    return Object.values(errors).some(error => Boolean(error));
  }, [errors]);

  return { errors, handleFieldError, clearFieldError, hasErrors };
};

// Network error handling
const useSubmitErrorHandling = () => {
  const [submitError, setSubmitError] = useState<string>('');

  const handleSubmit = useCallback(async (data: ProductFormData) => {
    setSubmitError('');
    
    try {
      await submitProduct(data);
    } catch (error) {
      if (error instanceof NetworkError) {
        setSubmitError('Network error. Please check your connection and try again.');
      } else if (error instanceof ValidationError) {
        setSubmitError('Invalid data. Please check your form and try again.');
      } else {
        setSubmitError('An unexpected error occurred. Please try again.');
      }
    }
  }, []);

  return { submitError, handleSubmit };
};
```

## Documentation Links
- [App Component](../core/App.md)
- [Layout Component](../core/Layout.md)
- [Header Component](../core/Header.md)
- [Input Component](../common/Input.md)
- [Select Component](../common/Select.md)
- [ImageUpload Component](../common/ImageUpload.md)
- [BarcodeScanner Component](../common/BarcodeScanner.md)
- [FormStepper Component](../common/FormStepper.md)

# ProfileScreen Component

## Overview
Màn hình profile người dùng, hiển thị thông tin cá nhân, cài đặt ứng dụng, thống kê sử dụng, và các tùy chọn quản lý tài khoản. Bao gồm cả thông tin cơ bản và advanced settings.

## Props Interface
```typescript
interface ProfileScreenProps {
  user?: User;
  onUpdateProfile?: (user: Partial<User>) => Promise<void>;
  onLogout?: () => void;
  onNavigateToSettings?: () => void;
  className?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinDate: string;
  lastLoginDate: string;
  preferences: UserPreferences;
  statistics: UserStatistics;
  subscriptionType: 'free' | 'premium' | 'pro';
  isEmailVerified: boolean;
  storagePlan: StoragePlan;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: NotificationPreferences;
  privacy: PrivacySettings;
  units: UnitPreferences;
  recipes: RecipePreferences;
}

interface NotificationPreferences {
  push: boolean;
  email: boolean;
  inApp: boolean;
  recipeReminders: boolean;
  expirationAlerts: boolean;
  weeklyReport: boolean;
}

interface PrivacySettings {
  shareData: boolean;
  analytics: boolean;
  crashReporting: boolean;
}

interface UserStatistics {
  totalProducts: number;
  totalRecipes: number;
  recipesCooked: number;
  productsAdded: number;
  expirationWarnings: number;
  storageUtilization: number;
  appUsageTime: number;
  lastActiveDate: string;
}

interface StoragePlan {
  planId: string;
  name: string;
  maxStorage: number;
  usedStorage: number;
  features: string[];
  price: number;
  renewalDate?: string;
}

type FormSection = 'basic' | 'preferences' | 'notifications' | 'privacy' | 'statistics' | 'subscription';
```

## State Management
```typescript
// Local state
const [profileState, setProfileState] = useState<ProfileScreenState>({
  activeSection: 'basic',
  isLoading: false,
  isEditing: false,
  unsavedChanges: {},
  showDeleteConfirm: false,
  showSuccessMessage: false,
});

// Global state interaction
const { 
  user: globalUser,
  settings: globalSettings 
} = useSelector((state: RootState) => state.user);
const dispatch = useDispatch();

const user = propUser || globalUser;
const settings = globalSettings || {};
```

## Dependencies
```typescript
// External dependencies
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Internal dependencies
import { Container } from '../core/Container';
import { Header } from '../core/Header';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Card } from '../common/Card';
import { Avatar } from '../common/Avatar';
import { Toggle } from '../common/Toggle';
import { StatsCard } from '../common/StatsCard';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { cn } from '../utils/cn';
import { useCamera } from '../hooks/useCamera';
import { useFormValidation } from '../hooks/useFormValidation';
import { validateUserData } from '../utils/validation';
import { formatDate } from '../utils/dateUtils';
import { formatFileSize } from '../utils/formatUtils';
```

## Usage Example
```typescript
const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user: propUser,
  onUpdateProfile,
  onLogout,
  onNavigateToSettings,
  className
}) => {
  const navigate = useNavigate();
  const { captureImage } = useCamera();
  
  // Global state integration
  const { user: globalUser, settings } = useSelector((state: RootState) => state.user);
  const currentUser = propUser || globalUser;

  // Form validation
  const { errors, validateForm, isValid } = useFormValidation(
    getFormData(currentUser),
    validateUserData
  );

  // Event handlers
  const handleSectionChange = useCallback((section: FormSection) => {
    setProfileState(prev => ({ ...prev, activeSection: section }));
  }, []);

  const handleInputChange = useCallback((field: string, value: any) => {
    const newUnsavedChanges = {
      ...profileState.unsavedChanges,
      [field]: value,
    };
    
    setProfileState(prev => ({
      ...prev,
      unsavedChanges: newUnsavedChanges,
    }));
  }, []);

  const handleAvatarChange = useCallback(async (imageFile: File) => {
    try {
      const imageUrl = await uploadAvatarImage(imageFile);
      const newUnsavedChanges = {
        ...profileState.unsavedChanges,
        avatar: imageUrl,
      };
      
      setProfileState(prev => ({
        ...prev,
        unsavedChanges: newUnsavedChanges,
      }));
    } catch (error) {
      console.error('Avatar upload failed:', error);
    }
  }, []);

  const handleSave = useCallback(async () => {
    if (!isValid()) return;

    setProfileState(prev => ({ ...prev, isLoading: true }));

    try {
      const updatedProfile = {
        ...currentUser,
        ...profileState.unsavedChanges,
        updatedAt: new Date().toISOString(),
      };

      await onUpdateProfile?.(updatedProfile);
      
      setProfileState(prev => ({
        ...prev,
        isLoading: false,
        unsavedChanges: {},
        isEditing: false,
        showSuccessMessage: true,
      }));

      // Update global state
      dispatch(updateUserProfile(updatedProfile));

      // Clear success message after 3 seconds
      setTimeout(() => {
        setProfileState(prev => ({ ...prev, showSuccessMessage: false }));
      }, 3000);
    } catch (error) {
      console.error('Profile update failed:', error);
      setProfileState(prev => ({ ...prev, isLoading: false }));
    }
  }, [currentUser, onUpdateProfile, isValid]);

  const handleLogout = useCallback(async () => {
    setProfileState(prev => ({ ...prev, isLoading: true }));

    try {
      await onLogout?.();
      dispatch(logoutUser());
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      setProfileState(prev => ({ ...prev, isLoading: false }));
    }
  }, [onLogout, navigate, dispatch]);

  const handleDeleteAccount = useCallback(async () => {
    setProfileState(prev => ({ ...prev, showDeleteConfirm: false }));

    try {
      await dispatch(deleteUserAccount(currentUser.id));
      onLogout?.();
      navigate('/');
    } catch (error) {
      console.error('Account deletion failed:', error);
    }
  }, [currentUser, dispatch, onLogout, navigate]);

  const getFormData = useCallback((userData: User): Record<string, any> => {
    return {
      name: userData.name || '',
      email: userData.email || '',
      preferences: userData.preferences || getDefaultPreferences(),
    };
  }, []);

  const hasUnsavedChanges = Object.keys(profileState.unsavedChanges).length > 0;

  const renderBasicInfo = () => (
    <div className="profile-section">
      <h3 className="section-title">Basic Information</h3>
      
      <div className="avatar-section">
        <Avatar
          src={currentUser?.avatar || ''}
          size="lg"
          editable
          onChange={handleAvatarChange}
          className="profile-avatar"
        />
        
        <div className="avatar-info">
          <Button
            variant="outline"
            size="sm"
            onPress={captureImage}
            className="camera-button"
          >
            <Icon name="camera" size={16} />
          </Button>
        </div>
      </div>

      <div className="form-fields">
        <Input
          label="Name"
          value={profileState.unsavedChanges.name ?? currentUser?.name ?? ''}
          onChangeText={(value) => handleInputChange('name', value)}
          error={errors.name}
          disabled={profileState.isLoading}
          className="profile-input"
        />

        <Input
          label="Email"
          value={profileState.unsavedChanges.email ?? currentUser?.email ?? ''}
          onChangeText={(value) => handleInputChange('email', value)}
          error={errors.email}
          disabled={profileState.isLoading || currentUser?.isEmailVerified}
          className="profile-input"
        />

        <div className="info-fields">
          <div className="info-item">
            <span className="info-label">Member Since:</span>
            <span className="info-value">
              {currentUser && formatDate(currentUser.joinDate)}
            </span>
          </div>
          
          <div className="info-item">
            <span className="info-label">Last Login:</span>
            <span className="info-value">
              {currentUser && formatDate(currentUser.lastLoginDate)}
            </span>
          </div>
          
          <div className="info-item">
            <span className="info-label">Account Type:</span>
            <span className="info-value capitalize">
              {currentUser?.subscriptionType || 'Free'}
            </span>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <Button
          variant="outline"
          onPress={() => setProfileState(prev => ({ ...prev, isEditing: !prev.isEditing }))}
          disabled={profileState.isLoading}
        >
          {profileState.isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>

        {profileState.isEditing && (
          <Button
            variant="primary"
            onPress={handleSave}
            disabled={!isValid() || profileState.isLoading}
            loading={profileState.isLoading}
            className="save-button"
          >
            {profileState.isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <Container variant="default" className="profile-screen">
      <Header
        title="Profile"
        showBackButton
        rightComponent={
          <Button
            variant="ghost"
            size="sm"
            onPress={handleLogout}
            className="logout-button"
          >
            <Icon name="logout" size={20} />
          </Button>
        }
      />

      {/* Section Navigation */}
      <div className="section-navigation">
        <button
          className={`section-tab ${profileState.activeSection === 'basic' ? 'active' : ''}`}
          onClick={() => handleSectionChange('basic')}
        >
          Basic Info
        </button>
        
        <button
          className={`section-tab ${profileState.activeSection === 'preferences' ? 'active' : ''}`}
          onClick={() => handleSectionChange('preferences')}
        >
          Preferences
        </button>
        
        <button
          className={`section-tab ${profileState.activeSection === 'statistics' ? 'active' : ''}`}
          onClick={() => handleSectionChange('statistics')}
        >
          Statistics
        </button>
      </div>

      {/* Section Content */}
      {profileState.activeSection === 'basic' && renderBasicInfo()}
      
      {profileState.activeSection === 'preferences' && (
        <div className="profile-section">
          <h3 className="section-title">Preferences</h3>
          
          <div className="preference-group">
            <div className="preference-item">
              <label className="preference-label">Theme:</label>
              <Select
                value={profileState.unsavedChanges.preferences?.theme ?? currentUser?.preferences?.theme ?? 'auto'}
                onSelect={(value) => handleInputChange('preferences.theme', value)}
                options={[
                  { value: 'auto', label: 'Auto' },
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                ]}
                className="preference-select"
              />
            </div>

            <div className="preference-item">
              <label className="preference-label">Language:</label>
              <Select
                value={profileState.unsavedChanges.preferences?.language ?? currentUser?.preferences?.language ?? 'en'}
                onSelect={(value) => handleInputChange('preferences.language', value)}
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'es', label: 'Español' },
                  { value: 'fr', label: 'Français' },
                  { value: 'de', label: 'Deutsch' },
                  { value: 'it', label: 'Italiano' },
                  { value: 'pt', label: 'Português' },
                ]}
                className="preference-select"
              />
            </div>
          </div>
        </div>
      )}

      {/* Statistics Section */}
      {profileState.activeSection === 'statistics' && currentUser && (
        <div className="profile-section">
          <h3 className="section-title">Your Statistics</h3>
          
          <div className="stats-grid">
            <StatsCard
              title="Total Products"
              value={currentUser.statistics.totalProducts}
              icon="inventory"
              color="#4CAF50"
            />
            
            <StatsCard
              title="Total Recipes"
              value={currentUser.statistics.totalRecipes}
              icon="book"
              color="#FF9800"
            />
            
            <StatsCard
              title="Recipes Cooked"
              value={currentUser.statistics.recipesCooked}
              icon="check-circle"
              color="#2196F3"
            />
            
            <StatsCard
              title="Products Added"
              value={currentUser.statistics.productsAdded}
              icon="add-circle"
              color="#9C27B0"
            />
            
            <StatsCard
              title="Expiration Warnings"
              value={currentUser.statistics.expirationWarnings}
              icon="warning"
              color="#FFC107"
            />
            
            <StatsCard
              title="Storage Usage"
              value={`${currentUser.statistics.storageUtilization}%`}
              icon="storage"
              color="#795548"
            />
            
            <StatsCard
              title="App Usage"
              value={`${currentUser.statistics.appUsageTime}h`}
              icon="clock"
              color="#607D8B"
            />
          </div>
          
          <div className="stats-details">
            <div className="stat-item">
              <span className="stat-label">Last Active:</span>
              <span className="stat-value">
                {currentUser.lastActiveDate && formatDate(currentUser.lastActiveDate)}
              </span>
            </div>
            
            <div className="stat-item">
              <span className="stat-label">Account Created:</span>
              <span className="stat-value">
                {currentUser.joinDate && formatDate(currentUser.joinDate)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {profileState.showSuccessMessage && (
        <div className="success-message">
          <Icon name="check-circle" size={32} color="#4CAF50" />
          <h3>Profile Updated Successfully!</h3>
          <p>Your changes have been saved.</p>
        </div>
      )}

      {/* Delete Confirmation */}
      {profileState.showDeleteConfirm && (
        <ConfirmDialog
          title="Delete Account"
          message="Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data."
          confirmText="Delete Account"
          cancelText="Cancel"
          onConfirm={handleDeleteAccount}
          onCancel={() => setProfileState(prev => ({ ...prev, showDeleteConfirm: false }))}
        />
      )}
    </Container>
  );
};
```

## Features
### 1. Avatar Management
```typescript
// Avatar upload and processing
const useAvatarUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadAvatarImage = useCallback(async (file: File): Promise<string> => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        throw new Error('Image size must be less than 5MB');
      }

      // Compress image
      const compressedImage = await compressImage(file, {
        maxWidth: 400,
        maxHeight: 400,
        quality: 0.8,
        format: 'webp',
      });

      // Create preview
      const preview = URL.createObjectURL(compressedImage);
      setPreviewUrl(preview);

      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 20));
      }

      // Upload to server (mock implementation)
      const imageUrl = await uploadToServer(compressedImage);
      setUploadProgress(100);

      return imageUrl;
    } catch (error) {
      console.error('Avatar upload failed:', error);
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, []);

  return { isUploading, previewUrl, uploadProgress, uploadAvatarImage };
};

// Image compression utility
const compressImage = (file: File, options: any): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      let { width, height } = img;
      
      // Calculate dimensions
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
```

### 2. Statistics Calculation
```typescript
// Calculate comprehensive user statistics
const useUserStatistics = (user: User): UserStatistics => {
  return useMemo(() => {
    if (!user) {
      return getDefaultStatistics();
    }

    // Calculate storage utilization
    const storageUtilization = calculateStorageUtilization(user);

    // Calculate app usage time (mock implementation)
    const appUsageTime = calculateAppUsageTime(user);

    return {
      totalProducts: user.statistics?.totalProducts || 0,
      totalRecipes: user.statistics?.totalRecipes || 0,
      recipesCooked: user.statistics?.recipesCooked || 0,
      productsAdded: user.statistics?.productsAdded || 0,
      expirationWarnings: user.statistics?.expirationWarnings || 0,
      storageUtilization,
      appUsageTime,
      lastActiveDate: user.lastActiveDate || new Date().toISOString(),
    };
  }, [user]);

const calculateStorageUtilization = (user: User): number => {
  const { usedStorage, maxStorage } = user.storagePlan || { usedStorage: 0, maxStorage: 100 };
  return Math.min(Math.round((usedStorage / maxStorage) * 100), 100);
};

const calculateAppUsageTime = (user: User): number => {
  // Mock calculation - would use actual usage data
  const daysSinceJoin = getDaysSince(user.joinDate);
  return Math.min(daysSinceJoin * 2, 8760); // Max 2 hours per day
};
```

## Styling
```css
/* Screen container */
.profile-screen {
  min-height: 100vh;
  padding-bottom: 80px;
  background-color: var(--background-color);
}

/* Section navigation */
.section-navigation {
  display: flex;
  background-color: var(--background-secondary);
  border-bottom: 1px solid var(--border-color);
  padding: 0 16px;
  gap: 8px;
}

.section-tab {
  padding: 12px 24px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.section-tab.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
  font-weight: 600;
}

.section-tab:hover {
  color: var(--text-primary);
  background-color: var(--background-hover);
}

/* Profile sections */
.profile-section {
  padding: 24px 16px;
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

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 24px 0;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--primary-color);
}

/* Avatar section */
.avatar-section {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
}

.profile-avatar {
  position: relative;
}

.avatar-info {
  flex: 1;
}

.camera-button {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Form fields */
.form-fields {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-input {
  font-size: 16px;
  padding: 12px 16px;
  border-radius: 8px;
  border: 2px solid var(--border-color);
  background-color: var(--background-color);
  transition: all 0.2s ease;
}

.profile-input:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.2);
}

.profile-input:disabled {
  background-color: var(--background-disabled);
  color: var(--text-disabled);
  cursor: not-allowed;
}

/* Info fields */
.info-fields {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-top: 24px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: var(--background-secondary);
  border-radius: 8px;
}

.info-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
}

.info-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.capitalize {
  text-transform: capitalize;
}

/* Form actions */
.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.save-button {
  min-width: 120px;
}

/* Preferences */
.preference-group {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.preference-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.preference-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.preference-select {
  min-width: 200px;
}

/* Statistics */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stats-details {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  background-color: var(--background-secondary);
  border-radius: 8px;
}

/* Success message */
.success-message {
  text-align: center;
  padding: 48px 24px;
  background-color: var(--success-background);
  color: var(--success-text);
  border-radius: 12px;
  margin: 24px 16px;
  animation: slideInUp 0.3s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Logout button */
.logout-button {
  background-color: var(--error-color);
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
}

.logout-button:hover {
  background-color: var(--error-hover);
}

/* Responsive design */
@media (max-width: 768px) {
  .section-navigation {
    flex-wrap: wrap;
  }
  
  .avatar-section {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .info-fields {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .stats-details {
    grid-column: 1;
  }
}

@media (min-width: 769px) {
  .profile-screen {
    max-width: 800px;
    margin: 0 auto;
  }
}

/* Focus states */
.profile-input:focus-visible {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.2);
}

.section-tab:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: -2px;
  border-radius: 4px 4px 0 0;
}
```

## Accessibility Features
```typescript
// Screen reader support
const AccessibleProfileScreen: React.FC<ProfileScreenProps> = (props) => {
  const announceProfileUpdate = useCallback((success: boolean) => {
    const announcement = success 
      ? 'Profile updated successfully'
      : 'Profile update failed';
    const liveRegion = document.getElementById('screen-reader-announcements');
    if (liveRegion) {
      liveRegion.textContent = announcement;
    }
  }, []);

  return (
    <div role="main" aria-label="User profile">
      {/* Hidden live region */}
      <div
        id="screen-reader-announcements"
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      />
      
      <ProfileScreen
        {...props}
        onProfileUpdate={(success) => {
          props.onUpdateProfile?.(success);
          announceProfileUpdate(success);
        }}
      />
    </div>
  );
};

// Keyboard navigation
const handleKeyDown = useCallback((event: KeyboardEvent) => {
  const focusedElement = document.activeElement;
  
  if (!focusedElement?.closest('.profile-screen')) return;

  switch (event.key) {
    case 'Escape':
      if (profileState.isEditing) {
        event.preventDefault();
        setProfileState(prev => ({ ...prev, isEditing: false, unsavedChanges: {} }));
      }
      break;
    case 'Tab':
      event.preventDefault();
      // Navigate to next section
      const sections = ['basic', 'preferences', 'statistics'];
      const currentIndex = sections.indexOf(profileState.activeSection);
      const nextIndex = (currentIndex + 1) % sections.length;
      handleSectionChange(sections[nextIndex] as FormSection);
      break;
    case 'Enter':
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        if (isValid()) {
          handleSave();
        }
      }
      break;
  }
}, []);
```

## Performance Optimizations
### Memoization
```typescript
// Memoize form data
const formData = useMemo(() => {
  return getFormData(currentUser);
}, [currentUser]);

// Memoize unsaved changes
const hasUnsavedChanges = useMemo(() => {
  return Object.keys(profileState.unsavedChanges).length > 0;
}, [profileState.unsavedChanges]);

// Memoize event handlers
const handleInputChange = useCallback((field: string, value: any) => {
  const newUnsavedChanges = {
    ...profileState.unsavedChanges,
    [field]: value,
  };
  
  setProfileState(prev => ({
    ...prev,
    unsavedChanges: newUnsavedChanges,
  }));
}, []);

// Memoize user statistics
const userStatistics = useMemo(() => {
  return calculateUserStatistics(currentUser);
}, [currentUser]);
```

## Testing Strategy
### Unit Tests
```typescript
describe('ProfileScreen Component', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    preferences: {
      theme: 'light',
      language: 'en',
    },
    statistics: {
      totalProducts: 25,
      totalRecipes: 10,
      recipesCooked: 5,
    },
  };

  test('renders profile sections correctly', () => {
    render(<ProfileScreen user={mockUser} />);
    
    expect(screen.getByText('Basic Info')).toBeInTheDocument();
    expect(screen.getByText('Preferences')).toBeInTheDocument();
    expect(screen.getByText('Statistics')).toBeInTheDocument();
  });

  test('handles section navigation', () => {
    render(<ProfileScreen user={mockUser} />);
    
    fireEvent.click(screen.getByText('Preferences'));
    expect(screen.getByText('Preferences')).toHaveClass('active');
  });

  test('handles form input changes', async () => {
    render(<ProfileScreen user={mockUser} />);
    
    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  test('saves profile successfully', async () => {
    const mockOnUpdateProfile = jest.fn().mockResolvedValue(undefined);
    
    render(
      <ProfileScreen 
        user={mockUser} 
        onUpdateProfile={mockOnUpdateProfile}
      />
    );
    
    // Edit name
    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: 'Jane Smith' } });
    
    // Click save
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(mockOnUpdateProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Jane Smith',
        })
      );
    });
  });

  test('handles logout', async () => {
    const mockOnLogout = jest.fn();
    
    render(
      <ProfileScreen 
        user={mockUser} 
        onLogout={mockOnLogout}
      />
    );
    
    const logoutButton = screen.getByLabelText('Logout');
    fireEvent.click(logoutButton);
    
    await waitFor(() => {
      expect(mockOnLogout).toHaveBeenCalled();
    });
  });
});
```

### Integration Tests
```typescript
describe('ProfileScreen Integration', () => {
  test('integrates with global state', () => {
    const mockDispatch = jest.fn();
    jest.mock('react-redux', () => ({
      useDispatch: () => mockDispatch,
      useSelector: () => ({
        user: {
          user: mockUser,
        },
      }),
    }));
    
    render(<ProfileScreen />);
    
    // Check if user data is displayed
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
  });

  test('persists profile changes', async () => {
    const { setItem, getItem } = localStorage;
    
    render(<ProfileScreen user={mockUser} />);
    
    // Make a change
    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: 'Updated Name' } });
    
    // Navigate away and back
    fireEvent.click(screen.getByText('Preferences'));
    fireEvent.click(screen.getByText('Basic Info'));
    
    // Check if unsaved changes are preserved
    expect(screen.getByDisplayValue('Updated Name')).toBeInTheDocument();
  });
});
```

## Error Handling
```typescript
// Profile update error handling
const useProfileErrorHandling = () => {
  const [error, setError] = useState<string>('');

  const handleProfileError = useCallback((error: Error) => {
    if (error instanceof NetworkError) {
      setError('Network error. Please check your connection.');
    } else if (error instanceof ValidationError) {
      setError('Invalid profile data. Please check your input.');
    } else {
      setError('Failed to update profile. Please try again.');
    }
    
    // Clear error after 5 seconds
    setTimeout(() => setError(''), 5000);
  }, []);

  return { error, handleProfileError };
};

// Form validation errors
const useFormErrors = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setFieldError = useCallback((field: string, message: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: message,
    }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return { errors, setFieldError, clearErrors };
};
```

## Documentation Links
- [App Component](../core/App.md)
- [Layout Component](../core/Layout.md)
- [Header Component](../core/Header.md)
- [Input Component](../common/Input.md)
- [Select Component](../common/Select.md)
- [Avatar Component](../common/Avatar.md)
- [StatsCard Component](../common/StatsCard.md)
- [Toggle Component](../common/Toggle.md)

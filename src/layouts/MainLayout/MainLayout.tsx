import React, { useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { SafeArea } from 'antd-mobile';
import { Header, type HeaderProps } from '@/components/Header/Header';
import { BottomNavigation, type BottomNavigationProps } from '@/components/BottomNavigation';
import { cn } from '@/utils/cn';
import './MainLayout.css';

export interface MainLayoutProps {
  children: React.ReactNode;
  
  // Layout visibility
  showHeader?: boolean;
  showBottomNavigation?: boolean;
  
  // Component props
  headerProps?: Omit<HeaderProps, 'className'>;
  bottomNavigationProps?: Omit<BottomNavigationProps, 'className'>;
  
  // Content styling
  contentPadding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  contentBackgroundColor?: string;
  
  // Layout styling
  backgroundColor?: string;
  maxWidth?: number | string;
  className?: string;
  
  // BottomNavigation styling props
  bottomNavigationBorderTop?: string;
  bottomNavigationBorderRadius?: string;
  bottomNavigationBoxShadow?: string;
  bottomNavigationPosition?: 'fixed' | 'sticky' | 'relative';
  
  // Behavior
  smoothScroll?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showHeader = true,
  showBottomNavigation = true,
  headerProps = {},
  bottomNavigationProps = {},
  contentPadding = 'md',
  contentBackgroundColor,
  backgroundColor = '#F5F5F5',
  maxWidth,
  className,
  bottomNavigationBorderTop,
  bottomNavigationBorderRadius,
  bottomNavigationBoxShadow,
  bottomNavigationPosition,
  smoothScroll = true,
}) => {
  const location = useLocation();
  const contentRef = useRef<HTMLDivElement>(null);

  // Get route-based header title (can be overridden by headerProps.title)
  const getRouteTitle = useCallback((pathname: string): string => {
    const routeTitles: Record<string, string> = {
      '/': 'Pantry App',
      '/pantry': 'My Pantry',
      '/search': 'Search',
      '/recipes': 'Recipes',
      '/profile': 'Profile',
      '/add-product': 'Add Product',
    };

    // Handle dynamic routes
    if (pathname.startsWith('/product/')) {
      return 'Product Details';
    }
    
    return routeTitles[pathname] || '';
  }, []);

  const routeTitle = getRouteTitle(location.pathname);

  // Get padding classes
  const getPaddingClasses = useCallback((): string => {
    const paddingMap: Record<string, string> = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-12',
    };
    return paddingMap[contentPadding] || paddingMap.md;
  }, [contentPadding]);

  // Handle scroll to top on route change
  React.useEffect(() => {
    if (smoothScroll && contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [location.pathname, smoothScroll]);

  // Container styles
  const containerStyle: React.CSSProperties = {
    backgroundColor,
    maxWidth: maxWidth ? (typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth) : undefined,
  };

  // Content area styles
  const contentStyle: React.CSSProperties = {
    backgroundColor: contentBackgroundColor,
  };

  // Calculate content area height
  const headerHeight = showHeader ? (headerProps?.height || 56) : 0;
  const bottomNavHeight = showBottomNavigation ? (bottomNavigationProps?.height || 56) : 0;
  
  const contentAreaStyle: React.CSSProperties = {
    minHeight: `calc(100vh - ${headerHeight}px - ${bottomNavHeight}px)`,
    height: `calc(100vh - ${headerHeight}px - ${bottomNavHeight}px)`,
    overflowY: 'auto',
    overflowX: 'hidden',
    ...contentStyle,
  };

  // Desktop container classes (center on desktop)
  const desktopContainerClasses = cn(
    'main-layout__container',
    'mx-auto',
    'relative',
    'min-h-screen',
    'flex',
    'flex-col',
    className
  );

  // Content wrapper classes
  const contentWrapperClasses = cn(
    'main-layout__content',
    getPaddingClasses()
  );

  // Header props with defaults
  const finalHeaderProps: HeaderProps = {
    title: headerProps?.title || routeTitle,
    showBackButton: headerProps?.showBackButton || location.pathname !== '/',
    onBackPress: headerProps?.onBackPress,
    rightComponent: headerProps?.rightComponent,
    backgroundColor: headerProps?.backgroundColor || '#FFFFFF',
    textColor: headerProps?.textColor || '#333333',
    borderColor: headerProps?.borderColor || '#E0E0E0',
    height: headerProps?.height || 56,
  };

  // BottomNavigation props with defaults
  const finalBottomNavProps: BottomNavigationProps = {
    ...bottomNavigationProps,
    backgroundColor: bottomNavigationProps?.backgroundColor || '#FFFFFF',
    activeColor: bottomNavigationProps?.activeColor || '#FF6B35',
    height: bottomNavigationProps?.height || 56,
    maxWidth: bottomNavigationProps?.maxWidth || maxWidth,
    borderTop: bottomNavigationProps?.borderTop || bottomNavigationBorderTop,
    borderRadius: bottomNavigationProps?.borderRadius || bottomNavigationBorderRadius,
    boxShadow: bottomNavigationProps?.boxShadow || bottomNavigationBoxShadow,
    position: bottomNavigationProps?.position || bottomNavigationPosition,
  };

  return (
    <div className={desktopContainerClasses} style={containerStyle}>
      {/* SafeArea for top notch */}
      {showHeader && <SafeArea position="top" />}
      
      {/* Header */}
      {showHeader && <Header {...finalHeaderProps} />}
      
      {/* Content Area */}
      <div 
        ref={contentRef}
        className={cn(
          'main-layout__content-area',
          'flex-1',
          'overflow-y-auto',
          'overflow-x-hidden'
        )}
        style={contentAreaStyle}
        role="main"
        aria-label="Main content area"
      >
        <div className={contentWrapperClasses}>
          {children}
        </div>
      </div>
      
      {/* Bottom Navigation */}
      {showBottomNavigation && <BottomNavigation {...finalBottomNavProps} />}
      
      {/* SafeArea for home indicator */}
      {showBottomNavigation && <SafeArea position="bottom" />}
    </div>
  );
};

export default MainLayout;

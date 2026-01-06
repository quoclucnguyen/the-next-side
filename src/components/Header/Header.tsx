import React, { useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from 'antd-mobile';
import { 
  LeftOutline, 
  SearchOutline, 
  MoreOutline, 
  EditSOutline 
} from 'antd-mobile-icons';
import { cn } from '../../utils/cn';
import { useScrollPosition } from '../../hooks/useScrollPosition';

export interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  height?: number;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  rightComponent,
  backgroundColor = '#FFFFFF',
  textColor = '#333333',
  borderColor = '#E0E0E0',
  height = 56,
  className
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { scrollDirection, isScrolled } = useScrollPosition({
    threshold: 50,
    debounceMs: 100,
  });

  // Memoize computed values instead of using state
  const routeTitle = useMemo(() => {
    return getRouteTitle(location.pathname) || title || 'Pantry App';
  }, [location.pathname, title]);

  const isVisible = useMemo(() => {
    if (scrollDirection === 'down' && isScrolled) {
      return false;
    } else if (scrollDirection === 'up') {
      return true;
    }
    return true;
  }, [scrollDirection, isScrolled]);

  const handleBackPress = useCallback(() => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigate(-1);
    }
  }, [navigate, onBackPress]);

  const headerStyle = useMemo(() => ({
    height: `${height}px`,
    backgroundColor,
    color: textColor,
    borderBottom: `1px solid ${borderColor}`,
  }), [height, backgroundColor, textColor, borderColor]);

  const headerClasses = cn(
    'header',
    'sticky top-0 z-50',
    'transition-all duration-300 ease-in-out',
    isScrolled && 'header--scrolled',
    !isVisible && 'header--hidden',
    className
  );

  const backButton = useMemo(() => {
    if (!showBackButton) return null;
    
    return (
      <Button
        fill="none"
        size="small"
        onClick={handleBackPress}
        className="header__back-button"
        style={{ color: textColor }}
      >
        <LeftOutline />
      </Button>
    );
  }, [showBackButton, handleBackPress, textColor]);

  const rightContent = useMemo(() => {
    return rightComponent ? (
      <div className="header__right">
        {rightComponent}
      </div>
    ) : null;
  }, [rightComponent]);

  return (
    <header
      className={headerClasses}
      style={headerStyle}
      role="banner"
      aria-label={`${routeTitle} page header`}
    >
      <div className="header__content flex items-center justify-between px-4" style={{ height: `${height}px` }}>
        <div className="header__left flex items-center">
          {backButton}
          <h1 className="header__title text-lg font-semibold truncate ml-2">
            {routeTitle}
          </h1>
        </div>
        
        <div className="header__right">
          {rightContent}
        </div>
      </div>
      
      {/* Hidden help text for accessibility */}
      {showBackButton && (
        <span className="sr-only">
          Navigate to previous screen from {routeTitle}
        </span>
      )}
    </header>
  );
};

// Helper function to get route title
function getRouteTitle(pathname: string): string {
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
}

// Common right components that can be used with Header
export const HeaderSearchButton: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Button
      fill="none"
      size="small"
      onClick={() => navigate('/search')}
      aria-label="Search"
    >
      <SearchOutline />
    </Button>
  );
};

export const HeaderMenuButton: React.FC<{ onToggle: () => void }> = ({ onToggle }) => (
  <Button
    fill="none"
    size="small"
    onClick={onToggle}
    aria-label="Menu"
  >
    <MoreOutline />
  </Button>
);

export const HeaderEditButton: React.FC<{ onEdit: () => void }> = ({ onEdit }) => (
  <Button
    fill="none"
    size="small"
    onClick={onEdit}
    aria-label="Edit"
  >
    <EditSOutline />
  </Button>
);

export default Header;

import React, { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TabBar } from "antd-mobile";
import {
  StarOutline,
  SearchOutline,
  AddOutline,
  AppOutline,
  UserOutline,
} from "antd-mobile-icons";
import { cn } from "@/utils/cn";

export type NavigationTab = "home" | "search" | "add" | "recipes" | "profile";

export interface TabConfig {
  id: NavigationTab;
  label: string;
  icon: React.ReactNode;
  route: string;
  badge?: number | React.ReactNode | "dot";
  disabled?: boolean;
}

export interface BottomNavigationProps {
  activeTab?: NavigationTab;
  onTabChange?: (tab: NavigationTab) => void;
  backgroundColor?: string;
  activeColor?: string;
  height?: number;
  showLabels?: boolean;
  safeArea?: boolean;
  className?: string;
  
  // Desktop & Layout props
  maxWidth?: number | string;
  borderTop?: string;
  borderRadius?: string;
  boxShadow?: string;
  position?: 'fixed' | 'sticky' | 'relative';
}

// Default tab configuration
const defaultTabs: TabConfig[] = [
  { id: "home", label: "Home", icon: <StarOutline />, route: "/" },
  { id: "search", label: "Search", icon: <SearchOutline />, route: "/search" },
  { id: "add", label: "Add", icon: <AddOutline />, route: "/add-product" },
  { id: "recipes", label: "Recipes", icon: <AppOutline />, route: "/recipes" },
  { id: "profile", label: "Profile", icon: <UserOutline />, route: "/profile" },
];

// Haptic feedback hook
const useHapticFeedback = () => {
  const triggerHaptic = useCallback(
    (type: "selection" | "impact" | "notification") => {
      if ("vibrate" in navigator) {
        switch (type) {
          case "selection":
            navigator.vibrate(10);
            break;
          case "impact":
            navigator.vibrate(25);
            break;
          case "notification":
            navigator.vibrate([50, 50, 50]);
            break;
        }
      }
    },
    []
  );

  return { triggerHaptic };
};

// Main BottomNavigation Component
const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab: controlledActiveTab,
  onTabChange,
  backgroundColor = "#FFFFFF",
  activeColor = "#FF6B35",
  height = 56,
  showLabels = true,
  safeArea = true,
  className,
  maxWidth,
  borderTop = '1px solid rgba(0, 0, 0, 0.1)',
  borderRadius = '0',
  boxShadow = '0 -2px 8px rgba(0, 0, 0, 0.08)',
  position = 'fixed',
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { triggerHaptic } = useHapticFeedback();

  // Local state
  const [localActiveTab, setLocalActiveTab] =
    useState<NavigationTab>("home");

  // Determine active tab (controlled vs uncontrolled)
  const activeTab = controlledActiveTab ?? localActiveTab;

  // Get current tab from location
  const getCurrentTabFromLocation = useCallback((): NavigationTab => {
    const currentPath = location.pathname;
    const tab = defaultTabs.find(
      (t) => t.route === currentPath || currentPath.startsWith(t.route + "/")
    );
    return tab?.id || "home";
  }, [location.pathname]);

  // Update local active tab when location changes (uncontrolled mode)
  React.useEffect(() => {
    if (!controlledActiveTab) {
      setLocalActiveTab(getCurrentTabFromLocation());
    }
  }, [controlledActiveTab, getCurrentTabFromLocation]);

  // Handle tab press
  const handleTabChange = useCallback(
    (key: string) => {
      const tabId = key as NavigationTab;
      triggerHaptic("selection");

      if (onTabChange) {
        onTabChange(tabId);
      } else {
        setLocalActiveTab(tabId);
        const tab = defaultTabs.find((t) => t.id === tabId);
        if (tab && !tab.disabled) {
          navigate(tab.route);
        }
      }
    },
    [navigate, onTabChange, triggerHaptic]
  );

  // Build container classes based on maxWidth
  const getContainerClasses = useCallback((): string => {
    const classes: string[] = [position, 'left-0', 'right-0', 'bottom-0', 'z-50'];
    
    // Desktop centering logic
    if (maxWidth) {
      const maxWidthValue = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth;
      classes.push('md:left-1/2', 'md:-translate-x-1/2', 'md:w-full');
      classes.push(`[max-width:${maxWidthValue}]`);
    } else {
      // Default behavior: max-w-md on desktop
      classes.push('md:max-w-md', 'md:left-1/2', 'md:-translate-x-1/2');
    }
    
    return classes.join(' ');
  }, [maxWidth, position]);

  // Container styles
  const containerStyle: React.CSSProperties = {
    height: `${height}px`,
    backgroundColor,
    borderTop,
    borderRadius,
    boxShadow,
  };

  return (
    <div
      className={cn(
        getContainerClasses(),
        className
      )}
      style={containerStyle}
    >
      <TabBar
        activeKey={activeTab}
        onChange={handleTabChange}
        safeArea={safeArea}
        className="h-full"
      >
        {defaultTabs.map((tab) => (
          <TabBar.Item
            key={tab.id}
            icon={(active) => (
              <div
                style={{
                  fontSize: "22px",
                  color: active ? activeColor : "rgba(0, 0, 0, 0.5)",
                  transition: "transform 0.2s",
                  transform: active ? "scale(1.1)" : "scale(1)",
                }}
              >
                {tab.icon}
              </div>
            )}
            title={showLabels ? tab.label : undefined}
            badge={tab.badge}
          />
        ))}
      </TabBar>
    </div>
  );
};

export default BottomNavigation;

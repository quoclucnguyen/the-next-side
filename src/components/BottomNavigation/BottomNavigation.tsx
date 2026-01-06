import React, { useState, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TabBar, Badge } from "antd-mobile";
import {
  StarOutline,
  SearchOutline,
  AddOutline,
  AppOutline,
  UserOutline,
} from "antd-mobile-icons";
import { cn } from "@/utils/cn";
import type { TabBarItemProps } from "antd-mobile/es/components/tab-bar";
import "./BottomNavigation.css";

export type NavigationTab = "home" | "search" | "add" | "recipes" | "profile";

export interface TabConfig {
  id: NavigationTab;
  label: string;
  icon: React.ReactNode;
  route: string;
  badge?: number | React.ReactNode | typeof Badge.dot;
  disabled?: boolean;
}

export interface BottomNavigationProps {
  activeTab?: NavigationTab;
  onTabChange?: (tab: NavigationTab) => void;
  backgroundColor?: string;
  activeColor?: string;
  inactiveColor?: string;
  height?: number;
  showLabels?: boolean;
  safeArea?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export interface BottomNavigationState {
  activeTab: NavigationTab;
  isAnimating: boolean;
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

// Navigation Tab Item Component
interface NavigationTabItemProps extends TabBarItemProps {
  tab: TabConfig;
  showLabels: boolean;
}

const NavigationTabItem: React.FC<NavigationTabItemProps> = ({
  tab,
  showLabels,
  onClick,
}) => {
  return (
    <TabBar.Item
      key={tab.id}
      icon={
        tab.badge ? (
          <Badge
            content={tab.badge}
            style={{ margin: 0, "--right": "4px", "--top": "4px" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {tab.icon}
            </div>
          </Badge>
        ) : (
          tab.icon
        )
      }
      title={showLabels ? tab.label : undefined}
      onClick={onClick}
    />
  );
};

// Main BottomNavigation Component
const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab: controlledActiveTab,
  onTabChange,
  backgroundColor = "#FFFFFF",
  height = 56,
  showLabels = true,
  safeArea = true,
  className,
  style,
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

  // Memoize tabs with badges
  const tabsWithBadges = useMemo(() => {
    return defaultTabs.map((tab) => {
      // Add badge counts based on tab type (this can be customized)
      const badge = tab.badge;
      return { ...tab, badge };
    });
  }, []);

  // Container styles
  const containerStyle = useMemo(() => {
    return {
      height: `${height}px`,
      backgroundColor,
      ...style,
    };
  }, [height, backgroundColor, style]);

  return (
    <div
      className={cn(
        "bottom-navigation",
        "fixed bottom-0 left-0 right-0",
        "z-50",
        safeArea && "safe-area-bottom",
        className
      )}
      style={containerStyle}
      role="navigation"
      aria-label="Main navigation"
    >
      <TabBar
        activeKey={activeTab}
        onChange={handleTabChange}
        safeArea={safeArea}
        className="bottom-navigation__tabbar"
      >
        {tabsWithBadges.map((tab) => (
          <NavigationTabItem
            key={tab.id}
            tab={tab}
            showLabels={showLabels}
          />
        ))}
      </TabBar>
    </div>
  );
};

export default BottomNavigation;

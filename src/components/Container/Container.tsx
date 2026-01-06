import React, { useCallback, useMemo, useRef } from "react";
import { cn } from "@/utils/cn";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import type { Breakpoint } from "@/hooks/useBreakpoint";
import "./Container.css";

export type ContainerVariant = "default" | "fluid" | "narrow" | "wide" | "centered";
export type SpacingSize = "none" | "sm" | "md" | "lg" | "xl";
export type ShadowSize = "none" | "sm" | "md" | "lg" | "xl";

export interface ContainerProps {
  children: React.ReactNode;
  variant?: ContainerVariant;
  padding?: SpacingSize;
  margin?: SpacingSize;
  maxWidth?: number | string;
  backgroundColor?: string;
  borderRadius?: number | string;
  shadow?: ShadowSize;
  border?: boolean | string;
  className?: string;
  as?: React.ElementType;
  "aria-label"?: string;
  style?: React.CSSProperties;
}

export interface ContainerState {
  isOverflowing: boolean;
  containerWidth: number;
  breakpoint: Breakpoint;
}

const Container: React.FC<ContainerProps> = ({
  children,
  variant = "default",
  padding = "md",
  margin = "none",
  maxWidth,
  backgroundColor,
  borderRadius,
  shadow = "none",
  border = false,
  className,
  as: Component = "div",
  "aria-label": ariaLabel,
  style: customStyle,
}) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const { isOverflowing } = useResizeObserver(
    containerRef as React.RefObject<HTMLElement>
  );

  const getVariantClasses = useCallback(() => {
    const classes: string[] = [];

    switch (variant) {
      case "fluid":
        classes.push("container--fluid");
        break;
      case "narrow":
        classes.push("container--narrow");
        break;
      case "wide":
        classes.push("container--wide");
        break;
      case "centered":
        classes.push("container--centered");
        break;
      default:
        classes.push("container--default");
    }

    return classes;
  }, [variant]);

  const getPaddingClasses = useCallback(() => {
    const paddingMap: Record<string, string> = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
      xl: "p-12",
    };
    return paddingMap[padding] || paddingMap.md;
  }, [padding]);

  const getMarginClasses = useCallback(() => {
    const marginMap: Record<string, string> = {
      none: "",
      sm: "m-4",
      md: "m-6",
      lg: "m-8",
      xl: "m-12",
    };
    return marginMap[margin] || marginMap.none;
  }, [margin]);

  const getShadowClasses = useCallback(() => {
    const shadowMap: Record<string, string> = {
      none: "",
      sm: "shadow-sm",
      md: "shadow-md",
      lg: "shadow-lg",
      xl: "shadow-xl",
    };
    return shadowMap[shadow] || shadowMap.none;
  }, [shadow]);

  const getContainerStyles = useCallback(() => {
    const styles: React.CSSProperties = {};

    // Max width based on variant
    if (maxWidth) {
      styles.maxWidth =
        typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth;
    } else {
      switch (variant) {
        case "narrow":
          styles.maxWidth = "480px";
          break;
        case "default":
          styles.maxWidth = "768px";
          break;
        case "wide":
          styles.maxWidth = "1200px";
          break;
        case "fluid":
          styles.maxWidth = "100%";
          break;
        case "centered":
          styles.maxWidth = "1024px";
          styles.marginLeft = "auto";
          styles.marginRight = "auto";
          break;
      }
    }

    // Background color
    if (backgroundColor) {
      styles.backgroundColor = backgroundColor;
    }

    // Border radius
    if (borderRadius) {
      styles.borderRadius =
        typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius;
    }

    // Border
    if (border) {
      styles.border =
        typeof border === "string"
          ? border
          : "1px solid var(--border-color, #e5e7eb)";
    }

    return styles;
  }, [variant, maxWidth, backgroundColor, borderRadius, border]);

  const getAriaProps = useCallback(() => {
    const ariaProps: Record<string, string> = {};

    switch (Component) {
      case "main":
        ariaProps["role"] = "main";
        ariaProps["aria-label"] = ariaLabel || "Main content";
        break;
      case "section":
        ariaProps["role"] = "region";
        ariaProps["aria-label"] = ariaLabel || "Content section";
        break;
      case "article":
        ariaProps["role"] = "article";
        ariaProps["aria-label"] = ariaLabel || "Article";
        break;
      case "aside":
        ariaProps["role"] = "complementary";
        ariaProps["aria-label"] = ariaLabel || "Sidebar";
        break;
      default:
        if (ariaLabel) {
          ariaProps["aria-label"] = ariaLabel;
        }
        break;
    }

    return ariaProps;
  }, [Component, ariaLabel]);

  // Memoize styles and classes for performance
  const containerStyles = useMemo(
    () => ({ ...getContainerStyles(), ...customStyle }),
    [getContainerStyles, customStyle]
  );
  const containerClasses = useMemo(() => {
    return cn(
      "container",
      ...getVariantClasses(),
      getPaddingClasses(),
      getMarginClasses(),
      getShadowClasses(),
      isOverflowing && "container--overflowing",
      className
    );
  }, [
    getVariantClasses,
    getPaddingClasses,
    getMarginClasses,
    getShadowClasses,
    isOverflowing,
    className,
  ]);
  const ariaProps = useMemo(() => getAriaProps(), [getAriaProps]);

  return (
    <Component
      ref={containerRef as React.RefObject<HTMLElement>}
      className={containerClasses}
      style={containerStyles}
      {...ariaProps}
    >
      {children}
    </Component>
  );
};

export default Container;

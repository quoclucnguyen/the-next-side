import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import BottomNavigation, {
  type BottomNavigationProps,
  type NavigationTab,
} from "./BottomNavigation";
import "./BottomNavigation.css";

const meta: Meta<BottomNavigationProps> = {
  title: "Components/BottomNavigation",
  component: BottomNavigation,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Component bottom navigation chính của ứng dụng, cung cấp điều hướng nhanh giữa các màn hình chính.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    activeTab: {
      control: "select",
      options: ["home", "search", "add", "recipes", "profile"],
      description: "Tab đang active (controlled mode)",
    },
    backgroundColor: {
      control: "color",
      description: "Màu nền của navigation",
    },
    activeColor: {
      control: "color",
      description: "Màu của tab active (chưa implement)",
    },
    inactiveColor: {
      control: "color",
      description: "Màu của tab inactive (chưa implement)",
    },
    height: {
      control: "number",
      description: "Chiều cao của navigation",
    },
    showLabels: {
      control: "boolean",
      description: "Hiển thị label cho các tab",
    },
    safeArea: {
      control: "boolean",
      description: "Bật safe area cho thiết bị có notch",
    },
    onTabChange: {
      action: "tabChanged",
      description: "Callback khi tab thay đổi",
    },
  },
};

export default meta;
type Story = StoryObj<BottomNavigationProps>;

// Mock content component
const MockContent = ({ title }: { title: string }) => (
  <div
    style={{
      padding: "20px",
      height: "calc(100vh - 56px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "24px",
      color: "#666",
    }}
  >
    <h1>{title}</h1>
  </div>
);

// Basic usage story
export const Default: Story = {
  render: (args) => (
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<MockContent title="Home Page" />} />
        <Route
          path="/search"
          element={<MockContent title="Search Page" />}
        />
        <Route
          path="/add-product"
          element={<MockContent title="Add Product Page" />}
        />
        <Route
          path="/recipes"
          element={<MockContent title="Recipes Page" />}
        />
        <Route
          path="/profile"
          element={<MockContent title="Profile Page" />}
        />
      </Routes>
      <BottomNavigation {...args} />
    </MemoryRouter>
  ),
  args: {
    height: 56,
    showLabels: true,
    safeArea: true,
    backgroundColor: "#FFFFFF",
  },
};

// Controlled mode wrapper component
const ControlledWrapper: React.FC<BottomNavigationProps> = (args) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>("home");

  return (
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<MockContent title="Home Page" />} />
        <Route
          path="/search"
          element={<MockContent title="Search Page" />}
        />
        <Route
          path="/add-product"
          element={<MockContent title="Add Product Page" />}
        />
        <Route
          path="/recipes"
          element={<MockContent title="Recipes Page" />}
        />
        <Route
          path="/profile"
          element={<MockContent title="Profile Page" />}
        />
      </Routes>
      <BottomNavigation
        {...args}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          args.onTabChange?.(tab);
        }}
      />
    </MemoryRouter>
  );
};

// Controlled mode story
export const Controlled: Story = {
  render: (args) => <ControlledWrapper {...args} />,
  args: {
    height: 56,
    showLabels: true,
    safeArea: true,
    backgroundColor: "#FFFFFF",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Example sử dụng controlled mode, nơi bạn có thể control tab đang active qua prop activeTab.",
      },
    },
  },
};

// Without labels
export const WithoutLabels: Story = {
  ...Default,
  args: {
    ...Default.args,
    showLabels: false,
  },
  parameters: {
    docs: {
      description: {
        story: "BottomNavigation chỉ hiển thị icon mà không có label.",
      },
    },
  },
};

// Custom background color
export const CustomBackgroundColor: Story = {
  ...Default,
  args: {
    ...Default.args,
    backgroundColor: "#F5F5F5",
  },
  parameters: {
    docs: {
      description: {
        story: "BottomNavigation với màu nền tùy chỉnh.",
      },
    },
  },
};

// Custom height
export const CustomHeight: Story = {
  ...Default,
  args: {
    ...Default.args,
    height: 64,
  },
  parameters: {
    docs: {
      description: {
        story: "BottomNavigation với chiều cao tùy chỉnh.",
      },
    },
  },
};

// Without safe area
export const WithoutSafeArea: Story = {
  ...Default,
  args: {
    ...Default.args,
    safeArea: false,
  },
  parameters: {
    docs: {
      description: {
        story: "BottomNavigation không có safe area padding.",
      },
    },
  },
};

// With dark background
export const DarkBackground: Story = {
  ...Default,
  args: {
    ...Default.args,
    backgroundColor: "#1A1A1A",
  },
  parameters: {
    backgrounds: {
      default: "dark",
    },
    docs: {
      description: {
        story: "BottomNavigation với nền tối.",
      },
    },
  },
};

// Primary color background
export const PrimaryBackground: Story = {
  ...Default,
  args: {
    ...Default.args,
    backgroundColor: "#FF6B35",
  },
  parameters: {
    docs: {
      description: {
        story: "BottomNavigation với màu nền là màu primary.",
      },
    },
  },
};

// All tabs active (for showcase)
export const AllTabsShowcase: Story = {
  render: () => {
    const tabs: NavigationTab[] = ["home", "search", "add", "recipes", "profile"];

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          padding: "20px",
        }}
      >
        <h2>All Tabs Active State</h2>
        {tabs.map((tab) => (
          <div
            key={tab}
            style={{
              marginBottom: "100px",
              padding: "20px",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
          >
            <h3>{tab} Active</h3>
            <MemoryRouter initialEntries={["/"]}>
              <Routes>
                <Route path="/" element={<div>Content</div>} />
              </Routes>
              <BottomNavigation activeTab={tab} />
            </MemoryRouter>
          </div>
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Hiển thị tất cả các tab trong trạng thái active.",
      },
    },
  },
};

// Interactive playground
export const Playground: Story = {
  ...Controlled,
  parameters: {
    docs: {
      description: {
        story:
          "Interactive playground để thử nghiệm các props của BottomNavigation.",
      },
    },
  },
};

// Accessibility showcase
export const Accessibility: Story = {
  ...Default,
  parameters: {
    docs: {
      description: {
        story:
          "BottomNavigation với đầy đủ accessibility features: ARIA labels, keyboard navigation support, và focus states.",
      },
    },
  },
};

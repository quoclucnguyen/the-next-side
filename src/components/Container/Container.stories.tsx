import type { Meta, StoryObj } from "@storybook/react";
import Container from "./Container";

const meta: Meta<typeof Container> = {
  title: "Layout/Container",
  component: Container,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Container component provides consistent spacing, responsive behavior, and layout utilities. It supports multiple variants, custom styling, and overflow detection.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      description: "Container variant affecting max width and behavior",
      control: "select",
      options: ["default", "fluid", "narrow", "wide", "centered"],
    },
    padding: {
      description: "Padding size",
      control: "select",
      options: ["none", "sm", "md", "lg", "xl"],
    },
    margin: {
      description: "Margin size",
      control: "select",
      options: ["none", "sm", "md", "lg", "xl"],
    },
    maxWidth: {
      description: "Custom max width (overrides variant)",
      control: { type: "number", min: 100, max: 2000, step: 50 },
    },
    backgroundColor: {
      description: "Background color",
      control: "color",
    },
    borderRadius: {
      description: "Border radius in pixels",
      control: { type: "number", min: 0, max: 50, step: 1 },
    },
    shadow: {
      description: "Shadow size",
      control: "select",
      options: ["none", "sm", "md", "lg", "xl"],
    },
    border: {
      description: "Border (boolean or custom string)",
      control: "boolean",
    },
    as: {
      description: "HTML element to render as",
      control: "select",
      options: ["div", "main", "section", "article", "aside", "nav"],
    },
    "aria-label": {
      description: "ARIA label for accessibility",
      control: "text",
    },
    className: {
      description: "Additional CSS classes",
      control: "text",
    },
    children: {
      control: false,
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(to bottom, #f5f5f5, #ffffff)",
          padding: "20px",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Container>;

// Basic container
export const Default: Story = {
  args: {
    children: (
      <div>
        <h2>Default Container</h2>
        <p>
          This is a default container with max-width of 768px and medium
          padding.
        </p>
        <p>It provides consistent spacing and centering for your content.</p>
      </div>
    ),
  },
};

// Fluid container (full width)
export const Fluid: Story = {
  args: {
    variant: "fluid",
    children: (
      <div>
        <h2>Fluid Container</h2>
        <p>
          This container takes up the full available width with no max-width
          restriction.
        </p>
        <p>
          Perfect for hero sections or content that needs to span the entire
          viewport.
        </p>
      </div>
    ),
  },
};

// Narrow container
export const Narrow: Story = {
  args: {
    variant: "narrow",
    children: (
      <div>
        <h2>Narrow Container</h2>
        <p>This is a narrow container with max-width of 480px.</p>
        <p>Great for small cards, alerts, or focused content sections.</p>
      </div>
    ),
  },
};

// Wide container
export const Wide: Story = {
  args: {
    variant: "wide",
    children: (
      <div>
        <h2>Wide Container</h2>
        <p>This is a wide container with max-width of 1200px.</p>
        <p>
          Ideal for content that needs more space like grids, tables, or complex
          layouts.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
          }}
        >
          <div
            style={{
              background: "#e0e0e0",
              padding: "16px",
              borderRadius: "4px",
            }}
          >
            Item 1
          </div>
          <div
            style={{
              background: "#e0e0e0",
              padding: "16px",
              borderRadius: "4px",
            }}
          >
            Item 2
          </div>
          <div
            style={{
              background: "#e0e0e0",
              padding: "16px",
              borderRadius: "4px",
            }}
          >
            Item 3
          </div>
        </div>
      </div>
    ),
  },
};

// Centered container
export const Centered: Story = {
  args: {
    variant: "centered",
    children: (
      <div>
        <h2>Centered Container</h2>
        <p>This container is centered horizontally with max-width of 1024px.</p>
        <p>
          Perfect for hero sections, feature highlights, or centered content.
        </p>
      </div>
    ),
  },
};

// Custom max width
export const CustomMaxWidth: Story = {
  args: {
    maxWidth: 600,
    children: (
      <div>
        <h2>Custom Max Width</h2>
        <p>This container has a custom max-width of 600px.</p>
        <p>You can set any custom width by using the maxWidth prop.</p>
      </div>
    ),
  },
};

// With background color
export const WithBackgroundColor: Story = {
  args: {
    backgroundColor: "#e6f7ff",
    borderRadius: 8,
    children: (
      <div>
        <h2>Background Color</h2>
        <p>This container has a custom background color and border radius.</p>
        <p>Great for creating cards, alerts, or highlighted sections.</p>
      </div>
    ),
  },
};

// With shadow
export const WithShadow: Story = {
  args: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadow: "lg",
    children: (
      <div>
        <h2>With Shadow</h2>
        <p>This container has a large shadow and white background.</p>
        <p>Creates depth and separation from the background.</p>
      </div>
    ),
  },
};

// With border
export const WithBorder: Story = {
  args: {
    border: true,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    children: (
      <div>
        <h2>With Border</h2>
        <p>This container has a default border.</p>
        <p>
          You can also provide a custom border string like "2px dashed red".
        </p>
      </div>
    ),
  },
};

// Custom padding
export const CustomPadding: Story = {
  args: {
    padding: "xl",
    backgroundColor: "#f0f5ff",
    children: (
      <div>
        <h2>Extra Large Padding</h2>
        <p>This container has extra large padding (p-12).</p>
        <p>Provides more breathing room for your content.</p>
      </div>
    ),
  },
};

// Semantic containers
export const AsMain: Story = {
  args: {
    as: "main",
    "aria-label": "Main content area",
    children: (
      <div>
        <h2>Semantic Main</h2>
        <p>
          This container renders as a main element with appropriate ARIA
          attributes.
        </p>
        <p>Improves accessibility and SEO.</p>
      </div>
    ),
  },
};

export const AsSection: Story = {
  args: {
    as: "section",
    "aria-label": "Product features section",
    children: (
      <div>
        <h2>Semantic Section</h2>
        <p>This container renders as a section element.</p>
        <p>Use for distinct content sections within a page.</p>
      </div>
    ),
  },
};

export const AsArticle: Story = {
  args: {
    as: "article",
    "aria-label": "Blog post",
    children: (
      <div>
        <h2>Semantic Article</h2>
        <p>This container renders as an article element.</p>
        <p>Perfect for blog posts, news items, or standalone content.</p>
      </div>
    ),
  },
};

export const AsAside: Story = {
  args: {
    as: "aside",
    "aria-label": "Related information",
    backgroundColor: "#fafafa",
    children: (
      <div>
        <h3>Sidebar Content</h3>
        <p>This container renders as an aside element.</p>
        <p>Great for sidebars, related links, or complementary content.</p>
      </div>
    ),
  },
};

// Overflow demonstration
export const OverflowDemo: Story = {
  args: {
    variant: "narrow",
    children: (
      <div>
        <h2>Overflow Demo</h2>
        <p>
          This container will detect when content overflows and add horizontal
          scrolling.
        </p>
        <div
          style={{
            whiteSpace: "nowrap",
            display: "flex",
            gap: "16px",
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "16px",
              background: "#e0e0e0",
              borderRadius: "4px",
              minWidth: "200px",
            }}
          >
            Wide Content Item 1
          </span>
          <span
            style={{
              display: "inline-block",
              padding: "16px",
              background: "#e0e0e0",
              borderRadius: "4px",
              minWidth: "200px",
            }}
          >
            Wide Content Item 2
          </span>
          <span
            style={{
              display: "inline-block",
              padding: "16px",
              background: "#e0e0e0",
              borderRadius: "4px",
              minWidth: "200px",
            }}
          >
            Wide Content Item 3
          </span>
          <span
            style={{
              display: "inline-block",
              padding: "16px",
              background: "#e0e0e0",
              borderRadius: "4px",
              minWidth: "200px",
            }}
          >
            Wide Content Item 4
          </span>
        </div>
      </div>
    ),
  },
};

// Combined features
export const CombinedFeatures: Story = {
  args: {
    variant: "default",
    padding: "lg",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    shadow: "xl",
    border: true,
    children: (
      <div>
        <h2>Combined Features</h2>
        <p>This container demonstrates multiple features combined:</p>
        <ul>
          <li>Custom background color</li>
          <li>Border radius</li>
          <li>Extra large shadow</li>
          <li>Border</li>
          <li>Large padding</li>
        </ul>
        <p>Perfect for creating beautiful card components or modal content.</p>
      </div>
    ),
  },
};

// Multiple containers in a layout
export const MultipleContainers: Story = {
  args: {
    children: (
      <div>
        <h2>Multiple Containers</h2>

        <Container
          variant="narrow"
          backgroundColor="#e6f7ff"
          borderRadius={8}
          style={{ marginBottom: "24px" }}
        >
          <h3>Narrow Container</h3>
          <p>Small, focused content section.</p>
        </Container>

        <Container
          variant="default"
          backgroundColor="#f6ffed"
          borderRadius={8}
          style={{ marginBottom: "24px" }}
        >
          <h3>Default Container</h3>
          <p>Standard width for most content.</p>
        </Container>

        <Container variant="wide" backgroundColor="#fff7e6" borderRadius={8}>
          <h3>Wide Container</h3>
          <p>Extra space for complex layouts.</p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "12px",
              marginTop: "16px",
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: "12px",
                borderRadius: "4px",
              }}
            >
              Cell 1
            </div>
            <div
              style={{
                background: "#fff",
                padding: "12px",
                borderRadius: "4px",
              }}
            >
              Cell 2
            </div>
            <div
              style={{
                background: "#fff",
                padding: "12px",
                borderRadius: "4px",
              }}
            >
              Cell 3
            </div>
          </div>
        </Container>
      </div>
    ),
  },
};

// Responsive demo
export const Responsive: Story = {
  args: {
    children: (
      <div>
        <h2>Responsive Container</h2>
        <p>Resize the viewport to see how this container adapts.</p>
        <p>
          The container maintains proper padding and width at different screen
          sizes.
        </p>
        <div
          style={{
            marginTop: "24px",
            padding: "16px",
            background: "#f0f0f0",
            borderRadius: "8px",
          }}
        >
          <p>
            <strong>Try resizing this storybook panel:</strong>
          </p>
          <ul>
            <li> 640px: Small padding (16px)</li>
            <li>640px - 767px: Medium padding (24px)</li>
            <li>768px - 1023px: Large padding (32px)</li>
            <li> 1024px: Extra large padding (48px)</li>
          </ul>
        </div>
      </div>
    ),
  },
  parameters: {
    viewport: {
      defaultViewport: "ipad",
    },
  },
};

// Card style container
export const CardStyle: Story = {
  args: {
    className: "container--card",
    children: (
      <div>
        <h3 style={{ marginTop: 0, marginBottom: "16px" }}>Card Title</h3>
        <p>This container uses the card style class.</p>
        <p>Perfect for displaying content in a card-like appearance.</p>
      </div>
    ),
  },
};

// Highlight container
export const HighlightStyle: Story = {
  args: {
    className: "container--highlight",
    children: (
      <div>
        <h3 style={{ marginTop: 0, marginBottom: "8px" }}>Important Notice</h3>
        <p style={{ margin: 0 }}>
          This container uses the highlight style for emphasis.
        </p>
        <p style={{ margin: 0 }}>
          Great for alerts, warnings, or important information.
        </p>
      </div>
    ),
  },
};

// Glassmorphism effect
export const Glassmorphism: Story = {
  args: {
    className: "container--glass",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 16,
    padding: "xl",
    style: {
      backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "40px",
    },
    children: (
      <div style={{ color: "#333" }}>
        <h2 style={{ marginTop: 0, marginBottom: "16px" }}>Glassmorphism</h2>
        <p>This container uses the glass effect with backdrop blur.</p>
        <p>Creates a beautiful, modern frosted glass appearance.</p>
      </div>
    ),
  },
};

// Accessibility demo
export const Accessibility: Story = {
  args: {
    as: "main",
    "aria-label": "Main content area",
    children: (
      <div>
        <h2>Accessibility Demo</h2>
        <p>This container demonstrates accessibility features:</p>
        <ul>
          <li>Semantic HTML element (main)</li>
          <li>ARIA labels for screen readers</li>
          <li>Keyboard navigation support</li>
          <li>Focus-visible states</li>
          <li>Appropriate roles and landmarks</li>
        </ul>
        <p>
          Test with screen readers or keyboard navigation to verify
          accessibility.
        </p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "This container demonstrates accessibility best practices including semantic HTML, ARIA attributes, and keyboard navigation support.",
      },
    },
  },
};

import type { Meta, StoryObj } from '@storybook/react';
import MainLayout from './MainLayout';
import { HeaderSearchButton, HeaderEditButton } from '@/components/Header/Header';
import { MemoryRouter } from 'react-router-dom';

const meta: Meta<typeof MainLayout> = {
  title: 'Layouts/MainLayout',
  component: MainLayout,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    showHeader: {
      control: 'boolean',
      description: 'Show or hide the header',
    },
    showBottomNavigation: {
      control: 'boolean',
      description: 'Show or hide the bottom navigation',
    },
    contentPadding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      description: 'Content padding size',
    },
    backgroundColor: {
      control: 'color',
      description: 'Background color of the layout container',
    },
    contentBackgroundColor: {
      control: 'color',
      description: 'Background color of the content area',
    },
    maxWidth: {
      control: 'text',
      description: 'Max width of the container (e.g., "768px", "1024px")',
    },
    smoothScroll: {
      control: 'boolean',
      description: 'Enable smooth scroll on route change',
    },
    bottomNavigationBorderTop: {
      control: 'text',
      description: 'Border top styling for bottom navigation',
    },
    bottomNavigationBorderRadius: {
      control: 'text',
      description: 'Border radius for bottom navigation corners',
    },
    bottomNavigationBoxShadow: {
      control: 'text',
      description: 'Box shadow for bottom navigation',
    },
    bottomNavigationPosition: {
      control: 'select',
      options: ['fixed', 'sticky', 'relative'],
      description: 'Position type for bottom navigation',
    },
  },
};

export default meta;
type Story = StoryObj<typeof MainLayout>;

// Sample content component
const SampleContent = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <h2 style={{ margin: 0, color: '#333' }}>Welcome to MainLayout</h2>
    <p style={{ margin: 0, color: '#666', lineHeight: 1.6 }}>
      This is a sample content area demonstrating the MainLayout component.
      The layout includes a header, scrollable content area, and bottom navigation.
    </p>
    
    <div style={{ 
      padding: '1rem', 
      backgroundColor: '#fff', 
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Feature List</h3>
      <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#666' }}>
        <li>Responsive design (mobile-first)</li>
        <li>Optional header and bottom navigation</li>
        <li>Smooth scroll on route change</li>
        <li>Customizable padding and colors</li>
        <li>Safe area handling for iOS devices</li>
      </ul>
    </div>

    <div style={{ 
      padding: '1rem', 
      backgroundColor: '#fff', 
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Scroll Test</h3>
      <p style={{ margin: 0, color: '#666', lineHeight: 1.6 }}>
        Try scrolling this content to see the smooth scrolling behavior.
        The header has scroll detection and can hide when scrolling down.
      </p>
    </div>

    <div style={{ 
      padding: '1rem', 
      backgroundColor: '#fff', 
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Long Content</h3>
      <p style={{ margin: 0, color: '#666', lineHeight: 1.6 }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
        incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
        exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </p>
    </div>

    <div style={{ 
      padding: '1rem', 
      backgroundColor: '#fff', 
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>More Content</h3>
      <p style={{ margin: 0, color: '#666', lineHeight: 1.6 }}>
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
        eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
        sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
    </div>

    <div style={{ 
      padding: '1rem', 
      backgroundColor: '#fff', 
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Bottom Section</h3>
      <p style={{ margin: 0, color: '#666', lineHeight: 1.6 }}>
        You've reached the bottom of the content area. The bottom navigation bar 
        should be visible below this content.
      </p>
    </div>
  </div>
);

export const Default: Story = {
  args: {
    showHeader: true,
    showBottomNavigation: true,
    contentPadding: 'md',
    backgroundColor: '#F5F5F5',
    smoothScroll: true,
  },
  render: (args) => (
    <MainLayout {...args}>
      <SampleContent />
    </MainLayout>
  ),
};

export const WithoutHeader: Story = {
  args: {
    ...Default.args,
    showHeader: false,
  },
};

export const WithoutBottomNavigation: Story = {
  args: {
    ...Default.args,
    showBottomNavigation: false,
  },
};

export const Minimal: Story = {
  args: {
    showHeader: false,
    showBottomNavigation: false,
    contentPadding: 'none',
    backgroundColor: '#FFFFFF',
  },
  render: (args) => (
    <MainLayout {...args}>
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ margin: 0, color: '#333' }}>Minimal Layout</h2>
        <p style={{ margin: '1rem 0 0 0', color: '#666' }}>
          No header, no bottom navigation, just pure content.
        </p>
      </div>
    </MainLayout>
  ),
};

export const CustomHeader: Story = {
  args: {
    ...Default.args,
    headerProps: {
      title: 'Custom Title',
      showBackButton: true,
      backgroundColor: '#FF6B35',
      textColor: '#FFFFFF',
      rightComponent: <HeaderSearchButton />,
    },
  },
};

export const CustomColors: Story = {
  args: {
    ...Default.args,
    backgroundColor: '#E8F5E9',
    contentBackgroundColor: '#FFFFFF',
    headerProps: {
      backgroundColor: '#4CAF50',
      textColor: '#FFFFFF',
    },
  },
  render: (args) => (
    <MainLayout {...args}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2 style={{ margin: 0, color: '#2E7D32' }}>Custom Colors Theme</h2>
        <p style={{ margin: 0, color: '#666', lineHeight: 1.6 }}>
          This layout demonstrates custom color theming with a green theme.
        </p>
        <div style={{ 
          padding: '1.5rem', 
          backgroundColor: '#C8E6C9', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, color: '#2E7D32', fontWeight: 'bold' }}>
            Green themed content area
          </p>
        </div>
      </div>
    </MainLayout>
  ),
};

export const DifferentPadding: Story = {
  args: {
    ...Default.args,
    contentPadding: 'xl',
  },
  render: (args) => (
    <MainLayout {...args}>
      <div style={{ 
        padding: '2rem', 
        backgroundColor: '#fff', 
        borderRadius: '8px',
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: 0, color: '#333' }}>Extra Large Padding</h2>
        <p style={{ margin: '1rem 0 0 0', color: '#666' }}>
          This content area has extra large padding (xl) for more breathing room.
        </p>
      </div>
    </MainLayout>
  ),
};

export const DesktopView: Story = {
  args: {
    ...Default.args,
    maxWidth: '1024px',
    backgroundColor: '#FAFAFA',
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
};

export const WithCustomRightComponent: Story = {
  args: {
    ...Default.args,
    headerProps: {
      title: 'Products',
      showBackButton: false,
      rightComponent: <HeaderEditButton onEdit={() => alert('Edit clicked!')} />,
    },
  },
};

export const DarkTheme: Story = {
  args: {
    ...Default.args,
    backgroundColor: '#1A1A1A',
    contentBackgroundColor: '#2D2D2D',
    headerProps: {
      backgroundColor: '#2D2D2D',
      textColor: '#FFFFFF',
      borderColor: '#404040',
    },
  },
  render: (args) => (
    <MainLayout {...args}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2 style={{ margin: 0, color: '#FFFFFF' }}>Dark Theme</h2>
        <p style={{ margin: 0, color: '#B0B0B0', lineHeight: 1.6 }}>
          This layout demonstrates a dark color theme.
        </p>
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#404040', 
          borderRadius: '8px'
        }}>
          <p style={{ margin: 0, color: '#E0E0E0' }}>
            Dark themed content area
          </p>
        </div>
      </div>
    </MainLayout>
  ),
};

export const NoSmoothScroll: Story = {
  args: {
    ...Default.args,
    smoothScroll: false,
  },
};

// Bottom Navigation Custom Styling Stories

export const WithCustomBottomNavBorder: Story = {
  args: {
    ...Default.args,
    maxWidth: '1024px',
    bottomNavigationBorderTop: '2px solid #FF6B35',
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        story: 'MainLayout với custom border top styling cho bottom navigation.',
      },
    },
  },
};

export const WithRoundedBottomNav: Story = {
  args: {
    ...Default.args,
    maxWidth: '1024px',
    bottomNavigationBorderRadius: '16px 16px 0 0',
    bottomNavigationBoxShadow: '0 -4px 16px rgba(0, 0, 0, 0.1)',
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        story: 'MainLayout với rounded top corners cho bottom navigation.',
      },
    },
  },
};

export const WithBottomNavShadow: Story = {
  args: {
    ...Default.args,
    maxWidth: '1024px',
    bottomNavigationBoxShadow: '0 -4px 12px rgba(255, 107, 53, 0.2)',
    bottomNavigationBorderTop: '1px solid rgba(255, 107, 53, 0.2)',
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        story: 'MainLayout với custom box shadow cho bottom navigation.',
      },
    },
  },
};

export const WithStickyBottomNav: Story = {
  args: {
    ...Default.args,
    bottomNavigationPosition: 'sticky',
    bottomNavigationBoxShadow: '0 -2px 8px rgba(0, 0, 0, 0.08)',
  },
  parameters: {
    docs: {
      description: {
        story: 'MainLayout với sticky position cho bottom navigation thay vì fixed.',
      },
    },
  },
};

export const FullCustomBottomNav: Story = {
  args: {
    ...Default.args,
    maxWidth: '1024px',
    bottomNavigationBorderTop: '2px solid #FF6B35',
    bottomNavigationBorderRadius: '8px 8px 0 0',
    bottomNavigationBoxShadow: '0 -4px 12px rgba(255, 107, 53, 0.2)',
    backgroundColor: '#FAFAFA',
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        story: 'MainLayout với full customization cho bottom navigation styling.',
      },
    },
  },
};

export const MinimalBottomNav: Story = {
  args: {
    ...Default.args,
    bottomNavigationBorderTop: 'none',
    bottomNavigationBoxShadow: 'none',
  },
  parameters: {
    docs: {
      description: {
        story: 'MainLayout với minimal bottom navigation styling (no border, no shadow).',
      },
    },
  },
};

export const DarkThemeBottomNav: Story = {
  args: {
    ...Default.args,
    maxWidth: '1024px',
    backgroundColor: '#1A1A1A',
    contentBackgroundColor: '#2D2D2D',
    headerProps: {
      backgroundColor: '#2D2D2D',
      textColor: '#FFFFFF',
      borderColor: '#404040',
    },
    bottomNavigationBorderTop: '1px solid #404040',
    bottomNavigationBoxShadow: '0 -2px 8px rgba(0, 0, 0, 0.4)',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        story: 'MainLayout với dark theme styling cho bottom navigation.',
      },
    },
    },
  };

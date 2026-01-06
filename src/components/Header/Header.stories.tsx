import type { Meta, StoryObj } from '@storybook/react';
import { Header, HeaderSearchButton, HeaderMenuButton, HeaderEditButton } from './Header';
import { MemoryRouter } from 'react-router-dom';

const meta: Meta<typeof Header> = {
  title: 'Layout/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Header component provides consistent navigation and visual hierarchy across the application. It supports custom titles, back navigation, right-side actions, and responsive design.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      description: 'Title displayed in the header',
      control: 'text',
    },
    showBackButton: {
      description: 'Whether to show the back button',
      control: 'boolean',
    },
    onBackPress: {
      description: 'Callback when back button is pressed',
      action: 'backPressed',
    },
    rightComponent: {
      description: 'Component to display on the right side',
      control: false,
    },
    backgroundColor: {
      description: 'Background color of the header',
      control: 'color',
    },
    textColor: {
      description: 'Text color of the header',
      control: 'color',
    },
    borderColor: {
      description: 'Border color of the header',
      control: 'color',
    },
    height: {
      description: 'Height of the header in pixels',
      control: { type: 'range', min: 40, max: 100, step: 4 },
    },
    className: {
      description: 'Additional CSS classes',
      control: 'text',
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div style={{ height: '200px', position: 'relative' }}>
          <Story />
          <div style={{ 
            height: '100vh', 
            background: 'linear-gradient(to bottom, #f5f5f5, #ffffff)',
            paddingTop: '100px'
          }}>
            <p style={{ padding: '20px' }}>Scroll down to see header behavior</p>
            <div style={{ height: '200vh' }}></div>
          </div>
        </div>
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Header>;

// Basic header
export const Default: Story = {
  args: {
    title: 'Pantry App',
  },
};

// Header with back button
export const WithBackButton: Story = {
  args: {
    title: 'Product Details',
    showBackButton: true,
  },
};

// Header with search button
export const WithSearchButton: Story = {
  args: {
    title: 'My Pantry',
    rightComponent: <HeaderSearchButton />,
  },
};

// Header with menu button
export const WithMenuButton: Story = {
  args: {
    title: 'Recipes',
    rightComponent: <HeaderMenuButton onToggle={() => console.log('Menu toggled')} />,
  },
};

// Header with edit button
export const WithEditButton: Story = {
  args: {
    title: 'Edit Product',
    rightComponent: <HeaderEditButton onEdit={() => console.log('Edit clicked')} />,
  },
};

// Header with multiple right buttons
export const WithMultipleButtons: Story = {
  args: {
    title: 'Product Details',
    showBackButton: true,
    rightComponent: (
      <div style={{ display: 'flex', gap: '8px' }}>
        <HeaderSearchButton />
        <HeaderEditButton onEdit={() => console.log('Edit clicked')} />
      </div>
    ),
  },
};

// Custom styled header
export const CustomStyled: Story = {
  args: {
    title: 'Premium Features',
    backgroundColor: '#1890ff',
    textColor: '#ffffff',
    borderColor: '#1890ff',
    height: 64,
  },
};

// Dark theme header
export const DarkTheme: Story = {
  args: {
    title: 'Dark Mode',
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
    borderColor: '#333333',
    className: 'header--dark',
  },
};

// Transparent header
export const Transparent: Story = {
  args: {
    title: 'Landing Page',
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    textColor: '#333333',
  },
};

// Long title (text truncation)
export const LongTitle: Story = {
  args: {
    title: 'This is a very long title that should be truncated when it exceeds the available space in the header',
    showBackButton: true,
  },
};

// Mobile size
export const Mobile: Story = {
  args: {
    title: 'Mobile View',
    showBackButton: true,
    rightComponent: <HeaderMenuButton onToggle={() => {}} />,
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphone12',
    },
  },
};

// Desktop size
export const Desktop: Story = {
  args: {
    title: 'Desktop View',
    height: 64,
    rightComponent: (
      <div style={{ display: 'flex', gap: '12px' }}>
        <HeaderSearchButton />
        <HeaderMenuButton onToggle={() => {}} />
      </div>
    ),
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
};

// Interactive story with custom back handler
export const Interactive: Story = {
  args: {
    title: 'Interactive Header',
    showBackButton: true,
    rightComponent: (
      <div style={{ display: 'flex', gap: '8px' }}>
        <HeaderSearchButton />
        <HeaderEditButton onEdit={() => console.log('Edit clicked from Storybook')} />
      </div>
    ),
  },
};

// Accessibility focused story
export const Accessibility: Story = {
  args: {
    title: 'Accessibility Demo',
    showBackButton: true,
    rightComponent: <HeaderSearchButton />,
  },
  parameters: {
    docs: {
      description: {
        story: 'This header demonstrates accessibility features including ARIA labels, keyboard navigation, and screen reader support.',
      },
    },
  },
};

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Button } from 'antd-mobile';
import { 
  HeartOutline,
  HeartFill,
  AddOutline,
  DeleteOutline,
  CheckOutline,
  CloseOutline,
  CameraOutline,
  TextOutline,
  PictureOutline,
  SoundOutline
} from 'antd-mobile-icons';

const meta: Meta<typeof Button> = {
  title: 'antd-mobile/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Button component from antd-mobile library. Supports various colors, sizes, states, and icon combinations.'
      }
    }
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'danger'],
      description: 'Button color theme'
    },
    size: {
      control: 'select',
      options: ['small', 'middle', 'large'],
      description: 'Button size'
    },
    fill: {
      control: 'select',
      options: ['solid', 'outline', 'none'],
      description: 'Button fill style'
    },
    shape: {
      control: 'select',
      options: ['default', 'rounded', 'rectangular'],
      description: 'Button shape'
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled'
    },
    loading: {
      control: 'boolean',
      description: 'Whether the button is in loading state'
    },
    block: {
      control: 'boolean',
      description: 'Whether the button should block its parent width'
    },
    children: {
      control: 'text',
      description: 'Button content'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic button stories
export const Default: Story = {
  args: {
    children: 'Default Button'
  }
};

export const Primary: Story = {
  args: {
    color: 'primary',
    children: 'Primary Button'
  }
};

export const Success: Story = {
  args: {
    color: 'success',
    children: 'Success Button'
  }
};

export const Warning: Story = {
  args: {
    color: 'warning',
    children: 'Warning Button'
  }
};

export const Danger: Story = {
  args: {
    color: 'danger',
    children: 'Danger Button'
  }
};

// Button sizes
export const Small: Story = {
  args: {
    size: 'small',
    children: 'Small Button'
  }
};

export const Middle: Story = {
  args: {
    size: 'middle',
    children: 'Middle Button'
  }
};

export const Large: Story = {
  args: {
    size: 'large',
    children: 'Large Button'
  }
};

// Button fill styles
export const Solid: Story = {
  args: {
    fill: 'solid',
    color: 'primary',
    children: 'Solid Button'
  }
};

export const Outline: Story = {
  args: {
    fill: 'outline',
    color: 'primary',
    children: 'Outline Button'
  }
};

export const None: Story = {
  args: {
    fill: 'none',
    color: 'primary',
    children: 'Text Button'
  }
};

// Button shapes
export const Rounded: Story = {
  args: {
    shape: 'rounded',
    color: 'primary',
    children: 'Rounded Button'
  }
};

export const Rectangular: Story = {
  args: {
    shape: 'rectangular',
    color: 'primary',
    children: 'Rectangular Button'
  }
};

// States
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button'
  }
};

export const Loading: Story = {
  args: {
    loading: true,
    children: 'Loading Button'
  }
};

export const LoadingWithText: Story = {
  args: {
    loading: true,
    children: 'Submitting...'
  }
};

// Block button
export const Block: Story = {
  args: {
    block: true,
    color: 'primary',
    children: 'Block Button'
  },
  parameters: {
    layout: 'padded'
  }
};

// Buttons with icons
export const WithIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <CheckOutline />
        <Button color="success">Confirm</Button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <DeleteOutline />
        <Button color="danger">Delete</Button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <CloseOutline />
        <Button color="warning">Cancel</Button>
      </div>
    </div>
  )
};

export const IconOnly: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <Button color="primary">
        <HeartOutline />
      </Button>
      <Button color="danger">
        <HeartFill />
      </Button>
      <Button color="success">
        <CheckOutline />
      </Button>
      <Button color="warning">
        <CloseOutline />
      </Button>
      <Button>
        <CameraOutline />
      </Button>
    </div>
  )
};

// Interactive components
const ClickCounterComponent = () => {
  const [count, setCount] = React.useState(0);
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ marginBottom: '16px' }}>Click count: {count}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <AddOutline />
        <Button 
          color="primary" 
          onClick={() => setCount(count + 1)}
        >
          Click me
        </Button>
      </div>
    </div>
  );
};

const ToggleButtonComponent = () => {
  const [liked, setLiked] = React.useState(false);
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
      {liked ? <HeartFill /> : <HeartOutline />}
      <Button 
        color={liked ? 'danger' : 'default'}
        fill={liked ? 'solid' : 'outline'}
        onClick={() => setLiked(!liked)}
      >
        {liked ? 'Liked' : 'Like'}
      </Button>
    </div>
  );
};

export const ClickCounter: Story = {
  render: () => <ClickCounterComponent />
};

export const ToggleButton: Story = {
  render: () => <ToggleButtonComponent />
};

// Comprehensive showcase
export const AllVariants: Story = {
  render: () => (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <h3>Button Colors</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
        <Button color="default">Default</Button>
        <Button color="primary">Primary</Button>
        <Button color="success">Success</Button>
        <Button color="warning">Warning</Button>
        <Button color="danger">Danger</Button>
      </div>

      <h3>Button Fills</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
        <Button color="primary" fill="solid">Solid</Button>
        <Button color="primary" fill="outline">Outline</Button>
        <Button color="primary" fill="none">Text</Button>
      </div>

      <h3>Button Sizes</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
        <Button color="primary" size="small">Small</Button>
        <Button color="primary" size="middle">Middle</Button>
        <Button color="primary" size="large">Large</Button>
      </div>

      <h3>Button Shapes</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
        <Button color="primary" shape="default">Default</Button>
        <Button color="primary" shape="rounded">Rounded</Button>
        <Button color="primary" shape="rectangular">Rectangular</Button>
      </div>

      <h3>States</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
        <Button color="primary">Normal</Button>
        <Button color="primary" disabled>Disabled</Button>
        <Button color="primary" loading>Loading</Button>
      </div>

      <h3>Block Button</h3>
      <div style={{ marginBottom: '24px' }}>
        <Button color="primary" block>Block Button</Button>
      </div>

      <h3>With Icons</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TextOutline />
          <Button color="primary">Text</Button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PictureOutline />
          <Button color="success">Image</Button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SoundOutline />
          <Button color="warning">Audio</Button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button color="primary">
            <HeartOutline />
          </Button>
          <span>Icon only</span>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded'
  }
};

// Playground story for interactive testing
export const Playground: Story = {
  args: {
    color: 'primary',
    size: 'middle',
    fill: 'solid',
    shape: 'default',
    disabled: false,
    loading: false,
    block: false,
    children: 'Playground Button'
  }
};

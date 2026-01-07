import React from 'react';

const HomeScreen: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h1 style={{ margin: 0, color: '#333' }}>Home Screen</h1>
      <p style={{ margin: 0, color: '#666', lineHeight: 1.6 }}>
        Welcome to your home screen. This screen uses the MainLayout component
        with Header and BottomNavigation.
      </p>
      
      <div style={{ 
        padding: '1.5rem', 
        backgroundColor: '#fff', 
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Quick Stats</h2>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#666' }}>
          <li>Total Items: 0</li>
          <li>Expiring Soon: 0</li>
          <li>Low Stock: 0</li>
        </ul>
      </div>
    </div>
  );
};

export default HomeScreen;

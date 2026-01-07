import { Routes, Route, Outlet } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import AddProductScreen from './screens/AddProductScreen';
import RecipesScreen from './screens/RecipesScreen';
import ProfileScreen from './screens/ProfileScreen';
import './App.css';

// Layout wrapper component
const LayoutWrapper = () => (
  <MainLayout>
    <Outlet />
  </MainLayout>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<LayoutWrapper />}>
        <Route index element={<HomeScreen />} />
        <Route path="search" element={<SearchScreen />} />
        <Route path="add-product" element={<AddProductScreen />} />
        <Route path="recipes" element={<RecipesScreen />} />
        <Route path="profile" element={<ProfileScreen />} />
      </Route>
    </Routes>
  );
}

export default App;

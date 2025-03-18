import React from 'react';
import { 
  createBrowserRouter, 
  RouterProvider,
  createRoutesFromElements,
  Route,
  Navigate,
  Outlet
} from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Collections from './pages/Collections';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Order from './pages/Order';
import SchoolOrders from './pages/SchoolOrders';
import ParentOrders from './pages/ParentOrders';

// Create a layout component
const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ErrorBoundary>
        <Navbar />
        <main>
          <React.Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </React.Suspense>
        </main>
      </ErrorBoundary>
    </div>
  );
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />}>
      <Route path="/" element={<Home />} />
      <Route path="/collections" element={<Collections />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/order" element={<Order />} />
      <Route path="/school-orders" element={<SchoolOrders />} />
      <Route path="/parent-orders" element={<ParentOrders />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Route>
  ),
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
      v7_prependBasename: true
    }
  }
);

function App() {
  return (
    <RouterProvider 
      router={router}
      fallbackElement={<div>Loading app...</div>}
    />
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './compontents/Navbar';
import Home from './compontents/home/Home';
import Products from './compontents/Products';
import Cart from './compontents/cart/Cart';
import LogIn from './compontents/auth/LogIn';
import Register from './compontents/auth/Register';
import PrivateRoute from './compontents/PrivateRoute';

import ManageCategories from './compontents/ManageCategories';
import ManageProducts from './compontents/ManageProducts';

function App() {
  return (
    <React.Fragment>
      <Router>
        <Navbar />
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />

          <Route element={<PrivateRoute publicPage />}>
            <Route path="/login" element={<LogIn />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={['admin']} />}>
            <Route path="/admin/categories" element={<ManageCategories />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={['admin', 'worker']} />}>
            <Route path="/admin/products" element={<ManageProducts />} />
          </Route>
        </Routes>
      </Router>
      <Toaster position="bottom-center" />
    </React.Fragment>
  );
}

export default App;


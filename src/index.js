import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Welcome from './components/Welcome';
import Products from './components/Products';
import serviceAuth from './services/auth.service'
import Profile from './components/Profile';
import Admin from './components/Admin/Home';
import ResetPassword from './components/ResetPassword';
import Points from './components/Points/Points';
import Reviews from './components/Reviews';
import Views from './components/Views';
import ProductsPurchasedAdmin from './components/Admin/ProductsPurchased';
import CreateProduct from './components/CreateProduct';
import { Home } from '@mui/icons-material';
import ProductsAdmin from './components/Admin/ProductsAdmin';
import MyProducts from './components/MyProducts';
import MyShoppings from './components/MyShoppings';
import AccountStatus from './components/AccountStatus';
import Info from './components/Info';

const root = ReactDOM.createRoot(document.getElementById('root'));

const ProtectedRoute = ({ children }) => {
  var user = serviceAuth.getCurrentUser();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const ProtectedRouteAdmin = ({ children }) => {
  var user = serviceAuth.getCurrentUser();
  if (!user) {
    return <Navigate to="/" replace />;
  }else if(user.isAdmin){
    return children;
  }else{
    return <Navigate to="/productos" replace/>;
  }
};

const ProtectedRouteLogin = ({ children }) => {
  var user = serviceAuth.getCurrentUser();
  if (user) {
    return <Navigate to="/productos" replace />;
  }
  return children;
};

root.render(
  <Router>
    <Routes>
      <Route exact path="/" element={ <ProtectedRouteLogin >  <Welcome /> </ProtectedRouteLogin>}></Route>
      <Route exact path='/ejemploDeIntegracion' element={ <ProtectedRoute >  <Home /> </ProtectedRoute> }></Route>
      <Route exact path="/profile" element={ <ProtectedRoute >  <Profile /> </ProtectedRoute>}></Route>
      <Route exact path="/accountStatus" element={ <ProtectedRoute >  <AccountStatus /> </ProtectedRoute>}></Route>
      <Route exact path="/resetPassword/:jwtoken" element={  <ResetPassword /> }></Route>
      <Route exact path="/productos" element={ <ProtectedRoute > <Products /> </ProtectedRoute>}></Route>
      <Route exact path="/resenas" element={<ProtectedRoute> <Reviews /> </ProtectedRoute>}></Route>
      <Route exact path="/buys/points" element={<ProtectedRoute> <Points /> </ProtectedRoute>}></Route>
      <Route exact path="/createProducts" element={<ProtectedRoute> <CreateProduct /> </ProtectedRoute>}></Route>
      <Route exact path="/updateProduct/:productId" element={<ProtectedRoute> <CreateProduct /> </ProtectedRoute>}></Route>
      <Route exact path="/misproductos" element={<ProtectedRoute> <MyProducts /> </ProtectedRoute>}></Route>
      <Route exact path="/miscompras" element={<ProtectedRoute> <MyShoppings /> </ProtectedRoute>}></Route>
      <Route exact path="/misresenas" element={<ProtectedRoute> <Views /> </ProtectedRoute>}></Route>
      <Route exact path="/admin" element={<ProtectedRouteAdmin> <Admin /> </ProtectedRouteAdmin>}></Route>
      <Route exact path="/admin/productos" element={ <ProtectedRouteAdmin > <ProductsAdmin /> </ProtectedRouteAdmin>}></Route>
      <Route exact path="/admin/comprasAdmin" element={ <ProtectedRouteAdmin > <ProductsPurchasedAdmin /> </ProtectedRouteAdmin>}></Route>
      <Route exact path="/info" element={<Info/>}></Route>

    </Routes>
  </Router>
);


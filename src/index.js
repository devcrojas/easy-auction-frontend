import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from './components/Home';
import Welcome from './components/Welcome';
import Products from './components/Products';
import Reviews from './components/Reviews';
import Register from './components/Register';
import Sellers from './components/Sellers';
import serviceAuth from './services/auth.service'
import Profile from './components/Profile';
const root = ReactDOM.createRoot(document.getElementById('root'));

const ProtectedRoute = ({ children }) => {
  var user = serviceAuth.getCurrentUser();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const ProtectedRouteLogin = ({ children }) => {
  var user = serviceAuth.getCurrentUser();
  if (user) {
    return <Navigate to="/producto" replace />;
  }
  return children;
};

root.render(
  <Router>
    <Routes>
      <Route exact path="/" element={ <ProtectedRouteLogin >  <Welcome /> </ProtectedRouteLogin>}></Route>
      <Route exact path='/producto' element={ <ProtectedRoute >  <Home /> </ProtectedRoute> }></Route>
      <Route exact path="/register" element={<Register />}></Route>
      <Route exact path="/products" element={<Products />}></Route>
      <Route exact path="/reviews" element={<Reviews />}></Route>
      <Route exact path="/sellers" element={<Sellers />}></Route>
      <Route exact path="/perfil" element={ <ProtectedRoute >  <Profile  /> </ProtectedRoute>}></Route>
    </Routes>
  </Router>
);


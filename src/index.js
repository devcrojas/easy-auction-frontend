import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from './components/Home';
import Welcome from './components/Welcome';
import Products from './components/Products';
import Resenas from './components/Resenas';
import Register from './components/Register';
import serviceAuth from './services/auth.service'
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
    return <Navigate to="/home" replace />;
  }
  return children;
};

root.render(
  <Router>
    <Routes>
      <Route exact path="/" element={ <ProtectedRouteLogin >  <Welcome /> </ProtectedRouteLogin>}></Route>
      <Route exact path='/home' element={ <ProtectedRoute >  <Home /> </ProtectedRoute> }></Route>
      <Route exact path="/register" element={<Register />}></Route>
      <Route exact path="/productos" element={<ProtectedRoute > <Products /></ProtectedRoute> }></Route>
      <Route exact path="/resenas" element={<Resenas />}></Route>
    </Routes>
  </Router>
);


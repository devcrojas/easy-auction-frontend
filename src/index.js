import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Welcome from './components/Welcome';
import Register from './components/Register';
import serviceAuth from './services/auth.service'
import Profile from './components/Profile';
import Products from './components/Products';
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
      <Route exact path='/producto' element={ <ProtectedRoute >  <Products /> </ProtectedRoute> }></Route>
      <Route exact path="/registro" element={<Register />}></Route>
      <Route exact path="/perfil" element={ <ProtectedRoute >  <Profile  /> </ProtectedRoute>}></Route>
    </Routes>
  </Router>
);


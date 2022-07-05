import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Welcome from './components/Welcome';
import Products from './components/Products';
import serviceAuth from './services/auth.service'
import Profile from './components/Profile';
import ResetPassword from './components/ResetPassword';
import Reviews from './components/Reviews';
import { Home } from '@mui/icons-material';
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
      <Route exact path='/ejemploDeIntegracion' element={ <ProtectedRoute >  <Home /> </ProtectedRoute> }></Route>
      <Route exact path="/profile" element={ <ProtectedRoute >  <Profile /> </ProtectedRoute>}></Route>
      <Route exact path="/resetPassword/:jwtoken" element={  <ResetPassword /> }></Route>
      <Route exact path="/producto" element={ <ProtectedRoute > <Products /> </ProtectedRoute>}></Route>
      <Route exact path="/reviews" element={<ProtectedRoute> <Reviews /> </ProtectedRoute>}></Route>
    </Routes>
  </Router>
);


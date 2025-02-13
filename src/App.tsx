import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CloudKitchen from './pages/CloudKitchen';
import DietPlanner from './pages/DietPlanner';
import Sustainability from './pages/Sustainability';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cloud-kitchen" element={
                <ProtectedRoute>
                  <CloudKitchen />
                </ProtectedRoute>
              } />
              <Route path="/diet-planner" element={
                <ProtectedRoute>
                  <DietPlanner />
                </ProtectedRoute>
              } />
              <Route path="/sustainability" element={
                <ProtectedRoute>
                  <Sustainability />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
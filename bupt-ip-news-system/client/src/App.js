import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import GlobalStyles from './styles/GlobalStyles';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Page Components
import HomePage from './components/pages/HomePage';
import NewsPage from './components/pages/NewsPage';
import NewsDetailPage from './components/pages/NewsDetailPage';
import SearchResultsPage from './components/pages/SearchResultsPage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import ProfilePage from './components/pages/ProfilePage';
import AdminDashboardPage from './components/pages/AdminDashboardPage';
import NotFoundPage from './components/pages/NotFoundPage';

// Protected Routes
import PrivateRoute from './components/auth/PrivateRoute';
import AdminRoute from './components/auth/AdminRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <GlobalStyles />
        <Header />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:id" element={<NewsDetailPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Routes */}
            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin/*" 
              element={
                <AdminRoute>
                  <AdminDashboardPage />
                </AdminRoute>
              } 
            />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
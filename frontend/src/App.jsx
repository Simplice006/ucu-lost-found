import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ReportDetail from './pages/ReportDetail';
import ReportForm from './pages/ReportForm';
import MyReports from './pages/MyReports';
import MyClaims from './pages/MyClaims';
import AdminClaims from './pages/AdminClaims';

export default function App() {
  const { pathname } = useLocation();
  // Move focus to the page content after navigating, so keyboard and screen-reader users start at the top.
  useEffect(() => { document.getElementById('main')?.focus({ preventScroll: false }); }, [pathname]);

  return (
    <>
      <a href="#main" className="skip-link">Skip to main content</a>
      <Navbar />
      <main id="main" className="container" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reports/new" element={<ProtectedRoute><ReportForm /></ProtectedRoute>} />
          <Route path="/reports/:id" element={<ReportDetail />} />
          <Route path="/reports/:id/edit" element={<ProtectedRoute><ReportForm /></ProtectedRoute>} />
          <Route path="/my-reports" element={<ProtectedRoute><MyReports /></ProtectedRoute>} />
          <Route path="/my-claims" element={<ProtectedRoute><MyClaims /></ProtectedRoute>} />
          <Route path="/admin/claims" element={<ProtectedRoute adminOnly><AdminClaims /></ProtectedRoute>} />
          <Route path="*" element={
            <section><h1>Page not found</h1><p>This page does not exist. Use the menu to go back to the listings.</p></section>
          } />
        </Routes>
      </main>
    </>
  );
}

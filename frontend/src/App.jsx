import { useEffect } from 'react';
import { Outlet, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Browse from './pages/Browse';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import ReportDetail from './pages/ReportDetail';
import ReportForm from './pages/ReportForm';
import MyReports from './pages/MyReports';
import MyClaims from './pages/MyClaims';
import AdminClaims from './pages/AdminClaims';
import PageHeader from './components/PageHeader';

// Inner pages: each one renders its own dark banner, then its content inside a centred container.
function PageLayout() {
  return <div className="page"><Outlet /></div>;
}

export default function App() {
  const { pathname } = useLocation();
  // After navigating: scroll to the top, then move focus to the page content so keyboard and screen-reader users start there.
  // preventScroll keeps the browser from scrolling <main> underneath the sticky header.
  useEffect(() => {
    window.scrollTo(0, 0);
    document.getElementById('main')?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <div className="app-shell">
      <a href="#main" className="skip-link">Skip to main content</a>
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<PageLayout />}>
            <Route path="/items" element={<Browse />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reports/new" element={<ProtectedRoute><ReportForm /></ProtectedRoute>} />
            <Route path="/reports/:id" element={<ReportDetail />} />
            <Route path="/reports/:id/edit" element={<ProtectedRoute><ReportForm /></ProtectedRoute>} />
            <Route path="/my-reports" element={<ProtectedRoute><MyReports /></ProtectedRoute>} />
            <Route path="/my-claims" element={<ProtectedRoute><MyClaims /></ProtectedRoute>} />
            <Route path="/admin/claims" element={<ProtectedRoute adminOnly><AdminClaims /></ProtectedRoute>} />
            <Route path="*" element={
              <>
                <PageHeader title="Page not found" subtitle="This page does not exist. Use the menu to go back to the listings." />
              </>
            } />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

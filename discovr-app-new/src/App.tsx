import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage, AdminLogin, AdminSignup, BrandLogin, BrandSignup, CreatorLogin, CreatorSignup, UnauthorizedPage, Profile, Settings, ForgotPassword, ResetPassword } from './pages';
import { AdminDashboard, BrandDashboard, CreatorDashboard, NewCampaign, CampaignDetails, CreatorDetails, CreatorCampaignDetails } from './pages/dashboards';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ProtectedRoute, ErrorBoundary } from './components';
import './index.css';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <NotificationProvider>
              <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/signup" element={<AdminSignup />} />
            <Route path="/brand/login" element={<BrandLogin />} />
            <Route path="/brand/signup" element={<BrandSignup />} />
            <Route path="/creator/login" element={<CreatorLogin />} />
            <Route path="/creator/signup" element={<CreatorSignup />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Profile & Settings (Protected) */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['admin', 'brand_owner', 'brand_emp', 'creator']}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute allowedRoles={['admin', 'brand_owner', 'brand_emp', 'creator']}>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* Admin Protected Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Brand Protected Routes */}
            <Route
              path="/brand/dashboard"
              element={
                <ProtectedRoute allowedRoles={['brand_owner', 'brand_emp']}>
                  <BrandDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/brand/new-campaign"
              element={
                <ProtectedRoute allowedRoles={['brand_owner', 'brand_emp']}>
                  <NewCampaign />
                </ProtectedRoute>
              }
            />
            <Route
              path="/brand/campaign/:id"
              element={
                <ProtectedRoute allowedRoles={['brand_owner', 'brand_emp']}>
                  <CampaignDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/brand/campaign/:id/creator/:creatorId"
              element={
                <ProtectedRoute allowedRoles={['brand_owner', 'brand_emp']}>
                  <CreatorDetails />
                </ProtectedRoute>
              }
            />

            {/* Creator Protected Routes */}
            <Route
              path="/creator/dashboard"
              element={
                <ProtectedRoute allowedRoles={['creator']}>
                  <CreatorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/creator/campaign/:id"
              element={
                <ProtectedRoute allowedRoles={['creator']}>
                  <CreatorCampaignDetails />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
            </NotificationProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

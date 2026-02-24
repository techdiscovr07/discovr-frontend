import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CareersPage, BrandLogin, BrandSignup, CreatorLogin, CreatorSignup, UnauthorizedPage, ForgotPassword, ResetPassword } from './modules/landing';
const LandingPage = React.lazy(() => import('./modules/landing').then(m => ({ default: m.LandingPage })));
const CreatorLandingPage = React.lazy(() => import('./modules/landing').then(m => ({ default: m.CreatorLandingPage })));
import { PrivacyPolicy, TermsOfService } from './modules/legal';
const Profile = React.lazy(() => import('./modules/shared').then(m => ({ default: m.Profile })));
const Settings = React.lazy(() => import('./modules/shared').then(m => ({ default: m.Settings })));
const BrandDashboard = React.lazy(() => import('./modules/brand-dashboard').then(m => ({ default: m.BrandDashboard })));
const NewCampaign = React.lazy(() => import('./modules/brand-dashboard').then(m => ({ default: m.NewCampaign })));
const CampaignDetails = React.lazy(() => import('./modules/brand-dashboard').then(m => ({ default: m.CampaignDetails })));
const CreatorDetails = React.lazy(() => import('./modules/brand-dashboard').then(m => ({ default: m.CreatorDetails })));
const CreatorDashboard = React.lazy(() => import('./modules/creator-dashboard').then(m => ({ default: m.CreatorDashboard })));
const CreatorCampaignDetails = React.lazy(() => import('./modules/creator-dashboard').then(m => ({ default: m.CreatorCampaignDetails })));
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ProtectedRoute, ErrorBoundary, LoadingSpinner } from './components';
import './index.css';

function App() {
  // Debug log to verify App is rendering
  console.log('App component rendering...');

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <NotificationProvider>
              <Router>
                <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><LoadingSpinner /></div>}>
                  <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/careers" element={<CareersPage />} />

                  <Route path="/creator" element={<CreatorLandingPage />} />
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
                      <ProtectedRoute allowedRoles={['brand_owner', 'brand_emp', 'creator']}>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute allowedRoles={['brand_owner', 'brand_emp', 'creator']}>
                        <Settings />
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
                  </Suspense>
              </Router>
            </NotificationProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

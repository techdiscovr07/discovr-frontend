import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProtectedRoute, LoadingSpinner } from './components';

const LandingPage = React.lazy(() => import('./modules/landing').then(m => ({ default: m.LandingPage })));
const CreatorLandingPage = React.lazy(() => import('./modules/landing').then(m => ({ default: m.CreatorLandingPage })));
const CareersPage = React.lazy(() => import('./modules/landing').then(m => ({ default: m.CareersPage })));
const BrandLogin = React.lazy(() => import('./modules/landing').then(m => ({ default: m.BrandLogin })));
const BrandSignup = React.lazy(() => import('./modules/landing').then(m => ({ default: m.BrandSignup })));
const CreatorLogin = React.lazy(() => import('./modules/landing').then(m => ({ default: m.CreatorLogin })));
const CreatorSignup = React.lazy(() => import('./modules/landing').then(m => ({ default: m.CreatorSignup })));
const CreatorInstagramConnect = React.lazy(() => import('./modules/landing').then(m => ({ default: m.CreatorInstagramConnect })));
const UnauthorizedPage = React.lazy(() => import('./modules/landing').then(m => ({ default: m.UnauthorizedPage })));
const ForgotPassword = React.lazy(() => import('./modules/landing').then(m => ({ default: m.ForgotPassword })));
const ResetPassword = React.lazy(() => import('./modules/landing').then(m => ({ default: m.ResetPassword })));

const PrivacyPolicy = React.lazy(() => import('./modules/legal').then(m => ({ default: m.PrivacyPolicy })));
const TermsOfService = React.lazy(() => import('./modules/legal').then(m => ({ default: m.TermsOfService })));

const Profile = React.lazy(() => import('./modules/shared').then(m => ({ default: m.Profile })));
const Settings = React.lazy(() => import('./modules/shared').then(m => ({ default: m.Settings })));
const BrandDashboard = React.lazy(() => import('./modules/brand-dashboard').then(m => ({ default: m.BrandDashboard })));
const NewCampaign = React.lazy(() => import('./modules/brand-dashboard').then(m => ({ default: m.NewCampaign })));
const CampaignDetails = React.lazy(() => import('./modules/brand-dashboard').then(m => ({ default: m.CampaignDetails })));
const CreatorDetails = React.lazy(() => import('./modules/brand-dashboard').then(m => ({ default: m.CreatorDetails })));
const BrandCreatorInfo = React.lazy(() => import('./modules/brand-dashboard').then(m => ({ default: m.BrandCreatorInfo })));
const CreatorDashboard = React.lazy(() => import('./modules/creator-dashboard').then(m => ({ default: m.CreatorDashboard })));
const CreatorCampaignDetails = React.lazy(() => import('./modules/creator-dashboard').then(m => ({ default: m.CreatorCampaignDetails })));

function App() {
  return (
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
          <Route path="/auth/brand/login" element={<BrandLogin />} />
          <Route path="/auth/brand/signup" element={<BrandSignup />} />
          <Route path="/auth/creator/login" element={<CreatorLogin />} />
          <Route path="/auth/creator/signup" element={<CreatorSignup />} />
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
          <Route
            path="/brand/creator/:creatorId"
            element={
              <ProtectedRoute allowedRoles={['brand_owner', 'brand_emp']}>
                <BrandCreatorInfo />
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
            path="/creator/connect-instagram"
            element={
              <ProtectedRoute allowedRoles={['creator']}>
                <CreatorInstagramConnect />
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
  );
}

export default App;

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/home/Home';
import { About } from './pages/about/About';
import { Services } from './pages/services/Services';
import { Projects } from './pages/projects/Projects';
import { Approach } from './pages/approach/Approach';
import { FAQ } from './pages/faq/FAQ';
import { Contact } from './pages/contact/Contact';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { VerifyOtp } from './pages/auth/VerifyOtp';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// Admin imports
import { AdminLayout } from './layouts/AdminLayout';
import { AdminRoute } from './components/admin/AdminRoute';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProjects } from './pages/admin/AdminProjects';
import { AdminRequests } from './pages/admin/AdminRequests';
import { AdminMessageDetail } from './pages/admin/AdminMessageDetail';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminUserDetail } from './pages/admin/AdminUserDetail';
import { AdminDemos } from './pages/admin/AdminDemos';
import { AdminEmail } from './pages/admin/AdminEmail';
import { AdminSettings } from './pages/admin/AdminSettings';

// Client Dashboard imports
import { UserLayout } from './layouts/UserLayout';
import { DashboardOverview } from './pages/dashboard/DashboardOverview';
import { DashboardProfile } from './pages/dashboard/DashboardProfile';
import { DashboardRequests } from './pages/dashboard/DashboardRequests';
import { DashboardDemos } from './pages/dashboard/DashboardDemos';
import { DashboardNotifications } from './pages/dashboard/DashboardNotifications';
import { DashboardSettings } from './pages/dashboard/DashboardSettings';

function ScrollToTopOnNavigation() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, hash]);

  return null;
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTopOnNavigation />
        <Routes>
          {/* Dedicated Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Portal with Sidebar & Header Layout */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="requests" element={<AdminRequests />} />
            <Route path="requests/:id" element={<AdminMessageDetail />} />
            <Route path="messages" element={<AdminRequests />} />
            <Route path="messages/:id" element={<AdminMessageDetail />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/:id" element={<AdminUserDetail />} />
            <Route path="demos" element={<AdminDemos />} />
            <Route path="email" element={<AdminEmail />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Protected Client Dashboard Portal with UserLayout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="profile" element={<DashboardProfile />} />
            <Route path="requests" element={<DashboardRequests />} />
            <Route path="demos" element={<DashboardDemos />} />
            <Route path="notifications" element={<DashboardNotifications />} />
            <Route path="settings" element={<DashboardSettings />} />
          </Route>

          {/* Public & Client Protected Routes wrapped in MainLayout */}
          <Route element={<MainLayout />}>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/approach" element={<Approach />} />
            <Route path="/faq" element={<FAQ />} />

            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />

            {/* Protected Routes */}
            <Route
              path="/contact"
              element={
                <ProtectedRoute>
                  <Contact />
                </ProtectedRoute>
              }
            />

            {/* Catch-all Route */}
            <Route path="*" element={<Home />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

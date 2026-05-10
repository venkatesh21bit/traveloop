import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import AuthLayout from '@/layouts/AuthLayout';
import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const MyTripsPage = lazy(() => import('@/pages/MyTripsPage'));
const CityDiscoveryPage = lazy(() => import('@/pages/CityDiscoveryPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

export interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
  public?: boolean;
  children?: RouteConfig[];
}

export const routes: RouteConfig[] = [
  {
    name: 'Root',
    path: '/',
    element: <Navigate to="/dashboard" replace />,
    public: true,
  },
  {
    name: 'Login',
    path: '/login',
    element: (
      <AuthLayout>
        <LoginPage />
      </AuthLayout>
    ),
    public: true,
  },
  {
    name: 'Signup',
    path: '/signup',
    element: (
      <AuthLayout>
        <SignupPage />
      </AuthLayout>
    ),
    public: true,
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <DashboardPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    name: 'My Trips',
    path: '/trips',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <MyTripsPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    name: 'Discover Cities',
    path: '/discover/cities',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <CityDiscoveryPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    name: 'Not Found',
    path: '*',
    element: <NotFoundPage />,
    public: true,
  },
];


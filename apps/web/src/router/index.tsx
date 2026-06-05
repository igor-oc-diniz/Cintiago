import { createBrowserRouter } from 'react-router-dom'
import { AuthGuard } from './AuthGuard'
import { lazy, Suspense } from 'react'

const Home           = lazy(() => import('@/pages/Home'))
const PizzaDetail    = lazy(() => import('@/pages/PizzaDetail'))
const Cart           = lazy(() => import('@/pages/Cart'))
const SelectDelivery = lazy(() => import('@/pages/SelectDelivery'))
const SelectPayment  = lazy(() => import('@/pages/SelectPayment'))
const Login          = lazy(() => import('@/pages/Login'))
const Onboarding     = lazy(() => import('@/pages/Onboarding'))
const OrderConfirm   = lazy(() => import('@/pages/OrderConfirm'))
const OrderTracking  = lazy(() => import('@/pages/OrderTracking'))
const MyOrders       = lazy(() => import('@/pages/MyOrders'))
const OrderDetail    = lazy(() => import('@/pages/OrderDetail'))
const Profile        = lazy(() => import('@/pages/Profile'))

const Fallback = () => (
  <div className="flex h-screen items-center justify-center bg-background">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
)

export const router = createBrowserRouter([
  // Rotas públicas
  {
    path: '/',
    element: <Suspense fallback={<Fallback />}><Home /></Suspense>,
  },
  {
    path: '/pizza/:id',
    element: <Suspense fallback={<Fallback />}><PizzaDetail /></Suspense>,
  },
  {
    path: '/cart',
    element: <Suspense fallback={<Fallback />}><Cart /></Suspense>,
  },
  {
    path: '/cart/delivery',
    element: <Suspense fallback={<Fallback />}><SelectDelivery /></Suspense>,
  },
  {
    path: '/cart/payment',
    element: <Suspense fallback={<Fallback />}><SelectPayment /></Suspense>,
  },
  {
    path: '/login',
    element: <Suspense fallback={<Fallback />}><Login /></Suspense>,
  },

  // Requer login mas não perfil completo
  {
    element: <AuthGuard requireProfile={false} />,
    children: [
      {
        path: '/onboarding',
        element: <Suspense fallback={<Fallback />}><Onboarding /></Suspense>,
      },
    ],
  },

  // Requer login + perfil completo
  {
    element: <AuthGuard requireProfile={true} />,
    children: [
      {
        path: '/order/confirm',
        element: <Suspense fallback={<Fallback />}><OrderConfirm /></Suspense>,
      },
      {
        path: '/order/:id/tracking',
        element: <Suspense fallback={<Fallback />}><OrderTracking /></Suspense>,
      },
      {
        path: '/orders',
        element: <Suspense fallback={<Fallback />}><MyOrders /></Suspense>,
      },
      {
        path: '/orders/:id',
        element: <Suspense fallback={<Fallback />}><OrderDetail /></Suspense>,
      },
      {
        path: '/profile',
        element: <Suspense fallback={<Fallback />}><Profile /></Suspense>,
      },
    ],
  },
])

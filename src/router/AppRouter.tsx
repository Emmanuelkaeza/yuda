import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Admin from "../pages/Admin";
import NotFound from "../pages/NotFound";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";
import PatientDetails from "../pages/PatientDetails";
import PaymentSuccess from "../pages/PaymentSuccess";
import TableauPayment from "@/pages/Payment/TableauPayment";
import { PaymentsList } from "@/components/PaymentsList";
import { PaymentDetail } from "@/components/PaymentDetail";
import NewSubscription from "@/pages/NewSubscription";
import Subscriptions from "@/pages/Subscriptions";
import path from "path";

function PrivateRoute({ children, allowedRoles }: { children: JSX.Element; allowedRoles?: string[] }) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // Si non authentifié, rediriger vers login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si l'utilisateur n'a pas le rôle requis
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Rediriger vers la page appropriée en fonction du rôle
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return children;
}

function AuthRedirect({ children }: { children: JSX.Element }) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (isAuthenticated && user) {
    // Si on est sur la page login et qu'on est authentifié
    if (location.pathname === '/login') {
      // Rediriger en fonction du rôle
      if (user.role === 'admin') {
        return <Navigate to="/admin" replace />;
      } else {
        return <Navigate to="/dashboard" replace />;
      }
    }
  }

  return children;
}

// Définir les routes en dehors du composant pour éviter les re-rendus inutiles
const routes = [
  { path: "/", element: <Home /> },
  {
    path: "/login",
    element: (
      <AuthRedirect>
        <Login />
      </AuthRedirect>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute allowedRoles={['receptionist']}>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <Admin />
      </PrivateRoute>
    ),
  },
  {
    path: "/patients/:id",
    element: (
      <PrivateRoute allowedRoles={['admin', 'receptionist']}>
        <PatientDetails />
      </PrivateRoute>
    ),
  },
  {
    path: "/payment-success",
    element: (
      <PrivateRoute allowedRoles={['admin', 'receptionist']}>
        <PaymentSuccess />
      </PrivateRoute>
    )
  },
  {
    path: "/payments",
    element: (
      <PrivateRoute allowedRoles={['admin', 'receptionist']}>
        <PaymentsList />
      </PrivateRoute>
    )
  },
  {
    path: "/payments/:id",
    element: (
      <PrivateRoute allowedRoles={['admin', 'receptionist']}>
        <PaymentDetail />
      </PrivateRoute>
    )
  },
  {
    path: "/subscriptions/new",
    element: (
      <PrivateRoute allowedRoles={['admin', 'receptionist']}>
        <NewSubscription />
      </PrivateRoute>
    )
  },
  {
    path: "/subscriptions",
    element: (
      <PrivateRoute allowedRoles={['admin', 'receptionist']}>
        <Subscriptions />
      </PrivateRoute>
    )
  },
  { path: "*", element: <NotFound /> },
];

const AppRouter = () => {
  // Vérifier l'état de l'authentification au chargement
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('Current user role:', user.role); // Pour le débogage
    }
  }, [isAuthenticated, user]);

  return (
    <Routes>
      {routes.map((route) => (
        <Route key={route.path} {...route} />
      ))}
    </Routes>
  );
};

export default function Root() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

import { Link } from 'react-router-dom';
import { Button } from './button';
import { useAuthStore } from '../../store/authStore';

export function Navbar() {
  const { isAuthenticated, logout, user } = useAuthStore();
  const isReceptionist = user?.role === 'receptionist';
  const isHomePage = window.location.pathname === '/';

  if (isHomePage && !isAuthenticated) {
    return (
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/">
                <img
                  className="h-8 w-auto"
                  src="/medical-logo.png"
                  alt="Logo"
                />
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="default">
                  Se connecter
                </Button>
              </Link>
              <Button variant="outline">
                Demander une démonstration
              </Button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // N'affiche pas la barre de navigation complète si l'utilisateur n'est pas réceptionniste
  if (!isReceptionist) return null;

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/dashboard">
                <img
                  className="h-8 w-auto"
                  src="/medical-logo.png"
                  alt="Logo"
                />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/dashboard"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Tableau de bord
              </Link>
              <Link
                to="/appointments"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Rendez-vous
              </Link>
              <Link
                to="/patients"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Patients
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <Button
              variant="outline"
              onClick={() => logout()}
              className="ml-4"
            >
              Se déconnecter
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

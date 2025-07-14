import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      navigation: {
        home: 'Accueil',
        dashboard: 'Tableau de bord',
        admin: 'Administration',
        login: 'Se connecter',
        logout: 'Se déconnecter',
      },
      auth: {
        login: {
          title: 'Connexion',
          email: 'Email',
          password: 'Mot de passe',
          submit: 'Se connecter',
          error: 'Email ou mot de passe incorrect',
        },
      },
      common: {
        loading: 'Chargement...',
        error: 'Une erreur est survenue',
        success: 'Opération réussie',
      },
    },
  },
  en: {
    translation: {
      navigation: {
        home: 'Home',
        dashboard: 'Dashboard',
        admin: 'Admin',
        login: 'Login',
        logout: 'Logout',
      },
      auth: {
        login: {
          title: 'Login',
          email: 'Email',
          password: 'Password',
          submit: 'Login',
          error: 'Invalid email or password',
        },
      },
      common: {
        loading: 'Loading...',
        error: 'An error occurred',
        success: 'Operation successful',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

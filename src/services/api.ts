import axios from 'axios';
import { authService } from './authService';

// Création d'une instance axios avec la configuration de base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(async (config) => {
  let token = authService.getToken();

  // Si le token existe et est expiré, essayer de le rafraîchir
  if (token && authService.isTokenExpired(token)) {
    try {
      token = await authService.refreshToken();
    } catch (error) {
      // Si le rafraîchissement échoue, rediriger vers la page de connexion
      authService.clearToken();
      window.location.href = '/login';
      return Promise.reject(error);
    }
  }

  // Ajouter le token aux en-têtes si disponible
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si l'erreur est 401 et que nous n'avons pas déjà essayé de rafraîchir le token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Essayer de rafraîchir le token
        const token = await authService.refreshToken();
        
        // Mettre à jour le token dans la requête originale
        originalRequest.headers.Authorization = `Bearer ${token}`;
        
        // Réessayer la requête originale
        return api(originalRequest);
      } catch (refreshError) {
        // Si le rafraîchissement échoue, effacer les tokens et rediriger
        authService.clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

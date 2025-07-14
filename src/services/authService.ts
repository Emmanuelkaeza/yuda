import api from './api';

const TOKEN_KEY = 'token';

export const authService = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  
  setToken: (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Vérifier si le token est expiré
  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  },

  // Fonction de connexion
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });

      console.log('Réponse complète:', response.data);

      // Vérifier si la réponse est un succès
      if (!response.data.success) {
        throw new Error(response.data.message || 'Échec de la connexion');
      }

      const { access_token, user } = response.data.data;
      
      if (!access_token) {
        console.error('Structure de réponse:', response.data);
        throw new Error('Le token est manquant dans la réponse');
      }

      // Afficher le token dans la console
      console.log('Token JWT reçu:', access_token);
      console.log('Token décodé:', JSON.parse(atob(access_token.split('.')[1])));

      // Sauvegarder le token
      authService.setToken(access_token);

      // Retourner les données structurées
      return {
        user,
        access_token
      };
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  },
};

import { Patient } from "@/types";
import api from "./api";

const BASE_URL = "/patients";

export const patientService = {
  // Récupérer tous les patients
  getAll: async (): Promise<Patient[]> => {
    const response = await api.get(BASE_URL);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Erreur lors de la récupération des patients');
    }
    return Array.isArray(response.data.data.data) ? response.data.data.data : [];
  },

  // Récupérer un patient par son ID
  getById: async (id: string): Promise<Patient> => {
    const response = await api.get(`${BASE_URL}/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Erreur lors de la récupération du patient');
    }
    return response.data.data;
  },

  // Créer un nouveau patient
  create: async (patient: Omit<Patient, "id">): Promise<Patient> => {
    const response = await api.post(BASE_URL, patient);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Erreur lors de la création du patient');
    }
    return response.data.data;
  },

  // Mettre à jour un patient
  update: async (id: string, patient: Partial<Patient>): Promise<Patient> => {
    const response = await api.put(`${BASE_URL}/${id}`, patient);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Erreur lors de la mise à jour du patient');
    }
    return response.data.data;
  },

  // Supprimer un patient
  delete: async (id: string): Promise<void> => {
    const response = await api.delete(`${BASE_URL}/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Erreur lors de la suppression du patient');
    }
  },

  // Rechercher des patients
  search: async (query: string): Promise<Patient[]> => {
    const response = await api.get(`${BASE_URL}/search?q=${query}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Erreur lors de la recherche des patients');
    }
    return Array.isArray(response.data.data) ? response.data.data : [];
  }
};

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { PatientForm } from "@/components/forms/PatientForm";
import { PatientList } from "@/components/PatientList";
import { Patient } from "@/types";
import { patientService } from "@/services/patientService";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setIsLoading(true);
      const data = await patientService.getAll();
      console.log('Données reçues du service:', data);
      if (Array.isArray(data)) {
        setPatients(data);
      } else {
        console.error('Les données reçues ne sont pas un tableau:', data);
        setError('Format de données incorrect');
      }
      console.log('État patients après mise à jour:', data);
    } catch (err) {
      console.error('Erreur lors du chargement des patients:', err);
      setError('Erreur lors du chargement des patients');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPatient = async (newPatient: Omit<Patient, "id" | "createdAt" | "updatedAt">) => {
    try {
      const createdPatient = await patientService.create(newPatient);
      setPatients(prevPatients => [...prevPatients, createdPatient]);
      setIsAddDialogOpen(false);
    } catch (err) {
      console.error('Erreur lors de l\'ajout du patient:', err);
    }

  const handleUpdatePatient = async (updatedPatient: Patient) => {
    try {
      const updatedData = await patientService.update(updatedPatient.id, updatedPatient);
      setPatients(prevPatients => 
        prevPatients.map(p => p.id === updatedPatient.id ? updatedData : p)
      );
    } catch (err) {
      console.error('Erreur lors de la mise à jour du patient:', err);
    }
  };

  const handleDeletePatient = async (patientId: string) => {
    try {
      await patientService.delete(patientId);
      setPatients(prevPatients => prevPatients.filter(p => p.id.toString() !== patientId));
    } catch (err) {
      console.error('Erreur lors de la suppression du patient:', err);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des Patients</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Patient
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <PatientForm
              onSubmit={handleAddPatient}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center text-destructive p-4">{error}</div>
      ) : (
        <PatientList
          patients={patients}
          onPatientUpdate={handleUpdatePatient}
          onPatientDelete={handleDeletePatient}
        />
      )}
    </div>
  );
};

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Pencil, Trash2, User, Search } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PatientForm } from "@/components/forms/PatientForm";
import { SearchPatientModal } from "./SearchPatientModal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Patient } from "@/types";

interface PatientListProps {
  patients: Patient[];
  onPatientUpdate: (patient: Patient) => void;
  onPatientDelete: (patientId: string) => void;
}

export function PatientList({ patients = [], onPatientUpdate, onPatientDelete }: PatientListProps) {
  const navigate = useNavigate();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { toast } = useToast();

  // Vérification de sécurité pour les données
  const validPatients = Array.isArray(patients) ? patients : [];

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (updatedPatient: Omit<Patient, "id" | "createdAt" | "updatedAt">) => {
    if (selectedPatient) {
      onPatientUpdate({
        ...updatedPatient,
        id: selectedPatient.id,
        createdAt: selectedPatient.createdAt,
        updatedAt: new Date().toISOString(),
      } as Patient);
      setIsEditDialogOpen(false);
      setSelectedPatient(null);
    }
  };

  const handleDelete = (patientId: string) => {
    onPatientDelete(patientId);
    toast({
      title: "Patient supprimé",
      description: "Le patient a été supprimé avec succès",
    });
  };

  const handleSearch = (searchTerm: string) => {
    // TODO: Implémenter la logique de recherche ici
    console.log("Recherche :", searchTerm);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Liste des Patients
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-4 w-4" />
            Rechercher
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto">
          {validPatients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Aucun patient</p>
              <p className="text-sm">Commencez par ajouter un nouveau patient.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prénom</TableHead>
                  <TableHead>Date de naissance</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {validPatients.map((patient) => (
                <TableRow 
                  key={patient.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/patients/${patient.id}`)}
                >
                  <TableCell>{patient.lastName}</TableCell>
                  <TableCell>{patient.firstName}</TableCell>
                  <TableCell>
                    {format(new Date(patient.dateOfBirth), "dd/MM/yyyy", { locale: fr })}
                  </TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(patient)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action ne peut pas être annulée. Le patient sera définitivement supprimé
                              de la base de données.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(patient.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl">
            <PatientForm
              patient={selectedPatient || undefined}
              onSubmit={handleUpdate}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        <SearchPatientModal
          open={isSearchOpen}
          onOpenChange={setIsSearchOpen}
          onSearch={handleSearch}
        />
      </CardContent>
    </Card>
  );
}

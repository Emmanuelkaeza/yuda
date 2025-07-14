import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Patient } from "@/types";

interface PatientSearchProps {
  patients: Patient[];
  selectedPatient: Patient | null;
  onSelectPatient: (patient: Patient | null) => void;
  error?: string;
}

export default function PatientSearch({
  patients: initialPatients = [],
  selectedPatient,
  onSelectPatient,
  error
}: PatientSearchProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);

  // Garantir que patients est toujours un tableau
  const patients = useMemo(() => 
    Array.isArray(initialPatients) ? initialPatients : [], 
    [initialPatients]
  );

  // Gestion de la recherche avec des vérifications supplémentaires
  useEffect(() => {
    try {
      const searchTerm = (searchValue || '').toLowerCase().trim();

      // Toujours travailler avec un tableau valide
      const safePatients = Array.isArray(patients) ? patients : [];

      const filtered = searchTerm === ''
        ? safePatients
        : safePatients.filter(patient => {
            if (!patient) return false;
            try {
              const fullName = `${patient.firstName || ''} ${patient.lastName || ''}`.toLowerCase();
              const email = (patient.email || '').toLowerCase();
              const phone = (patient.phone || '').toLowerCase();
              return (
                fullName.includes(searchTerm) ||
                email.includes(searchTerm) ||
                phone.includes(searchTerm)
              );
            } catch (e) {
              console.error("Error filtering patient:", patient, e);
              return false;
            }
          });

      // Assurer que filtered est toujours un tableau
      setFilteredPatients(Array.isArray(filtered) ? filtered : []);
    } catch (error) {
      console.error("Error in filtering:", error);
      setFilteredPatients([]);
    }
  }, [searchValue, patients]);

  // Fonction pour gérer la sélection d'un patient
  const handleSelectPatient = (patient: Patient) => {
    try {
      onSelectPatient(patient);
      setOpen(false);
      setSearchValue('');
    } catch (error) {
      console.error("Error selecting patient:", error);
    }
  };

  // Fonction pour effacer la sélection
  const clearSelection = () => {
    try {
      onSelectPatient(null);
      setOpen(false);
      setSearchValue('');
    } catch (error) {
      console.error("Error clearing selection:", error);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <Label htmlFor="patient">Patient</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
            type="button"
          >
            {selectedPatient
              ? `${selectedPatient.firstName || ''} ${selectedPatient.lastName || ''}`
              : "Rechercher un patient..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <Command>
            <CommandInput
              placeholder="Rechercher un patient..."
              value={searchValue || ""}
              onValueChange={(value) => {
                try {
                  setSearchValue(value || "");
                } catch (e) {
                  console.error("Error setting search value:", e);
                }
              }}
            />
            <CommandEmpty>
              {searchValue ? "Aucun patient correspondant trouvé" : "Aucun patient disponible"}
            </CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-auto">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => {
                  if (!patient || !patient.id) return null;

                  try {
                    return (
                      <CommandItem
                        key={patient.id}
                        value={`${patient.firstName || ''} ${patient.lastName || ''}`}
                        onSelect={() => handleSelectPatient(patient)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedPatient?.id === patient.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col">
                          <span>{patient.firstName || ''} {patient.lastName || ''}</span>
                          {(patient.email || patient.phone) && (
                            <span className="text-sm text-muted-foreground">
                              {patient.email ? `${patient.email} • ` : ''}
                              {patient.phone || ''}
                            </span>
                          )}
                        </div>
                      </CommandItem>
                    );
                  } catch (e) {
                    console.error("Error rendering patient item:", patient, e);
                    return null;
                  }
                })
              ) : (
                <CommandEmpty>
                  {searchValue ? "Aucun patient trouvé" : "Aucun patient disponible"}
                </CommandEmpty>
              )}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Bouton pour effacer la sélection */}
      {selectedPatient && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={clearSelection}
          className="mt-2"
        >
          Effacer la sélection
        </Button>
      )}
    </div>
  );
}

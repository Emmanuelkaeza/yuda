import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, User, Phone, Mail, MapPin, FileText, Heart, Activity, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { patientService } from "@/services/patientService";

import { Patient } from "@/types";
import { ApiError } from "@/types/api";

interface PatientFormProps {
  patient?: Patient;
  onSubmit: (patient: Omit<Patient, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}

export function PatientForm({ patient, onSubmit, onCancel }: PatientFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: patient?.firstName || "",
    lastName: patient?.lastName || "",
    dateOfBirth: patient?.dateOfBirth || undefined,
    gender: patient?.gender || "",
    phone: patient?.phone || "",
    email: patient?.email || "",
    address: patient?.address || "",
    emergencyContact: patient?.emergencyContact || "",
    emergencyPhone: patient?.emergencyPhone || "",
    medicalHistory: patient?.medicalHistory || "",
    allergies: patient?.allergies || ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.dateOfBirth || !formData.gender || !formData.phone) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    // Validation de l'email
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast({
          title: "Erreur",
          description: "Veuillez entrer une adresse email valide",
          variant: "destructive"
        });
        return;
      }
    }

    const patientData = {
      ...formData,
      dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : undefined
    };

    setIsSubmitting(true);
    try {
      let response;
      if (patient) {
        response = await patientService.updatePatient(patient.id, patientData);
      } else {
        response = await patientService.create(patientData);
      }

      onSubmit(response);
      
      toast({
        title: patient ? "Patient modifié" : "Patient ajouté",
        description: `${formData.firstName} ${formData.lastName} a été ${patient ? "modifié" : "ajouté"} avec succès`,
      });
    } catch (err) {
      console.error('Erreur:', err);
      const error = err as Error | ApiError;
      
      const errorMessage = 'response' in error 
        ? error.response?.data?.message 
        : error instanceof Error 
          ? error.message 
          : "Une erreur est survenue lors de l'enregistrement du patient";
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      return; // Arrêter l'exécution en cas d'erreur
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informations personnelles */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Informations Personnelles
          </CardTitle>
          <CardDescription>
            Informations de base du patient
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="lastName">Nom *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              placeholder="Nom de famille"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              placeholder="Prénom"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Date de naissance *</Label>
            <div className="flex gap-2">
              <Input
                type="date"
                value={formData.dateOfBirth ? format(new Date(formData.dateOfBirth), "yyyy-MM-dd") : ""}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : undefined;
                  if (date && date > new Date()) {
                    toast({
                      title: "Date invalide",
                      description: "La date de naissance ne peut pas être dans le futur",
                      variant: "destructive"
                    });
                    return;
                  }
                  if (date && date < new Date("1900-01-01")) {
                    toast({
                      title: "Date invalide",
                      description: "La date de naissance ne peut pas être avant 1900",
                      variant: "destructive"
                    });
                    return;
                  }
                  setFormData({
                    ...formData,
                    dateOfBirth: date?.toISOString()
                  });
                }}
                max={format(new Date(), "yyyy-MM-dd")}
                min="1900-01-01"
                required
                className="w-full"
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined}
                    onSelect={(date) => setFormData({...formData, dateOfBirth: date?.toISOString()})}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                    className="pointer-events-auto"
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="gender">Genre *</Label>
            <Select 
              value={formData.gender} 
              onValueChange={(value) => setFormData({...formData, gender: value})}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Masculin</SelectItem>
                <SelectItem value="female">Féminin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
        </CardContent>
      </Card>

      {/* Contact */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-secondary" />
            Informations de Contact
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="+243 XX XX XX XX XX"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="email@exemple.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              placeholder="Adresse complète"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact d'urgence */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-destructive" />
            Contact d'Urgence
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emergencyContact">Nom du contact</Label>
            <Input
              id="emergencyContact"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
              placeholder="Nom complet"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="emergencyPhone">Téléphone d'urgence</Label>
            <Input
              id="emergencyPhone"
              type="tel"
              value={formData.emergencyPhone}
              onChange={(e) => setFormData({...formData, emergencyPhone: e.target.value})}
              placeholder="+243 XX XX XX XX XX"
            />
          </div>
        </CardContent>
      </Card>

      {/* Informations médicales */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-accent" />
            Informations Médicales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="allergies">Allergies connues</Label>
            <Textarea
              id="allergies"
              value={formData.allergies}
              onChange={(e) => setFormData({...formData, allergies: e.target.value})}
              placeholder="Liste des allergies connues..."
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="medicalHistory">Antécédents médicaux</Label>
            <Textarea
              id="medicalHistory"
              value={formData.medicalHistory}
              onChange={(e) => setFormData({...formData, medicalHistory: e.target.value})}
              placeholder="Historique médical, chirurgies, maladies chroniques..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" variant="medical" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {patient ? "Modifier" : "Ajouter"} le Patient
        </Button>
      </div>
    </form>
  );
}
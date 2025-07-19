import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DollarSign } from "lucide-react";
import { PaymentForm } from "@/components/forms/PaymentForm";
import { paymentService } from "@/services/paymentService";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Heart,
  Activity,
  CreditCard,
  Calendar
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Patient, Payment } from "@/types";
import { patientService } from "@/services/patientService";
import { subscriptionService, Subscription } from "@/services/subscriptionService";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

export default function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const { toast } = useToast();

  const handlePaymentSubmit = async (paymentData: CreatePaymentDTO) => {
    try {
      const response = await paymentService.createPayment(paymentData);
      setShowPaymentDialog(false);
      toast({
        title: "Paiement initié",
        description: "Le paiement a été initié avec succès",
      });
      return response;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'initialisation du paiement",
        variant: "destructive",
      });
      throw error;
    }
  };

  const loadPatientData = useCallback(async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      const [patientData, subscriptionsData] = await Promise.all([
        patientService.getById(id),
        subscriptionService.getPatientSubscriptions(id)
      ]);

      console.log('Subscription data:', subscriptionsData);

      setPatient(patientData);
      // S'assurer que subscriptionsData est un tableau
      setSubscriptions(Array.isArray(subscriptionsData?.data) ? subscriptionsData.data : []);
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError('Erreur lors du chargement des données du patient');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadPatientData();
  }, [id, loadPatientData]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center text-destructive">
          {error || "Patient non trouvé"}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-3xl font-bold">Détails du Patient</h1>
      </div>

      <Tabs defaultValue="info" className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="info">Informations</TabsTrigger>
            <TabsTrigger value="subscriptions">Souscriptions</TabsTrigger>
            <TabsTrigger value="payments">Paiements</TabsTrigger>
          </TabsList>
          <Button 
            onClick={() => setShowPaymentDialog(true)}
            className="flex items-center gap-2"
          >
            <DollarSign className="h-4 w-4" />
            Nouveau paiement
          </Button>
        </div>

        <TabsContent value="info" className="space-y-6">
          {/* Informations personnelles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Informations Personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nom complet</p>
                <p className="text-lg font-medium">{patient.firstName} {patient.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date de naissance</p>
                <p className="text-lg font-medium">
                  {format(new Date(patient.dateOfBirth), "dd MMMM yyyy", { locale: fr })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Genre</p>
                <p className="text-lg font-medium capitalize">{patient.gender}</p>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Coordonnées
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Téléphone</p>
                <p className="text-lg font-medium">{patient.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-lg font-medium">{patient.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Adresse</p>
                <p className="text-lg font-medium">{patient.address}</p>
              </div>
            </CardContent>
          </Card>

          {/* Contact d'urgence */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-destructive" />
                Contact d'Urgence
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nom du contact</p>
                <p className="text-lg font-medium">{patient.emergencyContact}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Téléphone d'urgence</p>
                <p className="text-lg font-medium">{patient.emergencyPhone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Informations médicales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-accent" />
                Informations Médicales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Allergies</p>
                <p className="text-lg font-medium">{patient.allergies || "Aucune allergie connue"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Antécédents médicaux</p>
                <p className="text-lg font-medium">{patient.medicalHistory || "Aucun antécédent"}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-4">
          {subscriptions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-6 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Aucune souscription</p>
                <p className="text-sm">Ce patient n'a pas encore de souscription active.</p>
              </CardContent>
            </Card>
          ) : (
            subscriptions.map((subscription) => (
              <Card key={subscription.id}>
                <CardContent className="flex items-center justify-between p-6">
                  <div className="space-y-1">
                    <p className="text-lg font-medium">{subscription.planDetails?.name || 'Plan non spécifié'}</p>
                    <p className="text-sm text-muted-foreground">
                      Du {format(new Date(subscription.startDate), "dd/MM/yyyy", { locale: fr })} au{' '}
                      {format(new Date(subscription.endDate), "dd/MM/yyyy", { locale: fr })}
                    </p>
                  </div>
                  <Badge variant="default">
                    {subscription.status === 'active' ? 'Actif' : 
                     subscription.status === 'inactive' ? 'Inactif' :
                     subscription.status === 'cancelled' ? 'Annulé' : 'Expiré'}
                  </Badge>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogTitle>Nouveau Paiement pour {patient.firstName} {patient.lastName}</DialogTitle>
          <PaymentForm
            patient={patient}
            onSubmit={handlePaymentSubmit}
            onCancel={() => setShowPaymentDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

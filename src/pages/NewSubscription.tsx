import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, UserPlus, Calendar, CreditCard, Check } from 'lucide-react';
import api from '@/services/api';

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

interface SubscriptionPlan {
  type: 'BASIC' | 'PREMIUM' | 'VIP';
  price: number;
  currency: 'USD' | 'CDF';
  durationInDays: number;
  description: string;
  features: string[];
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    type: 'BASIC',
    price: 50,
    currency: 'USD',
    durationInDays: 30,
    description: 'Plan de base pour les soins essentiels',
    features: [
      'Consultations médicales de base',
      'Accès aux services d\'urgence',
      'Suivi médical mensuel',
      'Support téléphonique'
    ]
  },
  {
    type: 'PREMIUM',
    price: 100,
    currency: 'USD',
    durationInDays: 30,
    description: 'Plan complet pour un suivi médical régulier',
    features: [
      'Toutes les fonctionnalités Basic',
      'Consultations spécialisées',
      'Examens de laboratoire',
      'Téléconsultations',
      'Pharmacie partenaire'
    ]
  },
  {
    type: 'VIP',
    price: 200,
    currency: 'USD',
    durationInDays: 30,
    description: 'Plan haut de gamme avec services VIP',
    features: [
      'Toutes les fonctionnalités Premium',
      'Consultations à domicile',
      'Accès prioritaire',
      'Services VIP',
      'Assurance santé étendue',
      'Médecin personnel dédié'
    ]
  }
];

export default function NewSubscription() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<'BASIC' | 'PREMIUM' | 'VIP' | ''>('');

  const [formData, setFormData] = useState({
    patientId: '',
    type: '' as 'BASIC' | 'PREMIUM' | 'VIP' | '',
    price: 0,
    currency: 'USD' as 'USD' | 'CDF',
    durationInDays: 30,
    description: '',
    features: [] as string[]
  });

  useEffect(() => {
    const fetchPatients = async () => {
      setLoadingPatients(true);
      try {
        const response = await api.get('/patients');
        
        // La structure réelle de réponse est: 
        // { success: true, data: { data: Array, total: number, page: number, totalPages: number }, message: string, timestamp: string }
        let patientsData = [];
        
        if (response.data?.success && response.data?.data && Array.isArray(response.data.data.data)) {
          // Structure: response.data.data.data (les patients sont dans data.data.data)
          patientsData = response.data.data.data;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          // Fallback: si les patients sont directement dans data.data
          patientsData = response.data.data;
        } else if (Array.isArray(response.data)) {
          // Fallback: si les patients sont directement dans data
          patientsData = response.data;
        } else {
          console.warn('Structure de réponse non reconnue:', response.data);
          patientsData = [];
        }
        
        setPatients(patientsData);
      } catch (error) {
        console.error('Erreur lors du chargement des patients:', error);
        setPatients([]); // S'assurer que patients reste un tableau
        toast({
          title: "Erreur",
          description: "Impossible de charger la liste des patients",
          variant: "destructive"
        });
      } finally {
        setLoadingPatients(false);
      }
    };

    fetchPatients();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier que les valeurs ne sont pas les valeurs spéciales
    const isValidPatientId = formData.patientId && 
                            formData.patientId !== 'loading' && 
                            formData.patientId !== 'no-patients';
    
    if (!isValidPatientId || !formData.type) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un patient et un type d'abonnement",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      await api.post('/subscriptions', {
        patientId: parseInt(formData.patientId),
        type: formData.type.toLowerCase(), // conversion en minuscules pour le backend
        price: formData.price,
        currency: formData.currency,
        durationInDays: formData.durationInDays,
        description: formData.description,
        features: formData.features
      });

      toast({
        title: "Abonnement créé",
        description: "L'abonnement a été créé avec succès",
      });

      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la création de l'abonnement",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedPlanData = subscriptionPlans.find(p => p.type === selectedPlan);

  return (
    <div className="min-h-screen bg-muted/20 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au tableau de bord
          </Button>
          
          <div className="flex items-center gap-3">
            <UserPlus className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Nouvel Abonnement</h1>
              <p className="text-muted-foreground">Créer un nouvel abonnement pour un patient</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulaire */}
          <div className="lg:col-span-2">
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Informations de l'abonnement
                </CardTitle>
                <CardDescription>
                  Sélectionnez le patient et configurez l'abonnement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Sélection du patient */}
                  <div className="space-y-2">
                    <Label htmlFor="patient">Patient *</Label>
                    <Select 
                      value={formData.patientId} 
                      onValueChange={(value) => {
                        // Ne pas accepter les valeurs spéciales
                        if (value !== 'loading' && value !== 'no-patients') {
                          setFormData({...formData, patientId: value});
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={loadingPatients ? "Chargement des patients..." : "Sélectionner un patient"} />
                      </SelectTrigger>
                      <SelectContent>
                        {loadingPatients ? (
                          <SelectItem value="loading" disabled>
                            Chargement des patients...
                          </SelectItem>
                        ) : patients && Array.isArray(patients) && patients.length > 0 ? (
                          patients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id.toString()}>
                              {patient.firstName} {patient.lastName} - {patient.email}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-patients" disabled>
                            Aucun patient disponible
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sélection du type d'abonnement */}
                  <div className="space-y-4">
                    <Label>Type d'abonnement *</Label>
                    <div className="grid gap-4">
                      {subscriptionPlans.map((plan) => (
                        <div
                          key={plan.type}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedPlan === plan.type
                              ? 'border-primary bg-primary/5'
                              : 'border-muted hover:border-primary/50'
                          }`}
                          onClick={() => {
                            setSelectedPlan(plan.type);
                            setFormData({
                              ...formData,
                              type: plan.type,
                              price: plan.price,
                              currency: plan.currency,
                              durationInDays: plan.durationInDays,
                              description: plan.description,
                              features: plan.features
                            });
                          }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded-full border-2 ${
                                selectedPlan === plan.type
                                  ? 'border-primary bg-primary'
                                  : 'border-muted'
                              }`}>
                                {selectedPlan === plan.type && (
                                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                  </div>
                                )}
                              </div>
                              <h3 className="text-lg font-semibold">{plan.type}</h3>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary">
                                {plan.price} {plan.currency}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                / {plan.durationInDays} jours
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{plan.description}</p>
                          <div className="grid grid-cols-2 gap-2">
                            {plan.features.slice(0, 4).map((feature, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <Check className="h-3 w-3 text-secondary" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Configuration personnalisée si un plan est sélectionné */}
                  {selectedPlan && (
                    <div className="space-y-4 p-4 bg-muted/20 rounded-lg">
                      <h3 className="font-semibold">Configuration personnalisée</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        {/* Prix */}
                        <div className="space-y-2">
                          <Label htmlFor="price">Prix *</Label>
                          <Input
                            id="price"
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                          />
                        </div>

                        {/* Devise */}
                        <div className="space-y-2">
                          <Label htmlFor="currency">Devise *</Label>
                          <Select 
                            value={formData.currency} 
                            onValueChange={(value: 'USD' | 'CDF') => setFormData({...formData, currency: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD">USD (Dollar américain)</SelectItem>
                              <SelectItem value="CDF">CDF (Franc congolais)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Durée */}
                      <div className="space-y-2">
                        <Label htmlFor="duration">Durée en jours *</Label>
                        <Input
                          id="duration"
                          type="number"
                          min="1"
                          value={formData.durationInDays}
                          onChange={(e) => setFormData({...formData, durationInDays: parseInt(e.target.value) || 1})}
                        />
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Description personnalisée de l'abonnement..."
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          rows={2}
                        />
                      </div>
                    </div>
                  )}

                  {/* Date de début - supprimée car générée automatiquement par le backend */}
                  
                  {/* Notes supprimées car remplacées par description */}

                  <div className="flex gap-4 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/dashboard')}
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      variant="medical"
                      disabled={loading}
                      className="flex-1"
                    >
                      {loading ? "Création..." : "Créer l'abonnement"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Résumé */}
          <div>
            <Card className="medical-card sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Résumé
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedPlanData ? (
                  <>
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <h3 className="font-semibold text-lg mb-2">{selectedPlanData.type}</h3>
                      <div className="text-2xl font-bold text-primary mb-2">
                        {formData.price} {formData.currency}
                      </div>
                      <Badge variant="outline">
                        Durée: {formData.durationInDays} jours
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Fonctionnalités incluses:</h4>
                      <div className="space-y-2">
                        {formData.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-secondary flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {formData.description && (
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="text-sm text-muted-foreground">Description</div>
                        <div className="font-medium text-sm mt-1">{formData.description}</div>
                      </div>
                    )}

                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm text-muted-foreground">Information</div>
                      <div className="font-medium text-sm mt-1">
                        Les dates de début et fin seront calculées automatiquement par le système
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Statut initial: PENDING
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <UserPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Sélectionnez un type d'abonnement pour voir le résumé</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

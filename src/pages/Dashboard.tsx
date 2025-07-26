import { 
  Users, 
  CreditCard, 
  UserPlus, 
  Calendar,
  Bell,
  Plus,
  Activity,
  DollarSign,
  Clock,
  Heart,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Settings,
  LogOut
} from "lucide-react";
import { PatientList } from "@/components/PatientList";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Patient, Payment } from "@/types";
import { patientService } from "@/services/patientService";
import { paymentService } from "@/services/paymentService";
import { subscriptionService } from "@/services";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PatientForm } from "@/components/forms/PatientForm";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import medicalLogo from "@/assets/medical-logo.png";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const paymentStats = [
  { method: "CinetPay Mobile", amount: "145,000 FC", count: 23, percentage: 65 },
  { method: "Carte Bancaire", amount: "89,500 FC", count: 15, percentage: 35 },
  { method: "Espèces", amount: "32,000 FC", count: 8, percentage: 20 }
];

const subscriptions = [
  { id: "S001", patient: "Dr. Alain Kouassi", plan: "Premium", status: "Actif", expires: "2024-12-15" },
  { id: "S002", patient: "Mme. Fatou Traoré", plan: "Standard", status: "Expire bientôt", expires: "2024-07-20" },
  { id: "S003", patient: "M. Ibrahim Diallo", plan: "Basic", status: "Actif", expires: "2024-09-30" }
];

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('fr-FR'));
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);

  // Mettre à jour l'heure avec useEffect au lieu de setTimeout
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('fr-FR'));
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [todayStats, setTodayStats] = useState({
    patientsCount: 0,
    patientsGrowth: 0,
    revenue: 0,
    revenueGrowth: 0,
    subscriptionsCount: 0,
    subscriptionsGrowth: 0
  });
  
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  // Fonction pour charger les paiements récents
  const loadRecentPayments = async () => {
    try {
      setLoadingPayments(true);
      const payments = await paymentService.getAllPayments();
      // Trier par date et prendre les 5 plus récents
      const sortedPayments = payments
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      setRecentPayments(sortedPayments);
    } catch (err) {
      console.error("Erreur lors du chargement des paiements récents:", err);
    } finally {
      setLoadingPayments(false);
    }
  };

  // Charger les données
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await patientService.getAll();
        console.log('Données des patients reçues:', data);
        
        if (!data) {
          throw new Error('Aucune donnée reçue du service');
        }
        
        setPatients(data); // Le service retourne déjà un tableau propre

        // Charger les paiements et les statistiques
        await loadRecentPayments();
        await calculateTodayStats();
      } catch (err) {
        console.error("Erreur détaillée:", err);
        setError(err instanceof Error ? err.message : "Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Recharger les paiements quand nécessaire
  useEffect(() => {
    loadRecentPayments();
  }, []);

  const handleAddPatient = async (patient: Omit<Patient, "id">) => {
    try {
      const newPatient = await patientService.create(patient);
      setPatients(prev => [newPatient, ...prev]);
      setIsAddPatientOpen(false);
    } catch (err) {
      console.error("Erreur lors de l'ajout du patient:", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };



  

  const calculateTodayStats = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // Patients d'aujourd'hui
      const allPatients = await patientService.getAll(); // Le service retourne déjà un tableau propre
      
      const todayPatients = allPatients.filter(p => 
        new Date(p.createdAt).getTime() >= today.getTime()
      );
      const yesterdayPatients = allPatients.filter(p => 
        new Date(p.createdAt).getTime() >= yesterday.getTime() &&
        new Date(p.createdAt).getTime() < today.getTime()
      );
      const patientsGrowth = yesterdayPatients.length > 0 
        ? ((todayPatients.length - yesterdayPatients.length) / yesterdayPatients.length) * 100
        : 0;

      // Revenus du jour
      const allPayments = await paymentService.getAllPayments(); // Le service retourne déjà un tableau propre

      const todayPayments = allPayments.filter(p => 
        new Date(p.createdAt).getTime() >= today.getTime() &&
        p.status === 'completed'
      );
      const yesterdayPayments = allPayments.filter(p => 
        new Date(p.createdAt).getTime() >= yesterday.getTime() &&
        new Date(p.createdAt).getTime() < today.getTime() &&
        p.status === 'completed'
      );
      const todayRevenue = todayPayments.reduce((sum, p) => sum + p.amount, 0);
      const yesterdayRevenue = yesterdayPayments.reduce((sum, p) => sum + p.amount, 0);
      const revenueGrowth = yesterdayRevenue > 0 
        ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100
        : 0;

      // Abonnements actifs aujourd'hui
      const subscriptionsResponse = await subscriptionService.getPatientSubscriptions('7');
      const subscriptions = Array.isArray(subscriptionsResponse) ? subscriptionsResponse : [];
      
      const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
      const previousActiveSubscriptions = subscriptions.filter(s => 
        s.status === 'active' && 
        new Date(s.startDate).getTime() < today.getTime()
      );
      const subscriptionsGrowth = previousActiveSubscriptions.length > 0
        ? ((activeSubscriptions.length - previousActiveSubscriptions.length) / previousActiveSubscriptions.length) * 100
        : 0;

      setTodayStats({
        patientsCount: todayPatients.length,
        patientsGrowth,
        revenue: todayRevenue,
        revenueGrowth,
        subscriptionsCount: activeSubscriptions.length,
        subscriptionsGrowth
      });
    } catch (err) {
      console.error('Erreur lors du calcul des statistiques:', err);
      // Ajouter des logs pour mieux comprendre l'erreur
      if (err instanceof Error) {
        console.error('Message d\'erreur:', err.message);
        console.error('Stack trace:', err.stack);
      }
    }
  };

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <header className="medical-card m-4 rounded-xl bg-white/95 backdrop-blur-md">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <img src={medicalLogo} alt="MedicalCare Pro" className="h-10 w-10 rounded-lg" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Tableau de Bord</h1>
              <p className="text-muted-foreground">Système de gestion hospitalière</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Heure actuelle</div>
              <div className="text-lg font-semibold text-primary">{currentTime}</div>
            </div>
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleLogout}
              title="Se déconnecter"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="px-4 pb-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="medical-card hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patients Aujourd'hui</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{todayStats.patientsCount}</div>
              <p className="text-xs text-muted-foreground">
                <span className={todayStats.patientsGrowth >= 0 ? "text-secondary" : "text-destructive"}>
                  {todayStats.patientsGrowth >= 0 ? "+" : ""}{todayStats.patientsGrowth.toFixed(1)}%
                </span> par rapport à hier
              </p>
              <Progress value={Math.min(todayStats.patientsCount * 2, 100)} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="medical-card hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus du Jour</CardTitle>
              <DollarSign className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                {todayStats.revenue.toLocaleString('fr-FR')} FC
              </div>
              <p className="text-xs text-muted-foreground">
                <span className={todayStats.revenueGrowth >= 0 ? "text-secondary" : "text-destructive"}>
                  {todayStats.revenueGrowth >= 0 ? "+" : ""}{todayStats.revenueGrowth.toFixed(1)}%
                </span> par rapport à hier
              </p>
              <Progress value={Math.min(todayStats.revenue / 1000000 * 100, 100)} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="medical-card hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Abonnements Actifs</CardTitle>
              <UserPlus className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{todayStats.subscriptionsCount}</div>
              <p className="text-xs text-muted-foreground">
                <span className={todayStats.subscriptionsGrowth >= 0 ? "text-secondary" : "text-destructive"}>
                  {todayStats.subscriptionsGrowth >= 0 ? "+" : ""}{todayStats.subscriptionsGrowth.toFixed(1)}%
                </span> par rapport à hier
              </p>
              <Progress value={Math.min(todayStats.subscriptionsCount / 2, 100)} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="medical-card hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux de Satisfaction</CardTitle>
              <Heart className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">96.8%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-secondary">+2.1%</span> ce mois
              </p>
              <Progress value={97} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Liste des Patients */}
            <div className="flex flex-col space-y-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">Patients</h2>
                  <Button variant="medical" onClick={() => setIsAddPatientOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau Patient
                  </Button>
                </div>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="text-center text-destructive p-4">{error}</div>
              ) : (
                <PatientList 
                  patients={patients}
                  onPatientUpdate={async (updatedPatient) => {
                    try {
                      await patientService.update(updatedPatient.id, updatedPatient);
                      setPatients(prevPatients => 
                        prevPatients.map(p => p.id === updatedPatient.id ? updatedPatient : p)
                      );
                    } catch (err) {
                      console.error("Erreur lors de la mise à jour du patient:", err);
                    }
                  }}
                  onPatientDelete={async (patientId) => {
                    try {
                      await patientService.delete(patientId);
                      setPatients(prevPatients => 
                        prevPatients.filter(p => p.id !== patientId)
                      );
                    } catch (err) {
                      console.error("Erreur lors de la suppression du patient:", err);
                    }
                  }}
                />
              )}
            </div>

            {/* Payment Analytics */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-secondary" />
                  Analyse des Paiements
                </CardTitle>
                <CardDescription>
                  Répartition par méthode de paiement aujourd'hui
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {paymentStats.map((payment, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-primary" style={{ backgroundColor: index === 0 ? 'hsl(var(--primary))' : index === 1 ? 'hsl(var(--secondary))' : 'hsl(var(--accent))' }}></div>
                          <span className="font-medium text-foreground">{payment.method}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-foreground">{payment.amount}</div>
                          <div className="text-sm text-muted-foreground">{payment.count} transactions</div>
                        </div>
                      </div>
                      <Progress value={payment.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="text-lg">Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="medical" className="w-full justify-start" onClick={() => setIsAddPatientOpen(true)}>
                  <Users className="h-4 w-4 mr-2" />
                  Nouveau Patient
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/payments')}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Gérer les Paiements
                </Button>
                <Button variant="accent" className="w-full justify-start" onClick={() => navigate('/subscriptions')}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Gérer les Abonnements
                </Button>
                <Button variant="success" className="w-full justify-start" onClick={() => navigate('/subscriptions/new')}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Nouvel Abonnement
                </Button>
              </CardContent>
            </Card>

            {/* Recent Payments */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-accent" />
                  Paiements Récents
                </CardTitle>
                <CardDescription>
                  Les 5 derniers paiements enregistrés
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingPayments ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : recentPayments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">Aucun paiement récent</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentPayments.map((payment) => (
                      <button
                        key={payment.id}
                        onClick={() => navigate(`/payments/${payment.id}`)}
                        className="w-full p-3 rounded-lg bg-muted/30 space-y-2 text-left hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-foreground text-sm">
                            {payment.amount.toLocaleString('fr-FR')} FC
                          </div>
                          
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            {payment.method}
                          </span>
                          <span className="text-muted-foreground">
                            {format(new Date(payment.createdAt), "dd/MM/yyyy HH:mm", { locale: fr })}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  État du Système
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Serveur Principal</span>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                    <span className="text-sm font-medium text-secondary">Opérationnel</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">API CinetPay</span>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                    <span className="text-sm font-medium text-secondary">Connecté</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Base de Données</span>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                    <span className="text-sm font-medium text-secondary">Synchronisé</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Sauvegarde</span>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-accent mr-2" />
                    <span className="text-sm font-medium text-accent">Il y a 2h</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={isAddPatientOpen} onOpenChange={setIsAddPatientOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter un Nouveau Patient</DialogTitle>
            <DialogDescription>
              Enregistrez un nouveau patient dans le système
            </DialogDescription>
          </DialogHeader>
          <PatientForm
            onSubmit={handleAddPatient}
            onCancel={() => setIsAddPatientOpen(false)}
          />
        </DialogContent>
      </Dialog>


    </div>
  );
}
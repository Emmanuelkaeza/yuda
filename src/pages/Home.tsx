import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/ui/navigation";
import { 
  Users, 
  CreditCard, 
  UserPlus, 
  BarChart3, 
  Shield, 
  Clock,
  Heart,
  Activity,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail
} from "lucide-react";
import heroImage from "@/assets/hero-medical.jpg";
import medicalLogo from "@/assets/medical-logo.png";

const features = [
  {
    icon: Users,
    title: "Gestion des Patients",
    description: "Enregistrement et suivi complet des dossiers patients avec historique médical."
  },
  {
    icon: CreditCard,
    title: "Paiements CinetPay",
    description: "Intégration complète avec CinetPay pour mobile money et cartes bancaires."
  },
  {
    icon: UserPlus,
    title: "Gestion d'Abonnements",
    description: "Système d'abonnements médicaux avec suivi des états et renouvellements."
  },
  {
    icon: BarChart3,
    title: "Rapports Avancés",
    description: "Analytics en temps réel et rapports détaillés pour une gestion optimisée."
  },
  {
    icon: Shield,
    title: "Sécurité Médicale",
    description: "Conformité RGPD et protection des données de santé selon les normes."
  },
  {
    icon: Clock,
    title: "Disponibilité 24/7",
    description: "Système disponible en continu pour les urgences et soins critiques."
  }
];

const stats = [
  { label: "Patients traités", value: "15,000+", icon: Users },
  { label: "Transactions sécurisées", value: "50,000+", icon: CreditCard },
  { label: "Abonnements actifs", value: "3,200+", icon: UserPlus },
  { label: "Uptime système", value: "99.9%", icon: Activity }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 hero-gradient opacity-90"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white animate-fade-in-up">
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Révolutionnez la
                <span className="block bg-gradient-to-r from-white to-secondary-light bg-clip-text text-transparent">
                  Gestion Hospitalière
                </span>
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Plateforme complète pour réceptionnistes d'hôpitaux avec gestion des patients, 
                paiements CinetPay, et système d'abonnements médicaux intégré.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="text-lg px-8"
                  onClick={() => window.location.href = "/login"}
                >
                  Commencer maintenant
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 border-white/30 text-white hover:bg-white/10"
                >
                  <Activity className="mr-2 h-5 w-5" />
                  Voir la démo
                </Button>
              </div>
            </div>
            
            <div className="animate-slide-in-right">
              <div className="medical-card p-8 bg-white/10 backdrop-blur-md border-white/20">
                <div className="flex items-center mb-6">
                  <img src={medicalLogo} alt="MedicalCare Pro" className="h-12 w-12 rounded-lg mr-4" />
                  <div>
                    <h3 className="text-xl font-bold text-white">MedicalCare Pro</h3>
                    <p className="text-white/80">Version 2.0 - Nouvelle génération</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    "Interface intuitive et moderne",
                    "Intégration CinetPay complète", 
                    "Rapports analytics avancés",
                    "Sécurité de niveau hospitalier"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center text-white/90">
                      <CheckCircle className="h-5 w-5 text-secondary mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center hover-lift animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full medical-gradient mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Fonctionnalités Avancées
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Une suite complète d'outils conçus spécifiquement pour optimiser 
              la gestion hospitalière et améliorer l'expérience patient.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="medical-card hover-lift animate-scale-in border-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full medical-gradient mb-4 mx-auto">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="medical-card p-12 card-gradient">
            <Heart className="h-16 w-16 text-primary mx-auto mb-6 animate-pulse-glow" />
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Prêt à Moderniser Votre Hôpital ?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Rejoignez les centaines d'établissements qui font confiance à MedicalCare Pro 
              pour transformer leur gestion hospitalière.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="medical" 
                size="lg" 
                className="text-lg px-8"
                onClick={() => window.location.href = "/login"}
              >
                Démarrer l'essai gratuit
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8">
                <Phone className="mr-2 h-5 w-5" />
                Contacter l'équipe
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-foreground text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img src={medicalLogo} alt="MedicalCare Pro" className="h-8 w-8 rounded mr-3" />
                <span className="text-xl font-bold">MedicalCare Pro</span>
              </div>
              <p className="text-white/80 mb-4">
                Solution complète de gestion hospitalière pour optimiser les soins 
                et améliorer l'efficacité administrative.
              </p>
              <div className="flex space-x-4">
                <Mail className="h-5 w-5 text-secondary" />
                <span className="text-white/80">contact@medicalcare.pro</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Fonctionnalités</h4>
              <ul className="space-y-2 text-white/80">
                <li>Gestion des patients</li>
                <li>Paiements CinetPay</li>
                <li>Système d'abonnements</li>
                <li>Rapports analytics</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-white/80">
                <li>Documentation</li>
                <li>Formation</li>
                <li>Support technique 24/7</li>
                <li>Mises à jour</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
            <p>© 2024 MedicalCare Pro. Tous droits réservés. Solution de gestion hospitalière moderne.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
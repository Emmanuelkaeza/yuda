import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/authService";
import { toast } from "@/components/ui/use-toast";
import { Heart, Activity, Shield, Mail, Lock, Eye, EyeOff } from "lucide-react";
import medicalLogo from "@/assets/medical-logo.png";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AxiosError } from "axios";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await authService.login(email, password);
      
      // Utiliser les données retournées par le login
      login(data);
      
      if (rememberMe) {
        localStorage.setItem("remember-email", email);
      } else {
        localStorage.removeItem("remember-email");
      }

      toast({
        title: "Connexion réussie",
        description: `Bienvenue ${data.user.firstName} ${data.user.lastName}`,
      });

      // Redirection vers le tableau de bord
      navigate('/dashboard');
      
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: axiosError.response?.data?.message || "Une erreur est survenue lors de la connexion",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Charger l'email sauvegardé si "Se souvenir de moi" était coché
  useEffect(() => {
    const savedEmail = localStorage.getItem("remember-email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with medical pattern */}
      <div className="absolute inset-0 hero-gradient"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent)] opacity-60"></div>
      
      {/* Floating medical icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 animate-pulse-glow">
          <Heart className="h-8 w-8 text-secondary/20" />
        </div>
        <div className="absolute top-40 right-32 animate-pulse-glow" style={{ animationDelay: '1s' }}>
          <Activity className="h-6 w-6 text-primary/20" />
        </div>
        <div className="absolute bottom-32 left-40 animate-pulse-glow" style={{ animationDelay: '2s' }}>
          <Shield className="h-10 w-10 text-secondary/20" />
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md animate-scale-in">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="medical-card p-4 rounded-full glow-effect">
                <img 
                  src={medicalLogo} 
                  alt="MedicalCare Pro" 
                  className="h-12 w-12"
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              MedicalCare Pro
            </h1>
            <p className="text-white/80 text-lg">
              Système de Gestion Hospitalière
            </p>
          </div>

          {/* Login Card */}
          <Card className="medical-card backdrop-blur-md bg-white/95 border-white/20 shadow-2xl">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold text-foreground">
                Connexion
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Accédez à votre espace de travail médical
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Adresse email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="receptionniste@hopital.com"
                      className="pl-10 medical-input"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 pr-10 medical-input"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? 
                        <EyeOff className="h-4 w-4 text-muted-foreground" /> : 
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      }
                    </Button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember" 
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <Label 
                      htmlFor="remember" 
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      Se souvenir de moi
                    </Label>
                  </div>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>

                {/* Login Button */}
                <Button 
                  type="submit" 
                  variant="medical" 
                  className="w-full h-12 text-base font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin mr-2">
                        <Activity className="h-4 w-4" />
                      </div>
                      Connexion en cours...
                    </>
                  ) : (
                    <>
                      Se connecter
                      <Shield className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
               
              </form>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-6 text-white/60 text-sm">
            <p>© 2024 MedicalCare Pro. Solution de gestion hospitalière moderne.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
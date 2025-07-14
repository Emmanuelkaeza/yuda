import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Users, 
  CreditCard, 
  UserPlus, 
  Settings, 
  Menu, 
  X,
  Activity,
  Calendar,
  FileText
} from "lucide-react";
import medicalLogo from "@/assets/medical-logo.png";

const navigationItems = [
  { name: "Accueil", href: "/", icon: Home },
  { name: "Patients", href: "/patients", icon: Users },
  { name: "Paiements", href: "/payments", icon: CreditCard },
  { name: "Abonnements", href: "/subscriptions", icon: UserPlus },
  { name: "Administration", href: "/admin", icon: Settings },
  { name: "Rapports", href: "/reports", icon: FileText },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="medical-card sticky top-4 z-50 mx-4 rounded-xl backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover-lift">
            <img 
              src={medicalLogo} 
              alt="MedicalCare" 
              className="h-8 w-8 rounded-lg"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              MedicalCare Pro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                    isActive
                      ? "bg-primary text-white shadow-[var(--shadow-medical)]"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Activity className="h-4 w-4 mr-2" />
              Statut
            </Button>
            <Button variant="medical" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Planning
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in-up">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300",
                      isActive
                        ? "bg-primary text-white shadow-[var(--shadow-medical)]"
                        : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              <div className="pt-4 space-y-2 border-t border-border/50">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Activity className="h-4 w-4 mr-2" />
                  Statut
                </Button>
                <Button variant="medical" size="sm" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Planning
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
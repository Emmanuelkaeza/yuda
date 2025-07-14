import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  UserCheck, 
  UserX, 
  Shield, 
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Settings,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  MoreHorizontal
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const systemUsers = [
  { id: "U001", name: "Dr. Sarah Johnson", email: "sarah.johnson@medicalcare.com", role: "Administrateur", status: "Actif", lastLogin: "Il y a 2h", department: "Direction" },
  { id: "U002", name: "Marie Dubois", email: "marie.dubois@medicalcare.com", role: "Réceptionniste", status: "Actif", lastLogin: "Il y a 30min", department: "Accueil" },
  { id: "U003", name: "Jean Martin", email: "jean.martin@medicalcare.com", role: "Médecin", status: "Actif", lastLogin: "Il y a 1h", department: "Cardiologie" },
  { id: "U004", name: "Pierre Lefebvre", email: "pierre.lefebvre@medicalcare.com", role: "Comptable", status: "Inactif", lastLogin: "Il y a 2 jours", department: "Finance" },
  { id: "U005", name: "Fatou Traoré", email: "fatou.traore@medicalcare.com", role: "Infirmière", status: "Actif", lastLogin: "Il y a 45min", department: "Urgences" }
];

const userRoles = ["Administrateur", "Médecin", "Infirmière", "Réceptionniste", "Comptable", "Technicien"];
const departments = ["Direction", "Cardiologie", "Urgences", "Pédiatrie", "Chirurgie", "Radiologie", "Finance", "Accueil"];

export default function Admin() {
  const [users, setUsers] = useState(systemUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const { toast } = useToast();

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    password: "",
    confirmPassword: ""
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = () => {
    if (newUser.password !== newUser.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      });
      return;
    }

    const user = {
      id: `U${(users.length + 1).toString().padStart(3, '0')}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: "Actif",
      lastLogin: "Jamais connecté",
      department: newUser.department
    };

    setUsers([...users, user]);
    setNewUser({ name: "", email: "", role: "", department: "", password: "", confirmPassword: "" });
    setIsAddUserOpen(false);
    
    toast({
      title: "Utilisateur ajouté",
      description: `${user.name} a été ajouté avec succès`,
    });
  };

  const handleEditUser = () => {
    const updatedUsers = users.map(user => 
      user.id === selectedUser.id ? selectedUser : user
    );
    setUsers(updatedUsers);
    setIsEditUserOpen(false);
    setSelectedUser(null);
    
    toast({
      title: "Utilisateur modifié",
      description: "Les informations ont été mises à jour",
    });
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast({
      title: "Utilisateur supprimé",
      description: "L'utilisateur a été supprimé du système",
    });
  };

  const toggleUserStatus = (userId: string) => {
    const updatedUsers = users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === "Actif" ? "Inactif" : "Actif" }
        : user
    );
    setUsers(updatedUsers);
    
    toast({
      title: "Statut mis à jour",
      description: "Le statut de l'utilisateur a été modifié",
    });
  };

  return (
    <div className="min-h-screen bg-muted/20 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Administration Système</h1>
            <p className="text-muted-foreground">Gestion des utilisateurs et permissions</p>
          </div>
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button variant="medical" size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Nouvel Utilisateur
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Ajouter un Nouvel Utilisateur</DialogTitle>
                <DialogDescription>
                  Créez un nouveau compte utilisateur pour le système
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    placeholder="Nom et prénom"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    placeholder="email@medicalcare.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rôle</Label>
                  <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      {userRoles.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Département</Label>
                  <Select value={newUser.department} onValueChange={(value) => setNewUser({...newUser, department: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un département" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    placeholder="Mot de passe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={newUser.confirmPassword}
                    onChange={(e) => setNewUser({...newUser, confirmPassword: e.target.value})}
                    placeholder="Confirmer le mot de passe"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                  Annuler
                </Button>
                <Button variant="medical" onClick={handleAddUser}>
                  Créer l'utilisateur
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="medical-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              {users.filter(u => u.status === "Actif").length} actifs
            </p>
          </CardContent>
        </Card>

        <Card className="medical-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connectés Maintenant</CardTitle>
            <UserCheck className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">3</div>
            <p className="text-xs text-muted-foreground">Sessions actives</p>
          </CardContent>
        </Card>

        <Card className="medical-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrateurs</CardTitle>
            <Shield className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {users.filter(u => u.role === "Administrateur").length}
            </div>
            <p className="text-xs text-muted-foreground">Privilèges élevés</p>
          </CardContent>
        </Card>

        <Card className="medical-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Inactifs</CardTitle>
            <UserX className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {users.filter(u => u.status === "Inactif").length}
            </div>
            <p className="text-xs text-muted-foreground">Comptes désactivés</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Management */}
      <Card className="medical-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Gestion des Utilisateurs
              </CardTitle>
              <CardDescription>
                Gérez les comptes utilisateurs et leurs permissions
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  {userRoles.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <div className="font-medium text-foreground">{user.name}</div>
                      <Badge 
                        variant={user.status === "Actif" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {user.status}
                      </Badge>
                      {user.role === "Administrateur" && (
                        <Badge variant="outline" className="text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                    <div className="text-xs text-muted-foreground">
                      {user.role} • {user.department} • {user.lastLogin}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleUserStatus(user.id)}
                  >
                    {user.status === "Actif" ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                  </Button>
                  <Dialog open={isEditUserOpen && selectedUser?.id === user.id} onOpenChange={(open) => {
                    setIsEditUserOpen(open);
                    if (!open) setSelectedUser(null);
                  }}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedUser({...user})}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Modifier l'Utilisateur</DialogTitle>
                        <DialogDescription>
                          Modifiez les informations de {selectedUser?.name}
                        </DialogDescription>
                      </DialogHeader>
                      {selectedUser && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="editName">Nom complet</Label>
                            <Input
                              id="editName"
                              value={selectedUser.name}
                              onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="editEmail">Email</Label>
                            <Input
                              id="editEmail"
                              type="email"
                              value={selectedUser.email}
                              onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="editRole">Rôle</Label>
                            <Select value={selectedUser.role} onValueChange={(value) => setSelectedUser({...selectedUser, role: value})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {userRoles.map(role => (
                                  <SelectItem key={role} value={role}>{role}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="editDepartment">Département</Label>
                            <Select value={selectedUser.department} onValueChange={(value) => setSelectedUser({...selectedUser, department: value})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {departments.map(dept => (
                                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                      <div className="flex justify-end space-x-2 mt-6">
                        <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
                          Annuler
                        </Button>
                        <Button variant="medical" onClick={handleEditUser}>
                          Sauvegarder
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
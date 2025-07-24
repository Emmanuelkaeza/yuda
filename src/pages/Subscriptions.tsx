import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Search, RefreshCw, Loader2, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { subscriptionService } from "@/services";

import { Subscription } from '@/types';

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchSubscriptions = async (searchTerm = "") => {
    setLoading(true);
    try {
      // Recherche côté API
      const params = searchTerm ? { q: searchTerm } : {};
      const data = await subscriptionService.getAllSubscriptions(params);
      setSubscriptions(Array.isArray(data) ? data : []);
    } catch (err) {
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchSubscriptions(search);
  };



  return (
    <div className="min-h-screen bg-muted/20 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des Abonnements</h1>
            <p className="text-muted-foreground">Recherchez, filtrez et gérez tous les abonnements patients</p>
          </div>
          <Button variant="success" onClick={() => navigate("/subscriptions/new")}> 
            <UserPlus className="h-4 w-4 mr-2" />
            Nouvel Abonnement
          </Button>
        </div>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Recherche d'abonnements
            </CardTitle>
            <CardDescription>
              Filtrez par nom, email, type ou statut
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-4 items-center">
              <Input
                placeholder="Rechercher un patient, un type ou un statut..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="max-w-md"
              />
              <Button type="submit" variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Rechercher
              </Button>
              <Button type="button" variant="ghost" onClick={() => { setSearch(""); setRefreshing(true); fetchSubscriptions().then(() => setRefreshing(false)); }}>
                {refreshing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                Actualiser
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Liste des abonnements</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : subscriptions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Aucun abonnement trouvé.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="p-2 text-left">Patient</th>
                      <th className="p-2 text-left">Type</th>
                      <th className="p-2 text-left">Prix</th>
                      <th className="p-2 text-left">Statut</th>
                      <th className="p-2 text-left">Début</th>
                      <th className="p-2 text-left">Fin</th>
                      <th className="p-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map(sub => (
                      <tr key={sub.id} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-2 font-medium">{sub.planDetails?.name || '-'}<br /><span className="text-xs text-muted-foreground">{sub.patientId}</span></td>
                        <td className="p-2">{sub.planDetails?.name || '-'}</td>
                        <td className="p-2">{sub.planDetails?.price} Fc</td>
                        <td className="p-2">
                          <Badge variant={sub.status === 'active' ? 'success' : sub.status === 'pending' ? 'secondary' : 'destructive'}>
                            {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="p-2">{sub.startDate ? new Date(sub.startDate).toLocaleDateString('fr-FR') : '-'}</td>
                        <td className="p-2">{sub.endDate ? new Date(sub.endDate).toLocaleDateString('fr-FR') : '-'}</td>
                        <td className="p-2 flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => navigate(`/subscriptions/${sub.id}`)}>
                            Détails
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => navigate(`/subscriptions/${sub.id}/edit`)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={async () => {
                            if(window.confirm('Confirmer la suppression de cet abonnement ?')){
                              await subscriptionService.cancelSubscription(sub.id);
                              fetchSubscriptions(search);
                            }
                          }}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

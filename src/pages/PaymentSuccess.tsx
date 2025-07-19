import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

const PaymentSuccess = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center text-center space-y-6">
          <CheckCircle className="w-16 h-16 text-green-500" />
          <h1 className="text-2xl font-bold text-gray-900">
            Paiement réussi !
          </h1>
          <p className="text-gray-600">
            Votre paiement a été traité avec succès. Merci pour votre confiance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate("/dashboard")}
            >
              Retour au tableau de bord
            </Button>
            <Button
              className="flex-1"
              onClick={() => navigate("/patients")}
            >
              Voir tous les patients
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default PaymentSuccess

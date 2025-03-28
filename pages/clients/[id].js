// pages/clients/[id].js
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"

export default function FicheClient() {
  const router = useRouter()
  const { id } = router.query
  const [client, setClient] = useState(null)

  useEffect(() => {
    if (!id) return
    const fetchClient = async () => {
      const { data, error } = await supabase.from("clients").select("*").eq("id", id).single()
      if (error) console.error("Erreur de récupération du client :", error)
      else setClient(data)
    }
    fetchClient()
  }, [id])

  if (!client) {
    return <p className="text-gray-600 p-6">Chargement du client...</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-orange-600">👤 {client.nom}</h1>
        <Link href="/clients" className="text-sm text-orange-600 hover:underline">
          ⬅️ Retour à la liste
        </Link>
      </div>

      <div className="bg-white shadow rounded-xl p-6 border border-gray-100">
        <p><strong>Email :</strong> {client.email}</p>
        <p><strong>Téléphone :</strong> {client.telephone}</p>
        <p><strong>Ville recherchée :</strong> {client.ville_recherche}</p>
        <p><strong>Budget :</strong> {client.budget_min?.toLocaleString()} € – {client.budget_max?.toLocaleString()} €</p>
        <p><strong>Type de bien :</strong> {client.type_bien}</p>
      </div>
    </div>
  )
}

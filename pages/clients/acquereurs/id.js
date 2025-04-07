import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"

export default function FicheAcquereur() {
  const router = useRouter()
  const { id } = router.query
  const [client, setClient] = useState(null)
  const [visites, setVisites] = useState([])

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      const { data: clientData } = await supabase.from("clients").select("*").eq("id", id).single()
      setClient(clientData)

      const { data: visitesData } = await supabase
        .from("visites")
        .select("date_visite, biens(titre)")
        .eq("client_id", id)

      setVisites(visitesData || [])
    }

    fetchData()
  }, [id])

  if (!client) return <p className="p-10 text-center">Chargement...</p>

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-orange-600">👤 Fiche Acquéreur</h1>

      <div className="bg-white p-4 rounded-xl shadow space-y-2">
        <p><strong>Nom :</strong> {client.nom}</p>
        <p><strong>Email :</strong> {client.email}</p>
        <p><strong>Téléphone :</strong> {client.telephone}</p>
        <p><strong>Ville recherchée :</strong> {client.ville_recherche}</p>
        <p><strong>Budget :</strong> {client.budget_min}€ - {client.budget_max}€</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow space-y-3">
        <h2 className="text-lg font-semibold text-orange-700">📍 Visites effectuées</h2>
        {visites.length === 0 ? (
          <p className="text-sm text-gray-500">Aucune visite enregistrée.</p>
        ) : (
          <ul className="list-disc pl-5 space-y-1">
            {visites.map((v, i) => (
              <li key={i}>
                {v.biens?.titre || "Bien inconnu"} — {new Date(v.date_visite).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link href="/clients" className="text-sm text-orange-600 hover:underline block">⬅️ Retour à la liste des clients</Link>
    </div>
  )
}

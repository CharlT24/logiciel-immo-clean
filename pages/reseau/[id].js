// pages/reseau/[id].js
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"

export default function FicheAgent() {
  const router = useRouter()
  const { id } = router.query

  const [agent, setAgent] = useState(null)
  const [clients, setClients] = useState([])
  const [biens, setBiens] = useState([])

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      const { data: agentData } = await supabase
        .from("utilisateurs")
        .select("*")
        .eq("id", id)
        .single()

      setAgent(agentData)

      const { data: clientsData } = await supabase
        .from("clients")
        .select("*")
        .eq("agent_id", id)

      setClients(clientsData || [])

      const { data: biensData } = await supabase
        .from("biens")
        .select("*")
        .eq("agent_id", id)

      setBiens(biensData || [])
    }

    fetchData()
  }, [id])

  if (!agent) {
    return <div className="text-gray-500 text-sm">⏳ Chargement de l’agent...</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b pb-2">
        <h1 className="text-2xl font-bold text-orange-700">
          👤 {agent.nom || agent.email}
        </h1>
        <Link href="/reseau" className="text-sm text-orange-600 hover:underline">
          ⬅️ Retour au réseau
        </Link>
      </div>

      {/* Section Clients */}
      <section className="bg-white p-6 rounded-xl shadow border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">👥 Clients ({clients.length})</h2>
        {clients.length === 0 ? (
          <p className="text-gray-500 text-sm">Aucun client enregistré pour cet agent.</p>
        ) : (
          <div className="grid gap-3">
            {clients.map((client) => (
              <div
                key={client.id}
                className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm text-gray-700"
              >
                🔹 <strong>{client.nom}</strong> à {client.ville_recherche} — {client.budget_min}€ → {client.budget_max}€
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section Biens */}
      <section className="bg-white p-6 rounded-xl shadow border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">🏡 Biens ({biens.length})</h2>
        {biens.length === 0 ? (
          <p className="text-gray-500 text-sm">Aucun bien publié par cet agent.</p>
        ) : (
          <div className="grid gap-3">
            {biens.map((bien) => (
              <div
                key={bien.id}
                className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm text-gray-700"
              >
                📍 <strong>{bien.titre}</strong> à {bien.ville} — {bien.prix.toLocaleString()} € ({bien.surface_m2} m²)
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

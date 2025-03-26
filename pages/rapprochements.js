import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function Rapprochements() {
  const [clients, setClients] = useState([])

  useEffect(() => {
    const fetchClients = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("agent_id", session.user.id)

      if (!error) setClients(data)
    }

    fetchClients()
  }, [])

  const rechercheBing = async (client) => {
    const response = await fetch("/api/bing-search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(client)
    })
    const result = await response.json()
    alert("🔍 Résultats Bing à afficher dans la console")
    console.log("Bing Results :", result)
  }

  const rechercheInternes = async (client) => {
    const { data: biens } = await supabase
      .from("biens")
      .select("*")
      .eq("disponible", true)
      .eq("ville", client.ville_recherche)

    const matches = biens.filter(b =>
      b.prix >= client.budget_min &&
      b.prix <= client.budget_max &&
      b.type_bien?.toLowerCase() === client.type_bien?.toLowerCase()
    )

    console.log("🧠 Matching internes :", matches)
    alert(`${matches.length} bien(s) correspondant(s) trouvé(s). Voir console.`)
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">🔍 Rapprochement client ↔ biens</h1>
      {clients.map((client) => (
        <div key={client.id} className="bg-white rounded shadow p-4 mb-4">
          <p className="font-semibold">{client.nom}</p>
          <p className="text-sm text-gray-600">{client.ville_recherche} | {client.budget_min}€ - {client.budget_max}€ | {client.type_bien}</p>

          <div className="mt-2 flex gap-2">
            <button
              onClick={() => rechercheInternes(client)}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
              🏡 Biens internes
            </button>
            <button
              onClick={() => rechercheBing(client)}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm"
            >
              🌐 Recherche Bing
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

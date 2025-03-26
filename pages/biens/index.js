import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function Biens() {
  const [biens, setBiens] = useState([])
  const [agentId, setAgentId] = useState(null)

  useEffect(() => {
    const fetchBiens = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      setAgentId(session.user.id)

      const { data } = await supabase
        .from("biens")
        .select("*")
        .eq("agent_id", session.user.id)

      setBiens(data || [])
    }

    fetchBiens()
  }, [])

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📦 Liste de mes biens</h1>

      <div className="flex justify-end mb-4">
        <a href="/biens/ajouter" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          ➕ Ajouter un bien
        </a>
      </div>

      {biens.length === 0 ? (
        <p>Aucun bien trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {biens.map((bien) => (
            <div key={bien.id} className="bg-white shadow rounded p-4">
              <h2 className="text-xl font-semibold">{bien.titre}</h2>
              <p>📍 {bien.ville}</p>
              <p>📏 {bien.surface_m2} m²</p>
              <p>💰 {bien.prix?.toLocaleString()} €</p>

              <div className="flex gap-4 mt-2">
                <a href={`/biens/${bien.id}`} className="text-blue-600 underline">🧾 Voir</a>
                <a href={`/biens/${bien.id}/modifier`} className="text-green-600 underline">✏️ Modifier</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

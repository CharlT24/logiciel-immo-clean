// pages/biens/index.js
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"

export default function Biens() {
  const [biens, setBiens] = useState([])
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const fetchBiens = async () => {
      const session = await supabase.auth.getSession()
      const agentId = session.data?.session?.user?.id
      setUserId(agentId)

      const { data, error } = await supabase.from("biens").select("*")
      if (!error) setBiens(data)
    }

    fetchBiens()
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">🏡 Tous les biens</h2>
        <Link href="/biens/ajouter" className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
          ➕ Ajouter un bien
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {biens.length === 0 ? (
          <p>Aucun bien disponible.</p>
        ) : (
          biens.map((bien) => (
            <div key={bien.id} className="bg-white shadow rounded-xl p-4 space-y-2 border">
              <h3 className="text-lg font-semibold">{bien.titre}</h3>
              <p className="text-sm text-gray-500">📍 {bien.ville}</p>
              <p className="text-sm">📐 {bien.surface_m2} m² – 💰 {bien.prix.toLocaleString()} €</p>
              <p className="text-xs text-gray-400">🔋 DPE : {bien.dpe}</p>
              <Link href={`/biens/${bien.id}`} className="text-sm text-orange-600 underline">Voir la fiche</Link>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

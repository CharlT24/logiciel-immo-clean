import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"
import { useRouter } from "next/router"
import { TrashIcon } from "@heroicons/react/24/outline"

export default function Biens() {
  const [biens, setBiens] = useState([])
  const [userId, setUserId] = useState(null)
  const router = useRouter()

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

  const supprimerBien = async (id) => {
    const confirm = window.confirm("Supprimer ce bien ? Cette action est irréversible.")
    if (!confirm) return

    const { error } = await supabase.from("biens").delete().eq("id", id)
    if (!error) {
      setBiens(biens.filter((b) => b.id !== id))
    } else {
      alert("Erreur lors de la suppression.")
      console.error(error)
    }
  }

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
          <p className="text-gray-500">Aucun bien disponible.</p>
        ) : (
          biens.map((bien) => (
            <div key={bien.id} className="bg-white shadow rounded-xl p-4 border relative">
              <h3 className="text-lg font-bold text-orange-700">{bien.titre}</h3>
              <p className="text-sm text-gray-500 mb-1">📍 {bien.ville}</p>
              <p className="text-sm">📐 {bien.surface_m2} m² — 💰 {bien.prix?.toLocaleString()} €</p>
              <p className="text-xs text-gray-400 mb-2">🔋 DPE : {bien.dpe}</p>

              <div className="flex justify-between items-center">
                <Link href={`/biens/${bien.id}`} className="text-sm text-orange-600 underline">
                  🔎 Voir la fiche
                </Link>

                <button
                  onClick={() => supprimerBien(bien.id)}
                  title="Supprimer"
                  className="text-red-500 hover:text-red-700"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

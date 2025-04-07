import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"

export default function ListeProprietaires() {
  const [proprietaires, setProprietaires] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProprietaires = async () => {
      const { data, error } = await supabase
        .from("proprietaires") // ✅ BONNE TABLE
        .select("*")

      if (error) {
        console.error("Erreur Supabase:", error)
      } else {
        console.log("Données récupérées:", data)
        setProprietaires(data)
      }

      setLoading(false)
    }

    fetchProprietaires()
  }, [])

  if (loading) return <p className="p-10 text-center">Chargement...</p>

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-3xl font-bold text-orange-600">📋 Liste des propriétaires</h1>

      {proprietaires.length === 0 ? (
        <p className="text-gray-500 mt-10">Aucun propriétaire trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {proprietaires.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-xl shadow space-y-2">
              <h2 className="text-lg font-semibold text-gray-800">{p.nom}</h2>
              <p className="text-sm text-gray-500">{p.email}</p>
              <p className="text-sm text-gray-500">{p.telephone}</p>
              <Link href={`/clients/proprietaires/${p.id}`} className="text-orange-600 hover:underline text-sm">Voir la fiche</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

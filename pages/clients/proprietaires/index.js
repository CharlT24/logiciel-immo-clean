import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/router"

export default function ListeProprietaires() {
  const [proprietaires, setProprietaires] = useState([])
  const [biens, setBiens] = useState([])

  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      // 1. Propriétaires
      const { data: proprietairesData, error: propErr } = await supabase
        .from("proprietaires")
        .select("*")

      if (propErr) return console.error("Erreur propriétaires:", propErr)
      setProprietaires(proprietairesData)

      // 2. Tous les biens (pour faire le lien)
      const { data: biensData, error: biensErr } = await supabase
        .from("biens")
        .select("id, titre, ville, code_postal")

      if (biensErr) return console.error("Erreur biens:", biensErr)
      setBiens(biensData)
    }

    fetchData()
  }, [])

  const getBienInfo = (bienId) => {
    return biens.find((b) => b.id === bienId)
  }

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold text-orange-600">🏠 Propriétaires</h1>

      {proprietaires.length === 0 ? (
        <p className="text-gray-500 mt-6">Aucun propriétaire enregistré pour le moment.</p>
      ) : (
        <div className="grid gap-6">
          {proprietaires.map((prop) => {
            const bien = getBienInfo(prop.bien_id)

            return (
              <div key={prop.id} className="bg-white rounded-xl shadow p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold">{prop.nom} {prop.prenom}</h2>
                    <p className="text-sm text-gray-600">📞 {prop.telephone || "Non renseigné"}</p>
                    <p className="text-sm text-gray-600">📧 {prop.email || "Non renseigné"}</p>
                    <p className="text-sm text-gray-600">🪪 {prop.civilite} — {prop.mandat ? `Mandat : ${prop.mandat}` : "Mandat non renseigné"}</p>
                    {prop.adresse && <p className="text-sm text-gray-600">🏠 {prop.adresse}</p>}
                  </div>
                  {bien && (
                    <div className="text-right">
                      <p className="text-xs text-gray-400 mb-1">Bien associé :</p>
                      <button
                        onClick={() => router.push(`/biens/${bien.id}`)}
                        className="text-orange-600 hover:underline text-sm"
                      >
                        {bien.titre} ({bien.ville})
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

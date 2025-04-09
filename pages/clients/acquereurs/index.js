// pages/rapprochement/index.js
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"

export default function Rapprochements() {
  const [clients, setClients] = useState([])
  const [biens, setBiens] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { data: clientsData, error: clientErr } = await supabase
        .from("clients")
        .select("*")

      const { data: biensData, error: bienErr } = await supabase
        .from("biens")
        .select("*")
        .eq("disponibilite", true)

      if (clientErr) console.error("Erreur chargement clients:", clientErr)
      if (bienErr) console.error("Erreur chargement biens:", bienErr)

      console.log("Clients:", clientsData)
      console.log("Biens:", biensData)

      setClients(clientsData || [])
      setBiens(biensData || [])
    }

    fetchData()
  }, [])

  const normalize = (str) => (str || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim()

  const biensCorrespondants = (client) => {
    console.log("→ Analyse pour :", client.nom)
    biens.forEach((bien) => {
      const prixFAI = (bien.prix_vente || 0) + (bien.honoraires || 0)
      const villeMatch = client.ville_recherche && bien.ville
        ? bien.ville.toLowerCase().includes(client.ville_recherche.toLowerCase())
        : true
      const prixMatch = prixFAI >= (client.budget_min || 0) && prixFAI <= (client.budget_max || Infinity)
      const typeMatch = normalize(bien.type_bien).includes(normalize(client.type_bien))

      console.log(`  → Bien: ${bien.titre || bien.id}`)
      console.log(`     ville: ${bien.ville} vs ${client.ville_recherche} => ${villeMatch}`)
      console.log(`     prix FAI: ${prixFAI} ∈ [${client.budget_min}, ${client.budget_max}] => ${prixMatch}`)
      console.log(`     type: ${bien.type_bien} vs ${client.type_bien} => ${typeMatch}`)
    })
    const matched = biens.filter((bien) => {
      const prix_vente = bien.prix_vente || 0
      const honoraires = bien.honoraires || 0
      const prixFAI = prix_vente + honoraires

      const villeOK = client.ville_recherche && bien.ville
        ? bien.ville.toLowerCase().includes(client.ville_recherche.toLowerCase())
        : true

      const prixOK = prixFAI >= (client.budget_min || 0) && prixFAI <= (client.budget_max || Infinity)

      normalize(bien.type_bien).includes(normalize(client.type_bien))

      const typeOK = normalize(bien.type_bien).includes(normalize(client.type_bien))
      return villeOK && prixOK && typeOK
    })

    console.log(`→ ${client.nom} : ${matched.length} match(s)`, matched)
    return matched
  }

  return (
    <div className="space-y-10 max-w-6xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-orange-600">🔍 Rapprochements</h1>
        <Link href="/recherche">
          <button className="bg-orange-100 text-orange-700 px-4 py-2 rounded hover:bg-orange-200 text-sm">
            🌐 Accès au moteur Google
          </button>
        </Link>
      </div>

      {clients.length === 0 ? (
        <p className="text-gray-500">Aucun client à rapprocher.</p>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {clients.map((client) => {
            const matches = biensCorrespondants(client)
            const hasMatch = matches.length > 0

            return (
              <div key={client.id} className="bg-white rounded-xl shadow p-5 border space-y-2">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-gray-800">{client.nom}</h2>
                  {hasMatch ? (
                    <span
                      title="Biens correspondants trouvés"
                      className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full"
                    >
                      {matches.length} match
                    </span>
                  ) : (
                    <span
                      title="Aucun bien correspondant"
                      className="bg-gray-300 text-gray-700 text-xs font-bold px-2 py-1 rounded-full"
                    >
                      Aucun match
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">📍 {client.ville_recherche || "Ville non renseignée"}</p>
                <p className="text-sm text-gray-600">💰 {client.budget_min || 0} € → {client.budget_max || "Max"} €</p>
                <p className="text-sm text-gray-600">🏡 {client.type_bien || "Type non défini"}</p>

                {hasMatch && (
                  <div className="mt-4 space-y-1">
                    {matches.map((bien) => (
                      <div key={bien.id} className="text-sm text-gray-700">
                        ● {bien.titre || "Bien sans titre"} — {bien.ville} — {bien.prix_vente + (bien.honoraires || 0)} €
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"

export default function Rapprochements() {
  const [clients, setClients] = useState([])
  const [biens, setBiens] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { data: clientsData } = await supabase.from("clients").select("*")
      const { data: biensData } = await supabase.from("biens").select("*").eq("disponible", true)
      setClients(clientsData || [])
      setBiens(biensData || [])
    }

    fetchData()
  }, [])

  const construireRequeteGoogle = (client) => {
    const motsCles = [
      client.type_bien || "maison",
      client.ville_recherche,
      client.budget_max + "€"
    ]
      .filter(Boolean)
      .join(" ")
    return `https://www.google.com/search?q=${encodeURIComponent(motsCles)}`
  }

  const biensCorrespondants = (client) => {
    return biens.filter((bien) => {
      return (
        bien.ville?.toLowerCase().includes(client.ville_recherche?.toLowerCase()) &&
        bien.type_bien?.toLowerCase().includes(client.type_bien?.toLowerCase() || "") &&
        bien.prix >= client.budget_min &&
        bien.prix <= client.budget_max
      )
    })
  }

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-orange-600">🔍 Rapprochements</h1>
        <Link href="/recherche">
          <button className="bg-orange-100 text-orange-700 px-4 py-2 rounded hover:bg-orange-200 text-sm">
            🌐 Accès au moteur Google
          </button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {clients.map((client) => {
          const matches = biensCorrespondants(client)
          const hasMatch = matches.length > 0
          const pastille = hasMatch ? "🟢" : "🔴"

          return (
            <div key={client.id} className="bg-white rounded-xl shadow p-5 border space-y-2">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">{client.nom}</h2>
                <span className="text-xl">{pastille}</span>
              </div>
              <p className="text-sm text-gray-600">📍 {client.ville_recherche}</p>
              <p className="text-sm text-gray-600">💰 {client.budget_min}€ – {client.budget_max}€</p>
              <p className="text-sm text-gray-600">🏠 {client.type_bien}</p>

              {/* Lien vers recherche Google */}
              <a
                href={construireRequeteGoogle(client)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-sm text-orange-600 hover:underline"
              >
                🌐 Rechercher sur Google
              </a>

              {/* Liste des biens associés */}
              {hasMatch && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-1">🏡 Biens correspondants :</p>
                  <ul className="text-sm space-y-1">
                    {matches.map((bien) => (
                      <li key={bien.id}>
                        <Link
                          href={`/biens/${bien.id}`}
                          className="text-orange-700 hover:underline"
                        >
                          📍 {bien.titre} à {bien.ville} – {bien.prix?.toLocaleString()} €
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

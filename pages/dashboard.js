import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [biens, setBiens] = useState([])
  const [clients, setClients] = useState([])
  const [recents, setRecents] = useState({ biens: [], clients: [] })

  useEffect(() => {
    const fetchData = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const user = sessionData?.session?.user
      if (!user) return

      setUser(user)

      const { data: biensData } = await supabase.from("biens").select("*").eq("agent_id", user.id)
      const { data: clientsData } = await supabase.from("clients").select("*").eq("agent_id", user.id)

      const { data: recentBiens } = await supabase
        .from("biens")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5)

      const { data: recentClients } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5)

      setBiens(biensData || [])
      setClients(clientsData || [])
      setRecents({ biens: recentBiens || [], clients: recentClients || [] })
    }

    fetchData()
  }, [])

  const totalCA = biens.reduce((sum, bien) => {
    if (bien.vendu && bien.honoraires) {
      return sum + bien.honoraires
    }
    return sum
  }, 0)

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">🏠 Tableau de bord</h1>

      {/* Résumé activité */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">📦 Mes biens</h2>
          <p className="text-3xl font-bold">{biens.length}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">👥 Mes clients</h2>
          <p className="text-3xl font-bold">{clients.length}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">💰 CA (honoraires vendus)</h2>
          <p className="text-2xl font-bold">{totalCA.toLocaleString()} €</p>
        </div>
      </div>

      {/* Ajout rapide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Link href="/biens/ajouter" className="bg-orange-100 hover:bg-orange-200 p-6 rounded-xl shadow text-center">
          ➕ Ajouter un bien
        </Link>
        <Link href="/clients" className="bg-blue-100 hover:bg-blue-200 p-6 rounded-xl shadow text-center">
          ➕ Ajouter un client
        </Link>
      </div>

      {/* Actualité du réseau */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Derniers biens */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">🏡 Derniers biens ajoutés</h2>
          {recents.biens.map((bien) => (
            <div key={bien.id} className="border-b py-2">
              <p className="font-semibold">{bien.titre} - {bien.ville}</p>
              <p className="text-sm text-gray-500">{bien.prix?.toLocaleString()} €</p>
            </div>
          ))}
        </div>

        {/* Derniers clients */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">👥 Derniers clients ajoutés</h2>
          {recents.clients.map((client) => (
            <div key={client.id} className="border-b py-2">
              <p className="font-semibold">{client.nom}</p>
              <p className="text-sm text-gray-500">📍 {client.ville} — Budget max : {client.budget_max?.toLocaleString()} €</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

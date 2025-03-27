import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function Reseau() {
  const [utilisateurs, setUtilisateurs] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [search, setSearch] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [biens, setBiens] = useState([])
  const [clients, setClients] = useState([])

  useEffect(() => {
    fetchUtilisateurs()
  }, [])

  const fetchUtilisateurs = async () => {
    const { data, error } = await supabase.from("utilisateurs").select("*")
    if (!error) {
      setUtilisateurs(data)
      setFilteredUsers(data)
    }
  }

  const voirDetails = async (userId) => {
    setSelectedUser(userId)

    const { data: biensData } = await supabase.from("biens").select("*").eq("agent_id", userId)
    const { data: clientsData } = await supabase.from("clients").select("*").eq("agent_id", userId)

    setBiens(biensData || [])
    setClients(clientsData || [])
  }

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase()
    setSearch(value)
    const filtered = utilisateurs.filter((u) =>
      u.nom?.toLowerCase().includes(value) || u.ville?.toLowerCase().includes(value)
    )
    setFilteredUsers(filtered)
  }

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-orange-700">🌐 Mon réseau</h1>
      </div>

      {/* Recherche */}
      <div className="flex gap-4 items-center">
        <input
          type="text"
          placeholder="🔍 Rechercher un agent par nom ou ville..."
          value={search}
          onChange={handleSearch}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm"
        />
      </div>

      {/* Liste agents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className={`rounded-xl shadow border p-4 bg-white hover:shadow-lg transition ${
              selectedUser === user.id ? "border-orange-500" : "border-gray-100"
            }`}
          >
            <h2 className="font-semibold text-lg text-gray-800">{user.nom || "Agent"}</h2>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500 mb-2">📍 {user.ville || "Ville inconnue"}</p>
            <button
              className="text-sm text-orange-600 hover:underline"
              onClick={() => voirDetails(user.id)}
            >
              ➕ Voir ses biens & clients
            </button>
          </div>
        ))}
      </div>

      {/* Détail agent */}
      {selectedUser && (
        <div className="bg-white rounded-xl shadow p-6 border border-orange-100 space-y-6">
          <h2 className="text-xl font-bold text-gray-800">📁 Détails de l’agent</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-md font-semibold text-orange-600 mb-2">🏡 Biens</h3>
              {biens.length === 0 ? (
                <p className="text-sm text-gray-500">Aucun bien trouvé</p>
              ) : (
                <ul className="text-sm space-y-1">
                  {biens.map((b) => (
                    <li key={b.id}>• {b.titre} à {b.ville} — {b.prix?.toLocaleString()} €</li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h3 className="text-md font-semibold text-orange-600 mb-2">👤 Clients</h3>
              {clients.length === 0 ? (
                <p className="text-sm text-gray-500">Aucun client enregistré</p>
              ) : (
                <ul className="text-sm space-y-1">
                  {clients.map((c) => (
                    <li key={c.id}>• {c.nom} — {c.ville} ({c.budget_min}€ à {c.budget_max}€)</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

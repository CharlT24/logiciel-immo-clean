import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"

export default function Biens() {
  const router = useRouter()
  const [userId, setUserId] = useState(null)
  const [biens, setBiens] = useState([])
  const [utilisateurs, setUtilisateurs] = useState([])
  const [filtreAgent, setFiltreAgent] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return router.push("/login")
      setUserId(session.user.id)

      const { data: biensData } = await supabase.from("biens").select("*")
      const { data: usersData } = await supabase.from("utilisateurs").select("id, nom, email")

      setBiens(biensData || [])
      setUtilisateurs(usersData || [])
    }

    fetchData()
  }, [])

  const biensFiltres = filtreAgent
    ? biens.filter((b) => b.agent_id === filtreAgent)
    : biens

  const handleModifier = (id) => {
    router.push(`/biens/modifier?id=${id}`)
  }

  return (
    <div className="ml-64 p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🏡 Liste des biens</h1>
        <a href="/dashboard" className="text-sm text-orange-600 hover:underline">⬅️ Retour au Dashboard</a>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium text-sm">Filtrer par agent :</label>
        <select
          className="border border-gray-300 px-3 py-2 rounded-md"
          onChange={(e) => setFiltreAgent(e.target.value)}
          value={filtreAgent}
        >
          <option value="">🌐 Tous les biens</option>
          {utilisateurs.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nom || u.email}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {biensFiltres.map((bien) => (
          <div key={bien.id} className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-semibold mb-1">{bien.titre}</h2>
            <p className="text-sm text-gray-600">📍 {bien.ville}</p>
            <p className="text-sm text-gray-600">📏 {bien.surface_m2} m²</p>
            <p className="text-sm text-gray-600">💰 {bien.prix?.toLocaleString()} €</p>
            <p className="text-sm text-gray-600">🔋 DPE : {bien.dpe}</p>
            <p className="text-sm mt-2">
              {bien.vendu ? (
                <span className="text-red-600 font-bold">🏁 VENDU</span>
              ) : bien.sous_compromis ? (
                <span className="text-yellow-600 font-bold">⏳ Sous compromis</span>
              ) : (
                <span className="text-green-600 font-bold">🟢 Disponible</span>
              )}
            </p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleModifier(bien.id)}
                className="text-sm text-orange-600 hover:underline"
              >
                ✏️ Modifier
              </button>
              <span className="text-xs text-gray-400">{bien.agent_id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

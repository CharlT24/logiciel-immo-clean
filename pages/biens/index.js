import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"
import { useRouter } from "next/router"

export default function ListeBiens() {
  const [biens, setBiens] = useState([])
  const [allBiens, setAllBiens] = useState([])
  const [agents, setAgents] = useState([])
  const [filtres, setFiltres] = useState({
    ville: "",
    statut: "",
    agent_id: ""
  })

  const router = useRouter()

  useEffect(() => {
    fetchBiens()
    fetchAgents()
  }, [])

  const fetchBiens = async () => {
    const { data, error } = await supabase.from("biens").select("*")
    if (!error) {
      setAllBiens(data)
      setBiens(data)
    } else {
      console.error("Erreur chargement biens :", error)
    }
  }

  const fetchAgents = async () => {
    const { data, error } = await supabase
      .from("utilisateurs")
      .select("id, nom")
      .eq("role", "agent")
    if (!error) setAgents(data)
  }

  const handleDelete = async (id) => {
    if (confirm("Supprimer ce bien ? Cette action est irréversible.")) {
      const { error } = await supabase.from("biens").delete().eq("id", id)
      if (!error) {
        setBiens((prev) => prev.filter((b) => b.id !== id))
        alert("Bien supprimé ✅")
      } else {
        alert("Erreur lors de la suppression ❌")
      }
    }
  }

  const handleFiltreChange = (e) => {
    const { name, value } = e.target
    const newFiltres = { ...filtres, [name]: value }
    setFiltres(newFiltres)

    const filtrés = allBiens.filter((bien) => {
      return (
        (!newFiltres.ville || bien.ville === newFiltres.ville) &&
        (!newFiltres.statut || bien.statut === newFiltres.statut) &&
        (!newFiltres.agent_id || bien.agent_id === newFiltres.agent_id)
      )
    })
    setBiens(filtrés)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-orange-600">🏡 Tous les biens</h1>
        <button
          onClick={() => router.push("/biens/ajouter/etape1")}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded shadow"
        >
          ➕ Ajouter un bien
        </button>
      </div>

      {/* Filtres */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select name="ville" value={filtres.ville} onChange={handleFiltreChange} className="input">
          <option value="">Toutes les villes</option>
          {[...new Set(allBiens.map((b) => b.ville))].map((ville) => (
            <option key={ville} value={ville}>{ville}</option>
          ))}
        </select>
        <select name="statut" value={filtres.statut} onChange={handleFiltreChange} className="input">
          <option value="">Tous les statuts</option>
          <option value="disponible">Disponible</option>
          <option value="sous_compromis">Sous compromis</option>
          <option value="vendu">Vendu</option>
        </select>
        <select name="agent_id" value={filtres.agent_id} onChange={handleFiltreChange} className="input">
          <option value="">Tous les agents</option>
          {agents.map((agent) => (
            <option key={agent.id} value={agent.id}>{agent.nom}</option>
          ))}
        </select>
      </div>

      {/* Liste des biens */}
      {biens.length === 0 ? (
        <p className="text-gray-500 mt-10">Aucun bien trouvé avec ces filtres.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {biens.map((bien) => {
            const prixFAI = (bien.prix_vente || 0) + (bien.honoraires || 0)
            const image = bien.photos?.[0] || "/no-photo.jpg"

            return (
              <div
                key={bien.id}
                className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition flex flex-col"
              >
                <img
                  src={image}
                  alt={bien.titre}
                  className="w-full h-52 object-cover"
                />
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h2 className="font-bold text-xl text-gray-800 truncate">{bien.titre}</h2>
                    <p className="text-sm text-gray-500 mb-2">{bien.ville}</p>

                    {/* Capsules cliquables */}
                    <div className="flex flex-wrap gap-3 mt-3">
                      <Link href={`/biens/${bien.id}`} legacyBehavior>
                        <a className="bg-orange-100 text-orange-700 text-sm font-semibold px-5 py-2 rounded-xl shadow-sm hover:bg-orange-200 transition">
                          {bien.surface_m2} m²
                        </a>
                      </Link>
                      <Link href={`/biens/${bien.id}`} legacyBehavior>
                        <a className="bg-orange-100 text-orange-700 text-sm font-semibold px-5 py-2 rounded-xl shadow-sm hover:bg-orange-200 transition">
                          {prixFAI.toLocaleString()} €
                        </a>
                      </Link>
                      {bien.statut && (
                        <Link href={`/biens/${bien.id}`} legacyBehavior>
                          <a className="bg-gray-100 text-gray-700 text-sm font-medium px-5 py-2 rounded-xl shadow-sm hover:bg-gray-200 transition capitalize">
                            {bien.statut.replace('_', ' ')}
                          </a>
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Boutons action */}
                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={() => router.push(`/biens/${bien.id}/modifier`)}
                      className="text-sm bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
                    >
                      📝 Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(bien.id)}
                      className="text-sm text-red-600 hover:text-red-800 transition"
                    >
                      🗑 Supprimer
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

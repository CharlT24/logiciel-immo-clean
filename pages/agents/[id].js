import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function FicheAgent() {
  const router = useRouter()
  const { id } = router.query

  const [agent, setAgent] = useState(null)
  const [biens, setBiens] = useState([])
  const [userId, setUserId] = useState(null)
  const [role, setRole] = useState("")

  useEffect(() => {
    if (id) {
      fetchAgent()
      fetchBiens()
    }
    getSession()
  }, [id])

  const getSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    const uid = session?.user?.id
    setUserId(uid)

    const { data } = await supabase
      .from("utilisateurs")
      .select("role")
      .eq("id", uid)
      .single()

    setRole(data?.role || "")
  }

  const fetchAgent = async () => {
    const { data, error } = await supabase
      .from("utilisateurs")
      .select("*")
      .eq("id", id)
      .single()

    if (!error) setAgent(data)
  }

  const fetchBiens = async () => {
    const { data, error } = await supabase
      .from("biens")
      .select("id, titre, ville, code_postal")
      .eq("agent_id", id)

    if (!error) setBiens(data)
  }

  const handleDelete = async () => {
    const confirmDelete = window.confirm("❌ Supprimer définitivement cet agent ?")
    if (!confirmDelete) return

    // Supabase
    const { error } = await supabase.from("agent").delete().eq("id", id)
    if (error) {
      alert("❌ Erreur Supabase")
      return
    }

    // WordPress
    fetch(`http://localhost/wordpress/wp-json/oi/v1/supabase-delete-agent/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        alert("✅ Agent supprimé sur Supabase et WordPress")
        router.push("/agents")
      })
      .catch(() => {
        alert("⚠️ Supprimé localement, mais pas sur WordPress")
        router.push("/agents")
      })
  }

  if (!agent) {
    return <p className="text-center mt-20 text-gray-500">Chargement de la fiche agent...</p>
  }

  const avatarUrl = agent.photo_url || "/no-avatar.jpg"

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <button
        onClick={() => router.push("/agents")}
        className="text-sm text-orange-600 hover:underline"
      >
        ⬅️ Retour à la liste des agents
      </button>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/3 bg-gray-100">
          <img
            src={avatarUrl}
            alt={agent.nom}
            className="w-full h-full object-cover"
            onError={(e) => (e.target.src = "/no-avatar.jpg")}
          />
        </div>

        <div className="p-6 md:w-2/3 space-y-4">
          <h1 className="text-2xl font-bold text-gray-800">{agent.nom}</h1>
          <p className="text-gray-600">📍 {agent.ville || "Ville non renseignée"}</p>
          <p className="text-gray-600">📞 {agent.telephone || "Téléphone non renseigné"}</p>
          <p className="text-gray-600">📧 {agent.email || "Email non renseigné"}</p>
          {agent.adresse && <p className="text-gray-600">🏠 {agent.adresse}</p>}
          {agent.code_postal && <p className="text-gray-600">📮 {agent.code_postal}</p>}
          {agent.pays && <p className="text-gray-600">🌍 {agent.pays}</p>}
          {agent.url_bareme && (
            <p className="text-gray-600">
              📄 <a href={agent.url_bareme} className="underline text-orange-600" target="_blank">Barème d’honoraires</a>
            </p>
          )}
          {agent.bio && (
            <div>
              <h2 className="text-md font-semibold text-gray-700 mb-2">À propos</h2>
              <p className="text-gray-700 whitespace-pre-line">{agent.bio}</p>
            </div>
          )}

          {role === "admin" && (
            <button
              onClick={handleDelete}
              className="text-sm text-red-600 hover:underline mt-4 block"
            >
              🗑️ Supprimer cet agent
            </button>
          )}
        </div>
      </div>

      {biens.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-orange-600 mb-4">🏡 Biens associés</h2>
          <div className="space-y-3">
            {biens.map((bien) => (
              <div
                key={bien.id}
                className="p-4 bg-gray-50 rounded shadow flex justify-between items-center hover:bg-gray-100"
              >
                <div>
                  <p className="font-medium text-gray-800">{bien.titre}</p>
                  <p className="text-sm text-gray-500">{bien.ville} ({bien.code_postal})</p>
                </div>
                <button
                  onClick={() => router.push(`/biens/${bien.id}`)}
                  className="text-sm text-orange-600 hover:underline"
                >
                  Voir le bien
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

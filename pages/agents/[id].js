import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function FicheAgent() {
  const router = useRouter()
  const { id } = router.query
  const [agent, setAgent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) fetchAgent()
  }, [id])

  const fetchAgent = async () => {
    const { data, error } = await supabase
      .from("utilisateurs")
      .select("id, nom, email_contact, ville, telephone, bio, photo_url")
      .eq("id", id)
      .single()

    if (!error) {
      setAgent(data)
    }
    setLoading(false)
  }

  if (loading) {
    return <p className="text-center mt-20 text-gray-500">Chargement de la fiche agent...</p>
  }

  if (!agent) {
    return <p className="text-center text-red-600 mt-20">Agent introuvable ❌</p>
  }

  const avatarUrl =
    agent.photo_url ||
    `https://fkavtsofmglifzalclyn.supabase.co/storage/v1/object/public/photos/avatars/${agent.id}/avatar.jpg`

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
      <button
        onClick={() => router.push("/agents")}
        className="text-sm text-orange-600 hover:underline"
      >
        ⬅️ Retour à la liste des agents
      </button>

      <div className="bg-white shadow-xl rounded-3xl overflow-hidden flex flex-col md:flex-row">
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

          {agent.ville && (
            <p className="text-gray-600">📍 {agent.ville}</p>
          )}
          {agent.telephone && (
            <p className="text-gray-600">📞 {agent.telephone}</p>
          )}
          {agent.email_contact && (
            <p className="text-gray-600">📧 {agent.email_contact}</p>
          )}

          {agent.bio && (
            <div className="mt-4">
              <h2 className="text-md font-semibold text-gray-700 mb-1">🧾 À propos</h2>
              <p className="text-gray-700 whitespace-pre-line">{agent.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

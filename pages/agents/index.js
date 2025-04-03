import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"
import { useRouter } from "next/router"

export default function ListeAgents() {
  const [agents, setAgents] = useState([])
  const [role, setRole] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const uid = session?.user?.id
      if (!uid) return

      const { data: userData } = await supabase
        .from("utilisateurs")
        .select("role")
        .eq("id", uid)
        .single()

      setRole(userData?.role || "")
    }

    const fetchAgents = async () => {
      const { data, error } = await supabase
        .from("utilisateurs")
        .select("id, nom, ville, telephone")
        .eq("role", "agent")

      if (!error) setAgents(data)
    }

    fetchUserRole()
    fetchAgents()
  }, [])

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Supprimer cet agent ? Cette action est irréversible.")
    if (!confirmDelete) return

    const { error } = await supabase.from("utilisateurs").delete().eq("id", id)
    if (!error) {
      setAgents((prev) => prev.filter((a) => a.id !== id))
      alert("✅ Agent supprimé")
    } else {
      alert("❌ Erreur lors de la suppression")
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-3xl font-bold text-orange-600">👥 Nos agents</h1>

      {agents.length === 0 ? (
        <p className="text-gray-500 mt-10">Aucun agent trouvé pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {agents.map((agent) => {
            const avatar = `https://fkavtsofmglifzalclyn.supabase.co/storage/v1/object/public/photos/avatars/${agent.id}/avatar.jpg`

            return (
              <div
                key={agent.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col relative"
              >
                <img
                  src={avatar}
                  alt={agent.nom}
                  className="w-full h-52 object-cover"
                  onError={(e) => (e.target.src = "/no-avatar.jpg")}
                />
                <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="font-semibold text-lg text-gray-800">{agent.nom}</h2>
                    {agent.ville && (
                      <p className="text-sm text-gray-500">{agent.ville}</p>
                    )}
                    {agent.telephone && (
                      <p className="text-sm text-gray-500 mt-1">📞 {agent.telephone}</p>
                    )}
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <Link href={`/agents/${agent.id}`} legacyBehavior>
                      <a className="bg-orange-500 text-white text-sm font-semibold px-4 py-2 rounded hover:bg-orange-600 transition">
                        Voir sa fiche
                      </a>
                    </Link>

                    {role === "admin" && (
                      <button
                        onClick={() => handleDelete(agent.id)}
                        className="text-xs text-red-600 hover:underline ml-3"
                      >
                        🗑 Supprimer
                      </button>
                    )}
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

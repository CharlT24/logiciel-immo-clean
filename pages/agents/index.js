import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"

export default function ListeAgents() {
  const [agents, setAgents] = useState([])
  const [userId, setUserId] = useState(null)
  const [role, setRole] = useState("")

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const uid = session?.user?.id
      if (!uid) return
      setUserId(uid)

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
        .select("*")
        .eq("role", "agent")

      if (!error) setAgents(data)
    }

    fetchUser()
    fetchAgents()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm("Confirmer la suppression de cet agent ?")) return
    const { error } = await supabase.from("utilisateurs").delete().eq("id", id)
    if (!error) {
      setAgents(agents.filter((a) => a.id !== id))
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-3xl font-bold text-orange-600">👥 Nos agents</h1>

      {agents.length === 0 ? (
        <p className="text-gray-500 mt-10">Aucun agent trouvé pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {agents.map((agent) => (
            <div key={agent.id} className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col">
              <img
                src={agent.photo_url || "/no-avatar.jpg"}
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
                  {agent.email && (
                    <p className="text-sm text-gray-500 mt-1">✉️ {agent.email}</p>
                  )}
                </div>
                <div className="flex justify-between items-center mt-3">
                  <Link href={`/agents/${agent.id}`} legacyBehavior>
                    <a className="inline-block bg-orange-500 text-white text-sm font-semibold px-4 py-2 rounded hover:bg-orange-600 transition">
                      Voir la fiche
                    </a>
                  </Link>
                  {role === "admin" && (
                    <button onClick={() => handleDelete(agent.id)} className="text-sm text-red-500 hover:underline ml-2">
                      Supprimer
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

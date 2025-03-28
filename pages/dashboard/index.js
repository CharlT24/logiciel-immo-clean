import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"

export default function Dashboard() {
  const [biens, setBiens] = useState([])
  const [clients, setClients] = useState([])
  const [caEstime, setCaEstime] = useState(0)
  const [caActe, setCaActe] = useState(0)
  const [topAgents, setTopAgents] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const session = await supabase.auth.getSession()
      const agentId = session.data?.session?.user?.id

      // Biens + clients personnels
      const { data: biensData } = await supabase.from("biens").select("*").eq("agent_id", agentId)
      const { data: clientsData } = await supabase.from("clients").select("*").eq("agent_id", agentId)

      setBiens(biensData || [])
      setClients(clientsData || [])

      const estime = (biensData || []).reduce((acc, b) => acc + (b.honoraires || 0), 0)
      const acte = (biensData || []).filter(b => b.vendu).reduce((acc, b) => acc + (b.honoraires || 0), 0)

      setCaEstime(estime)
      setCaActe(acte)

      // Top agents global
      const { data: allBiens } = await supabase.from("biens").select("honoraires, agent_id, vendu")
      const { data: allUsers } = await supabase.from("utilisateurs").select("id, nom, slug")

      const scores = {}
      for (const bien of allBiens || []) {
        if (bien.vendu && bien.agent_id && bien.honoraires) {
          scores[bien.agent_id] = (scores[bien.agent_id] || 0) + bien.honoraires
        }
      }

      const top = Object.entries(scores)
        .map(([id, total]) => {
          const agent = allUsers.find(u => u.id === id)
          return {
            id,
            nom: agent?.nom || "Inconnu",
            slug: agent?.slug || "",
            total
          }
        })
        .sort((a, b) => b.total - a.total)
        .slice(0, 3)

      setTopAgents(top)
    }

    fetchData()
  }, [])

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-bold text-orange-700">📊 Tableau de bord</h2>

      {/* Capsules de synthèse */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatCard label="📦 Biens enregistrés" value={biens.length} color="blue" />
        <StatCard label="👥 Clients actifs" value={clients.length} color="gray" />
        <StatCard label="💼 CA estimé" value={`${caEstime.toLocaleString()} €`} color="orange" />
        <StatCard label="💰 CA acté (ventes)" value={`${caActe.toLocaleString()} €`} color="green" />
      </div>

      {/* Classement */}
      <div className="bg-white shadow-md rounded-xl p-6 border">
        <h3 className="text-lg font-bold mb-4 text-orange-700">🏆 Top vendeurs du réseau</h3>
        <ul className="space-y-2 text-sm">
          {topAgents.map((agent, index) => (
            <li key={agent.id} className="flex justify-between">
              <Link href={`/reseau/${agent.slug}`} className="text-orange-600 hover:underline">
                #{index + 1} {agent.nom}
              </Link>
              <span className="font-semibold text-gray-700">{agent.total.toLocaleString()} €</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function StatCard({ label, value, color = "gray" }) {
  const colorMap = {
    orange: "text-orange-600 bg-orange-50",
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    gray: "text-gray-600 bg-gray-100"
  }

  return (
    <div className="bg-white shadow rounded-xl p-5 flex items-center gap-4">
      <div className={`text-3xl ${colorMap[color]} p-3 rounded-full`}>📈</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  )
}

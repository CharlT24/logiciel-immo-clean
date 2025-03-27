// pages/dashboard/index.js
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function Dashboard() {
  const [biens, setBiens] = useState([])
  const [clients, setClients] = useState([])
  const [caEstime, setCaEstime] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const session = await supabase.auth.getSession()
      const agentId = session.data?.session?.user?.id

      const { data: biensData } = await supabase.from("biens").select("*").eq("agent_id", agentId)
      setBiens(biensData || [])

      const { data: clientsData } = await supabase.from("clients").select("*").eq("agent_id", agentId)
      setClients(clientsData || [])

      const total = (biensData || []).reduce((acc, bien) => acc + (bien.honoraires || 0), 0)
      setCaEstime(total)
    }

    fetchData()
  }, [])

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-bold text-gray-800">📊 Tableau de bord</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Biens enregistrés" value={biens.length} icon="🏡" color="orange" />
        <StatCard label="Clients actifs" value={clients.length} icon="👥" color="blue" />
        <StatCard label="CA estimé" value={`${caEstime.toLocaleString()} €`} icon="💰" color="green" />
      </div>

      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">📰 Actualités réseau</h3>
        <ul className="list-disc ml-6 space-y-1 text-sm text-gray-600">
          <li>📌 5 nouveaux biens enregistrés aujourd’hui</li>
          <li>🎉 2 ventes finalisées cette semaine</li>
          <li>🚀 Pensez à activer vos exports vers LeBonCoin</li>
        </ul>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, color = "gray" }) {
  const colorMap = {
    orange: "text-orange-600 bg-orange-50",
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    gray: "text-gray-600 bg-gray-100",
  }

  return (
    <div className={`bg-white shadow rounded-xl p-5 flex items-center gap-4`}>
      <div className={`text-3xl ${colorMap[color]} p-3 rounded-full`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  )
}

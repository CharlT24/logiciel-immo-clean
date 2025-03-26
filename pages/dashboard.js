import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/router"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js"

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [biens, setBiens] = useState([])
  const [clients, setClients] = useState([])
  const [caMensuel, setCaMensuel] = useState({})
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return router.push("/login")
      setUser(session.user)
      fetchData(session.user.id)
    }
    fetchUser()
  }, [])

  const fetchData = async (agentId) => {
    const { data: biensData } = await supabase
      .from("biens")
      .select("*")
      .eq("agent_id", agentId)

    const { data: clientsData } = await supabase
      .from("clients")
      .select("*")
      .eq("agent_id", agentId)

    setBiens(biensData || [])
    setClients(clientsData || [])

    // Calcul CA mensuel uniquement sur biens vendus
    const ventes = (biensData || []).filter(b => b.vendu && b.honoraires)
    const parMois = {}

    ventes.forEach(bien => {
      const date = new Date(bien.updated_at || bien.created_at)
      const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`

      parMois[key] = (parMois[key] || 0) + bien.honoraires
    })

    setCaMensuel(parMois)
  }

  const totalCA = biens
    .filter(b => b.vendu && b.honoraires)
    .reduce((sum, b) => sum + (b.honoraires || 0), 0)

  const chartData = {
    labels: Object.keys(caMensuel),
    datasets: [
      {
        label: "Honoraires (€)",
        data: Object.values(caMensuel),
        backgroundColor: "#2563EB"
      }
    ]
  }

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl p-4 flex flex-col space-y-6 fixed h-full">
        <div className="text-2xl font-bold text-blue-600">LOGICIEL IMMO</div>
        <nav className="flex flex-col space-y-2 mt-6">
          <a href="/dashboard" className="hover:text-blue-600">🏠 Tableau de bord</a>
          <a href="/clients" className="hover:text-blue-600">👥 Clients</a>
          <a href="/biens" className="hover:text-blue-600">🏡 Biens</a>
          <a href="/rapprochements" className="hover:text-blue-600">🔍 Rapprochements</a>
          <a href="/statistiques" className="hover:text-blue-600">📊 Statistiques</a>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 ml-64">
        <h1 className="text-3xl font-bold mb-6">Bienvenue {user?.email}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Biens */}
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-semibold mb-2">📦 Biens</h2>
            <p className="text-3xl font-bold">{biens.length}</p>
          </div>

          {/* Clients */}
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-semibold mb-2">👥 Clients</h2>
            <p className="text-3xl font-bold">{clients.length}</p>
          </div>

          {/* CA estimé */}
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-semibold mb-2">💰 Chiffre d’affaires estimé</h2>
            <p className="text-2xl font-bold">{totalCA.toLocaleString()} €</p>
          </div>
        </div>

        {/* Graphique */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">📊 Évolution mensuelle des honoraires</h2>
          {Object.keys(caMensuel).length > 0 ? (
            <Bar data={chartData} />
          ) : (
            <p className="text-gray-500">Aucune vente enregistrée.</p>
          )}
        </div>
      </main>
    </div>
  )
}

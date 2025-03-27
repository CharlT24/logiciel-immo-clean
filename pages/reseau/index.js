import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"

export default function Reseau() {
  const [agents, setAgents] = useState([])
  const [secteurs, setSecteurs] = useState([])
  const [filtreSecteur, setFiltreSecteur] = useState("")

  useEffect(() => {
    const fetchAgents = async () => {
      const { data, error } = await supabase.from("utilisateurs").select("*")
      if (error) console.error("Erreur chargement agents :", error)
      else {
        setAgents(data)
        const uniqueSecteurs = [...new Set(data.map((a) => a.secteur || "Inconnu"))]
        setSecteurs(uniqueSecteurs)
      }
    }
    fetchAgents()
  }, [])

  const agentsFiltres = filtreSecteur
    ? agents.filter((a) => a.secteur === filtreSecteur)
    : agents

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">🌐 Réseau des Agents</h1>

      {/* Filtres */}
      <div className="mb-6">
        <label className="mr-2 font-medium">Filtrer par secteur :</label>
        <select
          className="border px-2 py-1"
          value={filtreSecteur}
          onChange={(e) => setFiltreSecteur(e.target.value)}
        >
          <option value="">-- Tous --</option>
          {secteurs.map((s, i) => (
            <option key={i} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Liste des agents */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agentsFiltres.map((agent) => (
          <div key={agent.id} className="bg-white rounded-xl shadow p-4 border">
            <h2 className="text-xl font-semibold text-blue-600">{agent.nom || "Nom inconnu"}</h2>
            <p className="text-gray-600">{agent.email}</p>
            <p className="text-sm text-gray-500">📍 Secteur : {agent.secteur || "Non défini"}</p>
            <Link href={`/reseau/${agent.id}`}>
              <span className="inline-block mt-3 text-sm text-orange-600 hover:underline">
                👉 Voir ses biens
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

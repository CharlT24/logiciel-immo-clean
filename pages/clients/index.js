// pages/clients/index.js
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"

export default function ListeClients() {
  const [clients, setClients] = useState([])

  useEffect(() => {
    const fetchClients = async () => {
      const session = await supabase.auth.getSession()
      const agentId = session.data?.session?.user?.id
      const { data, error } = await supabase.from("clients").select("*").eq("agent_id", agentId)
      if (!error) setClients(data)
    }

    fetchClients()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">👥 Mes clients</h2>
        <Link href="/clients/ajouter" className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
          ➕ Ajouter un client
        </Link>
      </div>

      {clients.length === 0 ? (
        <p className="text-gray-500">Aucun client pour le moment.</p>
      ) : (
        <div className="grid gap-4">
          {clients.map((client) => (
            <div key={client.id} className="bg-white p-4 shadow rounded-lg">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-bold text-lg">{client.nom}</h3>
                  <p className="text-sm text-gray-600">{client.email}</p>
                  <p className="text-sm text-gray-600">📍 {client.ville_recherche}</p>
                  <p className="text-sm text-gray-600">
                    💶 {client.budget_min} € – {client.budget_max} €
                  </p>
                </div>
                <Link href={`/clients/${client.id}/modifier`} className="text-orange-600 hover:underline text-sm">
                  ✏️ Modifier
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

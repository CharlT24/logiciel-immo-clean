// pages/clients/acquereur/index.js
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"
import { useRouter } from "next/router"

export default function ListeAcquereurs() {
  const [clients, setClients] = useState([])
  const [role, setRole] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const session = await supabase.auth.getSession()
      const userId = session.data?.session?.user?.id

      const { data: user } = await supabase
        .from("utilisateurs")
        .select("role")
        .eq("id", userId)
        .single()
      setRole(user?.role)

      const { data: clientsData } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false })

      setClients(clientsData || [])
    }

    fetchData()
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-orange-600">👥 Acquéreurs</h1>
        <Link href="/clients/acquereur/ajouter" legacyBehavior>
          <a className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 text-sm">➕ Ajouter</a>
        </Link>
      </div>

      {clients.length === 0 ? (
        <p className="text-gray-500 mt-10">Aucun acquéreur enregistré.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <div key={client.id} className="bg-white p-5 rounded-xl shadow space-y-2">
              <p className="font-semibold text-lg text-gray-800">{client.nom}</p>
              <p className="text-sm text-gray-500">{client.email}</p>
              <p className="text-sm text-gray-500">📞 {client.telephone}</p>
              <p className="text-sm text-gray-500">🏡 {client.ville_recherche || "-"}</p>
              <p className="text-sm text-gray-500">
                💶 {client.budget_min?.toLocaleString()}€ - {client.budget_max?.toLocaleString()}€
              </p>

              <div className="flex gap-4 pt-2 text-sm">
                <Link href={`/clients/acquereurs/${client.id}`} legacyBehavior>
                  <a className="text-blue-600 hover:underline">Voir fiche</a>
                </Link>
                <Link href={`/clients/acquereurs/modifier?id=${client.id}`} legacyBehavior>
                  <a className="text-orange-600 hover:underline">Modifier</a>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

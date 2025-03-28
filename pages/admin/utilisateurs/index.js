// pages/admin/utilisateurs/index.js
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"

export default function ListeUtilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState([])

  useEffect(() => {
    const fetchUtilisateurs = async () => {
      const { data, error } = await supabase.from("utilisateurs").select("*")
      if (error) {
        console.error("Erreur lors du chargement :", error)
      } else {
        setUtilisateurs(data)
      }
    }

    fetchUtilisateurs()
  }, [])

  return (
    <div className="space-y-8">
      {/* Titre + bouton ajouter */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-orange-600">👥 Tous les utilisateurs</h1>
        <Link
          href="/admin/utilisateurs/ajouter"
          className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition text-sm"
        >
          ➕ Ajouter un utilisateur
        </Link>
      </div>

      {/* Liste des utilisateurs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {utilisateurs.map((user) => (
          <div key={user.id} className="bg-white rounded-xl shadow p-4 border border-gray-100 space-y-2">
            <p className="text-lg font-semibold text-gray-800">{user.nom || "Sans nom"}</p>
            <p className="text-sm text-gray-600">📧 {user.email}</p>
            <p className="text-sm text-gray-600">🏷️ Rôle : {user.role || "agent"}</p>
            <Link
              href={`/admin/utilisateurs/${user.id}/modifier`}
              className="text-sm text-orange-600 hover:underline"
            >
              ✏️ Modifier ce compte
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

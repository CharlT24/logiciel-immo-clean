import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"
import Image from "next/image"

export default function AdminUtilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUtilisateurs()
  }, [])

  const fetchUtilisateurs = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("utilisateurs")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) console.error("Erreur chargement utilisateurs :", error)
    else setUtilisateurs(data)
    setLoading(false)
  }

  const validerUtilisateur = async (id) => {
    const { error } = await supabase
      .from("utilisateurs")
      .update({ is_validated: true })
      .eq("id", id)
  
    if (error) {
      console.error("Erreur validation :", error)
      alert("❌ Erreur lors de la validation")
    } else {
      alert("✅ Compte validé avec succès")
      fetchUtilisateurs() // recharge la liste
    }
  }  

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">👨‍💼 Gestion des utilisateurs</h1>

      {loading ? (
        <p className="text-gray-500">Chargement...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {utilisateurs.map((user) => (
            <div key={user.id} className="bg-white rounded-2xl shadow-lg p-5 border hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-3">
                {user.avatar_url ? (
                  <Image src={user.avatar_url} alt="avatar" width={40} height={40} className="rounded-full" />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">👤</div>
                )}
                <div>
                  <p className="font-semibold text-lg">{user.prenom} {user.nom}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>

              <div className="space-y-1 text-sm text-gray-700">
                <p>🏢 Agence : {user.agence || "NC"}</p>
                <p>📍 Ville : {user.ville || "NC"}</p>
                <p>🧑‍💼 Rôle : <span className="font-medium">{user.role}</span></p>
                <p>
                  ✅ Statut :{" "}
                  {user.is_validated ? (
                    <span className="text-green-600 font-semibold">Validé</span>
                  ) : (
                    <span className="text-red-500 font-semibold">À valider</span>
                  )}
                </p>
              </div>

              <div className="flex justify-between items-center mt-4">
                <Link href={`/admin/utilisateur/${user.id}/modifier`} className="text-sm text-orange-600 hover:underline">
                  ✏️ Modifier
                </Link>
                {!user.is_validated && (
                  <button
                    onClick={() => validerUtilisateur(user.id)}
                    className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                  >
                    ✅ Valider
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

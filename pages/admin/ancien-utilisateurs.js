import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "../../lib/supabaseClient"
import AdminNavbar from "../../components/AdminNavbar"

export default function AdminUtilisateurs() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAdminAndFetch()
  }, [])

  const checkAdminAndFetch = async () => {
    console.log("✅ Lancement de la vérification admin")
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      console.log("❌ Pas de session")
      return router.push("/login")
    }

    console.log("Session:", session)

    const { data: me, error } = await supabase
      .from("utilisateurs")
      .select("is_admin")
      .eq("id", session.user.id)
      .single()

    console.log("Résultat utilisateur:", me)
    console.log("Erreur utilisateur:", error)

    if (!me || !me.is_admin) {
      console.log("❌ Pas admin")
      return router.push("/dashboard")
    }

    fetchUsers()
  }

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("utilisateurs")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error) setUsers(data)
    setLoading(false)
  }

  const handleValidate = async (id) => {
    await supabase
      .from("utilisateurs")
      .update({ is_validated: true })
      .eq("id", id)

    fetchUsers()
  }

  const handleToggleAdmin = async (id, current) => {
    await supabase
      .from("utilisateurs")
      .update({ is_admin: !current })
      .eq("id", id)

    fetchUsers()
  }

  return (
    <div className="p-6">
      <AdminNavbar />

      <h1 className="text-2xl font-bold mb-4">👤 Gestion des utilisateurs</h1>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Validé</th>
              <th className="p-2 border">Admin</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="text-center border-t">
                <td className="p-2 border">{u.email}</td>
                <td className="p-2 border">
                  {u.is_validated ? "✅ Oui" : "❌ Non"}
                </td>
                <td className="p-2 border">
                  {u.is_admin ? "👑 Oui" : "—"}
                </td>
                <td className="p-2 border space-x-2">
                  {!u.is_validated && (
                    <button
                      className="text-sm bg-green-500 text-white px-2 py-1 rounded"
                      onClick={() => handleValidate(u.id)}
                    >
                      Valider
                    </button>
                  )}
                  <button
                    className="text-sm bg-blue-500 text-white px-2 py-1 rounded"
                    onClick={() => handleToggleAdmin(u.id, u.is_admin)}
                  >
                    {u.is_admin ? "Retirer Admin" : "Nommer Admin"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

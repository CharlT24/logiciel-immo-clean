import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"

export default function ListeUtilisateurs() {
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase.from("utilisateurs").select("*").order("created_at", { ascending: false })
      setUsers(data || [])
    }

    fetchUsers()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreate = async () => {
    if (!form.email || !form.password || !form.nom || !form.role) {
      return alert("Tous les champs sont obligatoires.")
    }

    setLoading(true)

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password
    })

    if (signUpError) {
      console.error(signUpError)
      return alert("Erreur de création de compte.")
    }

    const { error } = await supabase.from("utilisateurs").insert([
      {
        id: signUpData?.user?.id,
        email: form.email,
        nom: form.nom,
        role: form.role,
        telephone: form.telephone || "",
        actif: true
      }
    ])

    if (error) {
      console.error(error)
      return alert("Erreur lors de l’enregistrement dans la base.")
    }

    alert("✅ Utilisateur créé")
    router.reload()
  }

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cet utilisateur ?")) return

    await supabase.from("utilisateurs").delete().eq("id", id)
    alert("❌ Supprimé")
    setUsers(users.filter((u) => u.id !== id))
  }

  const handleActivate = async (id) => {
    await supabase.from("utilisateurs").update({ actif: true }).eq("id", id)
    alert("✅ Utilisateur activé")
    router.reload()
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-orange-600">👤 Gestion des utilisateurs</h1>

      <div className="bg-white p-6 rounded shadow space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">➕ Ajouter un utilisateur</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <input name="nom" onChange={handleChange} className="input" placeholder="Nom complet" />
          <input name="email" onChange={handleChange} className="input" placeholder="Email" />
          <input name="telephone" onChange={handleChange} className="input" placeholder="Téléphone (optionnel)" />
          <input name="password" onChange={handleChange} type="password" className="input" placeholder="Mot de passe" />
          <select name="role" onChange={handleChange} className="input">
            <option value="">Choisir un rôle</option>
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
          </select>
        </div>
        <button onClick={handleCreate} className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700" disabled={loading}>
          {loading ? "Création..." : "Créer l'utilisateur"}
        </button>
      </div>

      <div className="bg-white p-6 rounded shadow space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">👥 Utilisateurs existants</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2">Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Actif</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="py-2">{u.nom}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.actif ? "✅" : "❌"}</td>
                <td className="flex gap-2 items-center">
                  {!u.actif && (
                    <button onClick={() => handleActivate(u.id)} className="text-green-600 text-xs">Activer</button>
                  )}
                  <button onClick={() => handleDelete(u.id)} className="text-red-600 text-xs">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

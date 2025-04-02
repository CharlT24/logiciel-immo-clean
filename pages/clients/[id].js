import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"

export default function FicheClient() {
  const router = useRouter()
  const { id } = router.query
  const [client, setClient] = useState(null)
  const [biens, setBiens] = useState([])
  const [userId, setUserId] = useState(null)
  const [role, setRole] = useState("")
  const [loading, setLoading] = useState(true)

  // 🔐 Récupère l'utilisateur et son rôle
  useEffect(() => {
    const getUserAndRole = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const uid = session?.user?.id
      setUserId(uid)

      const { data: userData } = await supabase
        .from("utilisateurs")
        .select("role")
        .eq("id", uid)
        .single()

      setRole(userData?.role || "")
    }

    getUserAndRole()
  }, [])

  // 📦 Récupère les infos du client + biens correspondants
  useEffect(() => {
    if (!id) return
    const fetchClient = async () => {
      const { data, error } = await supabase.from("clients").select("*").eq("id", id).single()
      if (!error && data) {
        setClient(data)
        fetchBiens(data)
      }
      setLoading(false)
    }
    fetchClient()
  }, [id])

  const fetchBiens = async (client) => {
    const { data } = await supabase.from("biens").select("*").eq("disponibilite", true)
    const matchs = (data || []).filter((bien) => {
      const prixFAI = (bien.prix_vente || 0) + (bien.honoraires || 0)
      return (
        bien.ville?.toLowerCase().includes(client.ville_recherche?.toLowerCase() || "") &&
        (!client.type_bien || bien.type_bien?.toLowerCase().includes(client.type_bien.toLowerCase())) &&
        prixFAI >= (client.budget_min || 0) &&
        prixFAI <= (client.budget_max || Infinity)
      )
    })
    setBiens(matchs)
  }

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Voulez-vous vraiment supprimer ce client ? Cette action est irréversible.")
    if (!confirmDelete) return

    const { error } = await supabase.from("clients").delete().eq("id", id)
    if (error) {
      alert("❌ Erreur lors de la suppression")
    } else {
      alert("✅ Client supprimé")
      router.push("/clients")
    }
  }

  // ⏳ Tant que tout n’est pas chargé : pas d’affichage
  if (loading || !userId || role === "") {
    return <p className="text-center mt-10">Chargement de la fiche client...</p>
  }

  // ❌ Cas : client non trouvé (id incorrect, supprimé, etc.)
  if (!client) {
    return <p className="text-center text-red-600 mt-10">Client introuvable</p>
  }

  const isOwnerOrAdmin = userId === client.agent_id || role === "admin"

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 bg-white rounded-xl shadow space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-orange-600 flex items-center gap-3">
          👤 Fiche client : {client.nom}
          {role === "admin" && (
            <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-xs">Admin</span>
          )}
        </h1>

        <div className="flex gap-4 items-center">
          {isOwnerOrAdmin && (
            <Link href={`/clients/${id}/modifier`} className="text-sm text-orange-600 hover:underline">
              📝 Modifier
            </Link>
          )}
          {role === "admin" && (
            <button
              onClick={handleDelete}
              className="text-sm text-red-600 hover:underline"
            >
              🗑️ Supprimer
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
        <p><strong>📧 Email :</strong> {client.email}</p>
        <p><strong>📞 Téléphone :</strong> {client.telephone}</p>
        <p><strong>🏠 Type de bien :</strong> {client.type_bien || 'Non renseigné'}</p>
        <p><strong>📍 Ville recherchée :</strong> {client.ville_recherche || 'Non renseigné'}</p>
        <p><strong>💰 Budget :</strong> {client.budget_min?.toLocaleString()} € – {client.budget_max?.toLocaleString()} €</p>
        <p><strong>🧠 Profil :</strong> {client.profil || 'Non précisé'}</p>
        <p><strong>📲 Canal d’entrée :</strong> {client.canal_entree || 'Non précisé'}</p>
        <p className="md:col-span-2"><strong>📝 Notes :</strong> {client.notes || 'Aucune note'}</p>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800">🏡 Biens correspondants :</h2>
        {biens.length > 0 ? (
          <ul className="space-y-1 text-sm">
            {biens.map((bien) => (
              <li key={bien.id}>
                <Link href={`/biens/${bien.id}`} className="text-orange-700 hover:underline">
                  📍 {bien.titre} à {bien.ville} – {(bien.prix_vente + bien.honoraires).toLocaleString()} €
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">Aucun bien correspondant actuellement.</p>
        )}
      </div>
    </div>
  )
}

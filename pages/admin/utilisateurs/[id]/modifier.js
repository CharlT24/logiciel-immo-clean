// pages/admin/utilisateurs/[id]/modifier.js
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Image from "next/image"

export default function ModifierUtilisateur() {
  const router = useRouter()
  const { id } = router.query

  const [form, setForm] = useState({
    nom: "",
    email: "",
    telephone: "",
    ville: "",
    description: "",
    role: "",
    entreprise: "",
    secteur: "",
    statut: "",
    photo_url: ""
  })
  const [photoPreview, setPhotoPreview] = useState(null)

  useEffect(() => {
    if (!id) return
    const fetchUser = async () => {
      const { data, error } = await supabase.from("utilisateurs").select("*").eq("id", id).single()
      if (data) setForm(data)
    }
    fetchUser()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (file) => {
    const fileName = `${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from("avatars").upload(fileName, file, { upsert: true })

    if (!error) {
      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName)
      setForm((prev) => ({ ...prev, photo_url: data.publicUrl }))
    } else {
      console.error("Erreur upload image :", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const file = document.querySelector("#photo-upload")?.files?.[0]
    if (file) await handleImageUpload(file)

    const { error } = await supabase.from("utilisateurs").update(form).eq("id", id)
    if (!error) {
      alert("✅ Utilisateur mis à jour avec succès")
      router.push("/admin/utilisateurs")
    } else {
      console.error("❌ Erreur modification :", error)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow space-y-6">
      <h1 className="text-2xl font-bold text-orange-600">🛠 Modifier le profil de l'utilisateur</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* PHOTO */}
        <div className="col-span-2 flex items-center gap-4 mb-2">
          {form.photo_url && (
            <Image src={form.photo_url} alt="Photo" width={60} height={60} className="rounded-full" />
          )}
          <input type="file" id="photo-upload" accept="image/*" />
        </div>

        <input name="nom" value={form.nom} onChange={handleChange} placeholder="Nom complet" className="p-2 border rounded" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="p-2 border rounded" />
        <input name="telephone" value={form.telephone} onChange={handleChange} placeholder="Téléphone" className="p-2 border rounded" />
        <input name="ville" value={form.ville} onChange={handleChange} placeholder="Ville" className="p-2 border rounded" />
        <input name="entreprise" value={form.entreprise} onChange={handleChange} placeholder="Entreprise" className="p-2 border rounded" />
        <input name="secteur" value={form.secteur} onChange={handleChange} placeholder="Secteur" className="p-2 border rounded" />

        <select name="role" value={form.role} onChange={handleChange} className="p-2 border rounded">
          <option value="">Rôle</option>
          <option value="agent">Agent</option>
          <option value="admin">Admin</option>
        </select>

        <select name="statut" value={form.statut} onChange={handleChange} className="p-2 border rounded">
          <option value="">Statut</option>
          <option value="actif">Actif</option>
          <option value="inactif">Inactif</option>
        </select>

        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description..." rows={4} className="col-span-2 p-2 border rounded" />

        <button type="submit" className="col-span-2 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded">
          ✅ Enregistrer les modifications
        </button>
      </form>
    </div>
  )
}

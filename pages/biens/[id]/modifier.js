import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { v4 as uuidv4 } from "uuid"

const OPTIONS_LIST = [
  "Chauffage individuel", "Climatisation", "Double vitrage", "Fibre optique",
  "Jardin", "Terrasse", "Balcon", "Piscine", "Garage", "Cave", "Ascenseur",
  "Interphone", "Portail automatique", "Accès PMR", "Séjour lumineux",
  "Cuisine équipée", "Cuisine américaine", "Suite parentale",
  "Combles aménageables", "Alarme", "Vue dégagée", "Vue mer", "Parking",
  "Exposition Sud", "Exposition Est", "Exposition Nord", "Exposition Ouest",
  "Dernier étage", "Plain-pied"
]

export default function ModifierBien() {
  const router = useRouter()
  const { id } = router.query
  const [form, setForm] = useState({})
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState(null)
  const [role, setRole] = useState("")
  const [bien, setBien] = useState(null)

  // 🔐 Récupère user + rôle
  useEffect(() => {
    const fetchUser = async () => {
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

    fetchUser()
  }, [])

  // 📦 Charge le bien
  useEffect(() => {
    if (!id) return
    const fetchBien = async () => {
      const { data, error } = await supabase.from("biens").select("*").eq("id", id).single()
      if (error) {
        console.error("Erreur chargement bien :", error)
      } else {
        setBien(data)
        setForm(data)
        setOptions(data.options || [])
      }
      setLoading(false)
    }

    fetchBien()
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const val = type === "checkbox" ? checked : value
    setForm((prev) => ({ ...prev, [name]: val }))
  }

  const toggleOption = (opt) => {
    setOptions((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
    )
  }

  const handlePhotoUpload = async (e) => {
    const files = e.target.files
    const uploadedUrls = []

    for (const file of files) {
      const ext = file.name.split(".").pop()
      const fileName = `${uuidv4()}.${ext}`
      const filePath = `biens/${id}/${fileName}`

      const { error } = await supabase.storage.from("photos").upload(filePath, file)
      if (!error) {
        const { data } = supabase.storage.from("photos").getPublicUrl(filePath)
        uploadedUrls.push(data.publicUrl)
      }
    }

    const newPhotos = [...(form.photos || []), ...uploadedUrls]
    setForm((prev) => ({ ...prev, photos: newPhotos }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const updates = { ...form, options }

    const { error } = await supabase.from("biens").update(updates).eq("id", id)
    if (error) alert("❌ Erreur lors de la mise à jour")
    else alert("✅ Bien modifié avec succès")
  }

  // ⏳ Chargement
  if (loading) return <p className="text-center mt-10">Chargement en cours...</p>

  // 🚫 Bien introuvable
  if (!bien) return <p className="text-center text-red-600 mt-10">Bien introuvable ❌</p>

  // 🔐 Vérification des droits
  if (userId !== bien.agent_id && role !== "admin") {
    return (
      <div className="max-w-xl mx-auto mt-20 text-center text-red-600 font-semibold">
        🚫 Vous n’avez pas les droits pour modifier ce bien.
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-10">
      <h1 className="text-3xl font-bold text-orange-600 text-center">✏️ Modifier le bien</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 🏷️ Infos générales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="titre" value={form.titre || ''} onChange={handleChange} className="input" placeholder="Titre du bien" />
          <input name="type_bien" value={form.type_bien || ''} onChange={handleChange} className="input" placeholder="Type de bien" />
          <input name="ville" value={form.ville || ''} onChange={handleChange} className="input" placeholder="Ville" />
          <input name="code_postal" value={form.code_postal || ''} onChange={handleChange} className="input" placeholder="Code postal" />
          <input name="mandat" value={form.mandat || ''} onChange={handleChange} className="input" placeholder="Mandat" />
          <select name="statut" value={form.statut || ''} onChange={handleChange} className="input">
            <option value="">Statut du bien</option>
            <option value="disponible">Disponible</option>
            <option value="sous_compromis">Sous compromis</option>
            <option value="vendu">Vendu</option>
          </select>
        </div>

        {/* 📐 Détails techniques */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="surface_m2" value={form.surface_m2 || ''} onChange={handleChange} className="input" placeholder="Surface (m²)" />
          <input name="nb_pieces" value={form.nb_pieces || ''} onChange={handleChange} className="input" placeholder="Nombre de pièces" />
          <input name="nb_chambres" value={form.nb_chambres || ''} onChange={handleChange} className="input" placeholder="Chambres" />
          <input name="etage" value={form.etage || ''} onChange={handleChange} className="input" placeholder="Étage" />
          <input name="dpe" value={form.dpe || ''} onChange={handleChange} className="input" placeholder="DPE" />
          <input name="prix_vente" value={form.prix_vente || ''} onChange={handleChange} className="input" placeholder="Prix de vente (€)" />
          <input name="honoraires" value={form.honoraires || ''} onChange={handleChange} className="input" placeholder="Honoraires (€)" />
        </div>

        <div className="flex gap-6 text-sm">
          <label><input type="checkbox" name="charge_vendeur" checked={form.charge_vendeur || false} onChange={handleChange} /> Charge vendeur</label>
          <label><input type="checkbox" name="charge_acquereur" checked={form.charge_acquereur || false} onChange={handleChange} /> Charge acquéreur</label>
          <label><input type="checkbox" name="publie" checked={form.publie || false} onChange={handleChange} /> Publié</label>
        </div>

        {/* 📝 Description */}
        <textarea name="description" value={form.description || ''} onChange={handleChange} rows={4} className="w-full px-3 py-2 border rounded-md shadow-sm" placeholder="Description du bien"></textarea>

        {/* ✅ Options */}
        <div>
          <h2 className="font-semibold text-lg mb-2">Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {OPTIONS_LIST.map((opt) => (
              <label key={opt} className="bg-orange-50 p-2 rounded flex items-center gap-2">
                <input type="checkbox" checked={options.includes(opt)} onChange={() => toggleOption(opt)} />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 🖼️ Photos */}
        <div>
          <h2 className="font-semibold text-lg mb-2">Photos</h2>
          <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
            {(form.photos || []).map((url, idx) => (
              <img key={idx} src={url} alt={`photo-${idx}`} className="rounded-xl shadow object-cover w-full h-32" />
            ))}
          </div>
        </div>

        <div className="text-center">
          <button type="submit" className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 shadow">💾 Enregistrer les modifications</button>
        </div>
      </form>
    </div>
  )
}

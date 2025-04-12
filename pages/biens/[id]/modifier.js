import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"
import { v4 as uuidv4 } from "uuid"

const OPTIONS_LIST = [
  "Chauffage individuel", "Climatisation", "Double vitrage", "Fibre optique", "Jardin", "Terrasse", "Balcon", "Piscine",
  "Garage", "Cave", "Ascenseur", "Interphone", "Portail automatique", "Accès PMR", "Séjour lumineux",
  "Cuisine équipée", "Cuisine américaine", "Suite parentale", "Combles aménageables", "Alarme", "Vue dégagée",
  "Vue mer", "Parking", "Exposition Sud", "Exposition Est", "Exposition Nord", "Exposition Ouest", "Dernier étage", "Plain-pied"
]

export default function ModifierBien() {
  const router = useRouter()
  const { id } = router.query
  const [form, setForm] = useState({})
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [proprietaires, setProprietaires] = useState([])
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const uid = session?.user?.id
      setUserId(uid)
    }

    const fetchProprietaires = async () => {
      const { data } = await supabase.from("proprietaires").select("id, nom")
      setProprietaires(data || [])
    }

    fetchUser()
    fetchProprietaires()
  }, [])

  useEffect(() => {
    if (!id) return
    const fetchBien = async () => {
      const { data, error } = await supabase.from("biens").select("*").eq("id", id).single()
      if (!error) {
        setForm(data)
        setOptions(data.options || [])
      }
      setLoading(false)
    }
    fetchBien()
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
  }

  const toggleOption = (opt) => {
    setOptions((prev) => prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt])
  }

  const handleGalleryUpload = async (e) => {
    const files = e.target.files
    const newNames = []
    for (const file of files) {
      const ext = file.name.split(".").pop()
      const fileName = `${uuidv4()}.${ext}`
      const path = `gallery/${id}/${fileName}`
      const { error } = await supabase.storage.from("photos").upload(path, file)
      if (!error) newNames.push(fileName)
    }
    setForm((prev) => ({ ...prev, gallery: [...(prev.gallery || []), ...newNames] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const updates = { ...form, options }

    const { error } = await supabase.from("biens").update(updates).eq("id", id)

    if (form.statut === "Vendu" && form.client_id) {
      await supabase.from("biens").update({ proprietaire_id: form.client_id }).eq("id", id)
    }

    if (!error) {
      alert("✅ Bien mis à jour")
      router.push(`/biens/${id}`)
    } else {
      alert("❌ Erreur lors de la mise à jour")
    }
  }

  const coverUrl = `https://fkavtsofmglifzalclyn.supabase.co/storage/v1/object/public/photos/covers/${id}/cover.jpg`
  const galleryItems = (form.gallery || []).map((img) =>
    `https://fkavtsofmglifzalclyn.supabase.co/storage/v1/object/public/photos/gallery/${id}/${img}`
  )

  if (loading) return <p className="text-center mt-10">Chargement...</p>
  return (
    <div className="max-w-5xl mx-auto bg-white p-10 mt-10 rounded-xl shadow-lg space-y-10">
      <h1 className="text-3xl font-bold text-orange-600 text-center">✏️ Modifier le bien</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informations principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input name="titre" value={form.titre || ""} onChange={handleChange} className="input" placeholder="Titre du bien" />
          <input name="type_bien" value={form.type_bien || ""} onChange={handleChange} className="input" placeholder="Type de bien" />
          <input name="ville" value={form.ville || ""} onChange={handleChange} className="input" placeholder="Ville" />
          <input name="code_postal" value={form.code_postal || ""} onChange={handleChange} className="input" placeholder="Code postal" />
          <input name="mandat" value={form.mandat || ""} onChange={handleChange} className="input" placeholder="Numéro mandat" />
          <input type="date" name="date_debut_mandat" value={form.date_debut_mandat || ""} onChange={handleChange} className="input" placeholder="Date début mandat" />
          <input type="date" name="date_fin_mandat" value={form.date_fin_mandat || ""} onChange={handleChange} className="input" placeholder="Date fin mandat" />
          <select name="statut" value={form.statut || ""} onChange={handleChange} className="input">
            <option value="">Statut</option>
            <option value="Disponible">Disponible</option>
            <option value="Sous compromis">Sous compromis</option>
            <option value="Sous offre">Sous offre</option>
            <option value="Vendu">Vendu</option>
            <option value="Archivé">Archivé</option>
          </select>
        </div>

        {/* Vente / Location */}
        <div className="flex gap-6">
          <label className="text-sm"><input type="checkbox" name="vente" checked={form.vente || false} onChange={handleChange} className="mr-2" /> Vente</label>
          <label className="text-sm"><input type="checkbox" name="location" checked={form.location || false} onChange={handleChange} className="mr-2" /> Location</label>
        </div>

        {/* Prix & détails */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input name="surface_m2" value={form.surface_m2 || ""} onChange={handleChange} className="input" placeholder="Surface habitable (m²)" />
          <input name="nb_pieces" value={form.nb_pieces || ""} onChange={handleChange} className="input" placeholder="Nombre de pièces" />
          <input name="nb_chambres" value={form.nb_chambres || ""} onChange={handleChange} className="input" placeholder="Nombre de chambres" />
          <input name="etage" value={form.etage || ""} onChange={handleChange} className="input" placeholder="Étage" />
          <input name="dpe" value={form.dpe || ""} onChange={handleChange} className="input" placeholder="DPE" />
          <input name="prix_net_vendeur" value={form.prix_net_vendeur || ""} onChange={handleChange} className="input" placeholder="Prix net vendeur (€)" />
          <input name="honoraires" value={form.honoraires || ""} onChange={handleChange} className="input" placeholder="Honoraires (€)" />
          <input name="prix_vente" value={form.prix_vente || ""} onChange={handleChange} className="input" placeholder="Prix total affiché (€)" />
        </div>

        {/* Propriétaire */}
        <div>
          <label className="block font-semibold text-sm mb-1">Propriétaire</label>
          <select name="proprietaire_id" value={form.proprietaire_id || ""} onChange={handleChange} className="input">
            <option value="">-- Sélectionner un propriétaire --</option>
            {proprietaires.map(p => (
              <option key={p.id} value={p.id}>{p.nom}</option>
            ))}
          </select>
        </div>

        {/* Checkboxes */}
        <div className="flex gap-6 text-sm">
          <label><input type="checkbox" name="charge_vendeur" checked={form.charge_vendeur || false} onChange={handleChange} /> Charge vendeur</label>
          <label><input type="checkbox" name="charge_acquereur" checked={form.charge_acquereur || false} onChange={handleChange} /> Charge acquéreur</label>
          <label><input type="checkbox" name="publie" checked={form.publie || false} onChange={handleChange} /> Publié</label>
        </div>

        {/* Description */}
        <textarea name="description" value={form.description || ""} onChange={handleChange} className="w-full border rounded-md p-3 shadow-sm" rows={4} placeholder="Description du bien..."></textarea>

        {/* Galerie */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Photo principale</h2>
          <img src={coverUrl} alt="cover" className="rounded-xl shadow w-full max-h-[300px] object-cover" />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Galerie photo</h2>
          <input type="file" multiple accept="image/*" onChange={handleGalleryUpload} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
            {galleryItems.map((url, i) => (
              <img key={i} src={url} alt={`img-${i}`} className="w-full h-32 object-cover rounded-xl shadow" />
            ))}
          </div>
        </div>

        {/* Options */}
        <div>
          <h2 className="font-semibold text-lg mb-2">Équipements</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {OPTIONS_LIST.map((opt) => (
              <label key={opt} className="bg-orange-50 hover:bg-orange-100 p-2 rounded flex items-center gap-2 shadow-sm">
                <input type="checkbox" checked={options.includes(opt)} onChange={() => toggleOption(opt)} />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="text-center mt-6">
          <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded shadow-lg transition">
            💾 Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>
  )
}

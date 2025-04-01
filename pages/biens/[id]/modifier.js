import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

const OPTIONS_LIST = [
  "Chauffage individuel", "Climatisation", "Double vitrage", "Fibre optique",
  "Jardin", "Terrasse", "Balcon", "Piscine", "Garage", "Cave", "Ascenseur",
  "Interphone", "Portail automatique", "Accès PMR", "Séjour lumineux",
  "Cuisine équipée", "Cuisine américaine", "Suite parentale",
  "Combles aménageables", "Alarme", "Vue dégagée", "Vue mer", "Parking",
  "Exposition Sud", "Exposition Est", "Exposition Nord", "Exposition Ouest",
  "Dernier étage", "Plain-pied"
];

export default function ModifierBien() {
  const router = useRouter()
  const { id } = router.query
  const [bien, setBien] = useState(null)
  const [form, setForm] = useState({})
  const [options, setOptions] = useState([])

  useEffect(() => {
    if (id) fetchBien()
  }, [id])

  const fetchBien = async () => {
    const { data, error } = await supabase.from("biens").select("*").eq("id", id).single()
    if (error) console.error("Erreur chargement bien :", error)
    else {
      setBien(data)
      setForm(data)
      setOptions(data.options || [])
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const val = type === "checkbox" ? checked : value
    setForm((prev) => ({ ...prev, [name]: val }))
  }

  const toggleOption = (option) => {
    setOptions((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const updates = {
      ...form,
      options: options
    }
    const { error } = await supabase.from("biens").update(updates).eq("id", id)
    if (error) alert("❌ Erreur mise à jour")
    else alert("✅ Bien modifié avec succès")
  }

  if (!bien) return <p className="text-center mt-10">Chargement en cours...</p>

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow space-y-8">
      <h1 className="text-2xl font-bold text-orange-600">✏️ Modifier le bien</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bloc 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="titre" value={form.titre || ''} onChange={handleChange} className="input" placeholder="Titre du bien" />
          <input name="type_bien" value={form.type_bien || ''} onChange={handleChange} className="input" placeholder="Type de bien" />
          <input name="ville" value={form.ville || ''} onChange={handleChange} className="input" placeholder="Ville" />
          <input name="code_postal" value={form.code_postal || ''} onChange={handleChange} className="input" placeholder="Code postal" />
          <input name="mandat" value={form.mandat || ''} onChange={handleChange} className="input" placeholder="Mandat" />
          <input name="statut" value={form.statut || ''} onChange={handleChange} className="input" placeholder="Statut" />
        </div>

        {/* Bloc 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="surface_m2" value={form.surface_m2 || ''} onChange={handleChange} className="input" placeholder="Surface (m²)" />
          <input name="nb_pieces" value={form.nb_pieces || ''} onChange={handleChange} className="input" placeholder="Pièces" />
          <input name="nb_chambres" value={form.nb_chambres || ''} onChange={handleChange} className="input" placeholder="Chambres" />
          <input name="etage" value={form.etage || ''} onChange={handleChange} className="input" placeholder="Étage" />
          <input name="dpe" value={form.dpe || ''} onChange={handleChange} className="input" placeholder="DPE" />
          <input name="prix_vente" value={form.prix_vente || ''} onChange={handleChange} className="input" placeholder="Prix de vente (€)" />
          <input name="honoraires" value={form.honoraires || ''} onChange={handleChange} className="input" placeholder="Honoraires (€)" />
        </div>

        <div className="flex gap-6 text-sm">
          <label><input type="checkbox" name="charge_vendeur" checked={form.charge_vendeur || false} onChange={handleChange} /> Charge vendeur</label>
          <label><input type="checkbox" name="charge_acquereur" checked={form.charge_acquereur || false} onChange={handleChange} /> Charge acquéreur</label>
        </div>

        <textarea name="description" value={form.description || ''} onChange={handleChange} rows={4} className="w-full px-3 py-2 border rounded-md shadow-sm" placeholder="Description du bien"></textarea>

        {/* Bloc 4 : Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {OPTIONS_LIST.map((opt) => (
            <label key={opt} className="bg-orange-50 p-2 rounded flex items-center gap-2">
              <input
                type="checkbox"
                checked={options.includes(opt)}
                onChange={() => toggleOption(opt)}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>

        <div className="text-right">
          <button type="submit" className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700">💾 Enregistrer</button>
        </div>
      </form>
    </div>
  )
}

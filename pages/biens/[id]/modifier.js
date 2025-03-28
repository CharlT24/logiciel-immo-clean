// pages/biens/[id]/modifier.js
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function ModifierBien() {
  const router = useRouter()
  const { id } = router.query

  const [bien, setBien] = useState(null)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const fetchBien = async () => {
      const { data, error } = await supabase.from("biens").select("*").eq("id", id).single()
      if (error) console.error("❌ Erreur :", error)
      setBien(data)
      setFormData(data)
      setLoading(false)
    }

    fetchBien()
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from("biens").update(formData).eq("id", id)
    if (error) {
      console.error("❌ Erreur mise à jour :", error)
      alert("Erreur lors de la mise à jour.")
    } else {
      alert("✅ Bien modifié avec succès")
      router.push(`/biens/${id}`)
    }
  }

  if (loading) return <p className="p-8 text-gray-600">Chargement du bien...</p>
  if (!bien) return <p className="p-8 text-red-500">Bien introuvable</p>

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-orange-700 mb-6">✏️ Modifier le bien</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-4">

        <Input label="Titre" name="titre" value={formData.titre} onChange={handleChange} />
        <Input label="Ville" name="ville" value={formData.ville} onChange={handleChange} />
        <Input label="Surface (m²)" name="surface_m2" type="number" value={formData.surface_m2} onChange={handleChange} />
        <Input label="Prix (€)" name="prix" type="number" value={formData.prix} onChange={handleChange} />
        <Input label="DPE" name="dpe" value={formData.dpe} onChange={handleChange} />
        <Input label="Honoraires (€)" name="honoraires" type="number" value={formData.honoraires} onChange={handleChange} />

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            rows="4"
          />
        </div>

        {/* Checkboxes */}
        <Checkbox label="Disponible" name="disponible" checked={formData.disponible} onChange={handleChange} />
        <Checkbox label="Sous compromis" name="sous_compromis" checked={formData.sous_compromis} onChange={handleChange} />
        <Checkbox label="Vendu" name="vendu" checked={formData.vendu} onChange={handleChange} />
        <Checkbox label="Exporter sur LeBonCoin" name="export_leboncoin" checked={formData.export_leboncoin} onChange={handleChange} />
        <Checkbox label="Exporter sur SeLoger" name="export_seloger" checked={formData.export_seloger} onChange={handleChange} />

        <button
          type="submit"
          className="bg-orange-600 text-white font-semibold px-6 py-2 rounded hover:bg-orange-700"
        >
          💾 Enregistrer
        </button>
      </form>
    </div>
  )
}

function Input({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1 text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full border rounded px-3 py-2"
        required
      />
    </div>
  )
}

function Checkbox({ label, name, checked, onChange }) {
  return (
    <div className="flex items-center space-x-2">
      <input type="checkbox" name={name} checked={checked || false} onChange={onChange} />
      <label className="text-sm text-gray-700">{label}</label>
    </div>
  )
}

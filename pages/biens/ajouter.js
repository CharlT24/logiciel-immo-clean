import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"

export default function AjouterBien() {
  const [form, setForm] = useState({
    titre: "",
    ville: "",
    surface_m2: "",
    prix: "",
    dpe: "",
    description: "",
    disponible: true,
    sous_compromis: false,
    vendu: false,
    export_leboncoin: false,
    export_seloger: false,
  })

  const [userId, setUserId] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return router.push("/login")
      setUserId(session.user.id)
    }
    getSession()
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === "checkbox" ? checked : value })
  }

  const handleImageUpload = async (file, bienId) => {
    const fileName = `${bienId}/main.jpg`
    const { error } = await supabase.storage
      .from("photos-biens")
      .upload(fileName, file, { upsert: true })

    if (error) console.error("Erreur upload image :", error)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { data, error } = await supabase.from("biens").insert([{
      ...form,
      prix: Number(form.prix),
      surface_m2: Number(form.surface_m2),
      agent_id: userId,
    }]).select().single()

    if (error) {
      alert("❌ Erreur à l’insertion")
      console.error(error)
    } else {
      const file = document.querySelector("#photo-upload")?.files?.[0]
      if (file) await handleImageUpload(file, data.id)
      alert("✅ Bien ajouté avec succès")
      router.push("/biens")
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white mt-8 rounded shadow space-y-4">
      <h1 className="text-2xl font-bold mb-4">➕ Ajouter un bien</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="titre" value={form.titre} onChange={handleChange} placeholder="Titre" className="w-full p-2 border rounded" />
        <input name="ville" value={form.ville} onChange={handleChange} placeholder="Ville" className="w-full p-2 border rounded" />
        <input type="number" name="prix" value={form.prix} onChange={handleChange} placeholder="Prix (€)" className="w-full p-2 border rounded" />
        <input type="number" name="surface_m2" value={form.surface_m2} onChange={handleChange} placeholder="Surface (m²)" className="w-full p-2 border rounded" />
        <input name="dpe" value={form.dpe} onChange={handleChange} placeholder="DPE" className="w-full p-2 border rounded" />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description complète"
          rows="4"
          className="w-full p-2 border rounded"
        />

        <input id="photo-upload" type="file" accept="image/*" className="block mt-2" />

        <div className="flex flex-col gap-2">
          <label><input type="checkbox" name="disponible" checked={form.disponible} onChange={handleChange} /> Disponible</label>
          <label><input type="checkbox" name="sous_compromis" checked={form.sous_compromis} onChange={handleChange} /> Sous compromis</label>
          <label><input type="checkbox" name="vendu" checked={form.vendu} onChange={handleChange} /> Vendu</label>
        </div>

        <div className="border-t pt-4 mt-4">
          <p className="font-semibold mb-2">🌐 Export :</p>
          <label><input type="checkbox" name="export_leboncoin" checked={form.export_leboncoin} onChange={handleChange} /> LeBonCoin</label><br />
          <label><input type="checkbox" name="export_seloger" checked={form.export_seloger} onChange={handleChange} /> SeLoger</label>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">💾 Ajouter</button>
      </form>
    </div>
  )
}

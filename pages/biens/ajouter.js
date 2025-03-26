import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"

export default function AjouterBien() {
  const [form, setForm] = useState({
    titre: "",
    ville: "",
    prix: "",
    surface_m2: "",
    dpe: "",
    honoraires: "",
    description: "",
    disponible: true,
    sous_compromis: false,
    vendu: false,
    export_leboncoin: false,
    export_seloger: false,
  })

  const [agentId, setAgentId] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setAgentId(session.user.id)
      } else {
        router.push("/login")
      }
    }
    getSession()
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === "checkbox" ? checked : value })
  }

  const handleImageUpload = async (file, bienId) => {
    const filePath = `${bienId}/main.jpg`
    const { error } = await supabase.storage
      .from("photos-biens")
      .upload(filePath, file, { upsert: true })

    if (error) {
      console.error("❌ Erreur upload image :", error)
    } else {
      console.log("✅ Image uploadée")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!agentId) {
      alert("Utilisateur non connecté.")
      return
    }

    const bienData = {
      ...form,
      agent_id: agentId,
      prix: Number(form.prix),
      surface_m2: Number(form.surface_m2),
      honoraires: Number(form.honoraires),
    }

    console.log("📤 Données envoyées à Supabase :", bienData)

    const { error: insertError } = await supabase.from("biens").insert([bienData])

    if (insertError) {
      console.error("❌ Erreur Supabase :", insertError)
      alert("❌ Erreur à l’insertion")
      return
    }

    // 🔍 Récupérer le dernier bien créé pour cet agent
    const { data: derniersBiens, error: fetchError } = await supabase
      .from("biens")
      .select("id")
      .eq("agent_id", agentId)
      .order("created_at", { ascending: false })
      .limit(1)

    if (fetchError || !derniersBiens || derniersBiens.length === 0) {
      console.warn("⚠️ Bien ajouté mais ID non trouvé pour upload image.")
      alert("✅ Bien ajouté (image non liée)")
      router.push("/biens")
      return
    }

    const bienId = derniersBiens[0].id
    const file = document.querySelector("#photo-upload")?.files?.[0]
    if (file && bienId) await handleImageUpload(file, bienId)

    alert("✅ Bien ajouté avec succès")
    router.push("/biens")
  }

  return (
    <div className="max-w-2xl mx-auto p-6 mt-8 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">➕ Ajouter un bien</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="titre" value={form.titre} onChange={handleChange} placeholder="Titre" required className="w-full p-2 border rounded" />
        <input name="ville" value={form.ville} onChange={handleChange} placeholder="Ville" required className="w-full p-2 border rounded" />
        <input type="number" name="prix" value={form.prix} onChange={handleChange} placeholder="Prix (€)" required className="w-full p-2 border rounded" />
        <input type="number" name="surface_m2" value={form.surface_m2} onChange={handleChange} placeholder="Surface (m²)" required className="w-full p-2 border rounded" />
        <input name="dpe" value={form.dpe} onChange={handleChange} placeholder="DPE" className="w-full p-2 border rounded" />
        <input type="number" name="honoraires" value={form.honoraires} onChange={handleChange} placeholder="Honoraires (€)" required className="w-full p-2 border rounded" />

        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description (optionnelle)" rows="4" className="w-full p-2 border rounded" />

        <input id="photo-upload" type="file" accept="image/*" className="block mt-2" />

        <div className="grid grid-cols-2 gap-4 mt-4">
          <label><input type="checkbox" name="disponible" checked={form.disponible} onChange={handleChange} /> Disponible</label>
          <label><input type="checkbox" name="sous_compromis" checked={form.sous_compromis} onChange={handleChange} /> Sous compromis</label>
          <label><input type="checkbox" name="vendu" checked={form.vendu} onChange={handleChange} /> Vendu</label>
        </div>

        <div className="border-t pt-4 mt-4">
          <p className="font-semibold mb-2">🌐 Export :</p>
          <label><input type="checkbox" name="export_leboncoin" checked={form.export_leboncoin} onChange={handleChange} /> LeBonCoin</label><br />
          <label><input type="checkbox" name="export_seloger" checked={form.export_seloger} onChange={handleChange} /> SeLoger</label>
        </div>

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-4">
          💾 Enregistrer le bien
        </button>
      </form>
    </div>
  )
}

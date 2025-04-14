import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"

export default function Etape5() {
  const router = useRouter()
  const [proprietaires, setProprietaires] = useState([
    {
      nom: "",
      prenom: "",
      telephone: "",
      email: "",
      adresse_principale: "",
      adresse_differente: "",
      numero_mandat: "",
      date_debut_mandat: "",
      date_fin_mandat: ""
    }
  ])

  const [loading, setLoading] = useState(false)

  const handleChange = (index, field, value) => {
    const updated = [...proprietaires]
    updated[index][field] = value
    setProprietaires(updated)
  }

  const ajouterProprietaire = () => {
    setProprietaires((prev) => [
      ...prev,
      {
        nom: "",
        prenom: "",
        telephone: "",
        email: "",
        adresse_principale: "",
        adresse_differente: "",
        numero_mandat: "",
        date_debut_mandat: "",
        date_fin_mandat: ""
      }
    ])
  }

  const enregistrerProprietaires = async (bienId) => {
    for (const proprietaire of proprietaires) {
      if (!proprietaire.nom && !proprietaire.telephone && !proprietaire.email) {
        console.warn("⚠️ Propriétaire ignoré (vide)")
        continue
      }

      const { error } = await supabase.from("proprietaires").insert({
        ...proprietaire,
        bien_id: bienId,
      })

      if (error) {
        console.error("❌ Erreur insertion propriétaire :", error)
        alert("Erreur lors de l'enregistrement d'un propriétaire.")
        return false
      }
    }

    return true
  }

  const handleFinalSubmit = async () => {
    setLoading(true)
    const id = router.query.id
    if (!id) return

    const inserted = await enregistrerProprietaires(id)
    if (!inserted) {
      setLoading(false)
      return
    }

    // Récupération du bien
    const { data: bien, error } = await supabase
      .from("biens")
      .select("*")
      .eq("id", id)
      .single()

    if (error || !bien) {
      console.error("❌ Erreur Supabase :", error)
      alert("Erreur de récupération du bien")
      setLoading(false)
      router.push("/biens")
      return
    }

    const coverUrl = `https://fkavtsofmglifzalclyn.supabase.co/storage/v1/object/public/photos/covers/${id}/cover.jpg`
    const { data: galleryData } = await supabase.storage.from("photos").list(`gallery/${id}`)
    const gallery = galleryData?.map(photo => `https://fkavtsofmglifzalclyn.supabase.co/storage/v1/object/public/photos/gallery/${id}/${photo.name}`) || []

    const payload = { ...bien, cover: coverUrl, gallery }

    fetch("http://localhost/wordpress/wp-json/oi/v1/biens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(response => {
        console.log("✅ Bien envoyé à WordPress :", response)
      })
      .catch(err => {
        console.error("❌ Erreur WordPress :", err)
        alert("Erreur lors de l'envoi à WordPress")
      })
      .finally(() => {
        setLoading(false)
        router.push("/biens")
      })
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-10 mt-10 rounded-xl shadow space-y-8">
      <h1 className="text-3xl font-bold text-orange-600">👤 Étape 5 : Informations propriétaires</h1>

      {proprietaires.map((prop, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-lg p-4 bg-orange-50">
          <Input label="Nom" value={prop.nom} onChange={(val) => handleChange(index, "nom", val)} />
          <Input label="Prénom" value={prop.prenom} onChange={(val) => handleChange(index, "prenom", val)} />
          <Input label="Téléphone" value={prop.telephone} onChange={(val) => handleChange(index, "telephone", val)} />
          <Input label="Email" value={prop.email} onChange={(val) => handleChange(index, "email", val)} />
          <Input label="Adresse principale" value={prop.adresse_principale} onChange={(val) => handleChange(index, "adresse_principale", val)} />
          <Input label="Adresse différente (facultative)" value={prop.adresse_differente} onChange={(val) => handleChange(index, "adresse_differente", val)} />
          <Input label="Numéro de mandat" value={prop.numero_mandat} onChange={(val) => handleChange(index, "numero_mandat", val)} />
          <Input label="Date début mandat" value={prop.date_debut_mandat} onChange={(val) => handleChange(index, "date_debut_mandat", val)} type="date" />
          <Input label="Date fin mandat" value={prop.date_fin_mandat} onChange={(val) => handleChange(index, "date_fin_mandat", val)} type="date" />
        </div>
      ))}

      <div className="text-right">
        <button onClick={ajouterProprietaire} className="text-sm text-orange-600 hover:underline">
          ➕ Ajouter un autre propriétaire
        </button>
      </div>

      <div className="flex justify-center gap-6 pt-6">
        <button
          onClick={handleFinalSubmit}
          disabled={loading}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded shadow"
        >
          {loading ? "Enregistrement..." : "✅ Finaliser et envoyer"}
        </button>
      </div>
    </div>
  )
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2"
      />
    </div>
  )
}

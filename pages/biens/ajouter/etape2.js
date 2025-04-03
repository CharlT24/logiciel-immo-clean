import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"

export default function Etape2() {
  const router = useRouter()
  const { id } = router.query

  const [formData, setFormData] = useState({
    surface_m2: "",
    nb_pieces: "",
    nb_chambres: "",
    etage: "",
    dpe: "D",
    dpe_conso_indice: "",
    dpe_ges_indice: "",
    energie_finale_kwh: "",
    dpe_cout_min: "",
    dpe_cout_max: "",
    type_chauffage: "",
    mode_chauffage: "",
    annee_construction: "",
    surface_terrain: "",
    surface_carrez: "",
    prix_vente: "",
    prix_net_vendeur: "",
    honoraires: "",
    pourcentage_honoraires: "",
    taxe_fonciere: "",
    quote_part_charges: "",
    fonds_travaux: "",
    charge_vendeur: false,
    charge_acquereur: false,
    description: ""
  })
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const updates = {
      ...formData,
      surface_m2: parseFloat(formData.surface_m2),
      nb_pieces: parseInt(formData.nb_pieces),
      nb_chambres: parseInt(formData.nb_chambres),
      prix_vente: parseFloat(formData.prix_vente),
      prix_net_vendeur: parseFloat(formData.prix_net_vendeur),
      honoraires: parseFloat(formData.honoraires),
      pourcentage_honoraires: parseFloat(formData.pourcentage_honoraires),
      dpe_cout_min: parseInt(formData.dpe_cout_min),
      dpe_cout_max: parseInt(formData.dpe_cout_max),
      energie_finale_kwh: parseInt(formData.energie_finale_kwh),
      taxe_fonciere: parseInt(formData.taxe_fonciere),
      quote_part_charges: parseInt(formData.quote_part_charges),
      fonds_travaux: parseInt(formData.fonds_travaux)
    }

    const { error } = await supabase.from("biens").update(updates).eq("id", id)
    if (error) {
      console.error("❌ Erreur Supabase :", error)
      setError("Erreur lors de la mise à jour")
    } else {
      router.push(`/biens/ajouter/etape3?id=${id}`)
    }
  }

  const prixNet = parseFloat(formData.prix_net_vendeur) || 0
  const frais = parseFloat(formData.honoraires) || 0
  const total = prixNet + frais

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-10 mt-10 space-y-6 border">
      <h1 className="text-3xl font-bold text-orange-600">📐 Étape 2 : Caractéristiques détaillées</h1>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        {/* Bloc Surface / pièces */}
        <Input label="Surface (m²)" name="surface_m2" value={formData.surface_m2} onChange={handleChange} required />
        <Input label="Surface terrain (m²)" name="surface_terrain" value={formData.surface_terrain} onChange={handleChange} />
        <Input label="Surface Carrez" name="surface_carrez" value={formData.surface_carrez} onChange={handleChange} />
        <Input label="Nombre de pièces" name="nb_pieces" value={formData.nb_pieces} onChange={handleChange} required />
        <Input label="Nombre de chambres" name="nb_chambres" value={formData.nb_chambres} onChange={handleChange} />
        <Input label="Étage" name="etage" value={formData.etage} onChange={handleChange} />

        {/* Bloc DPE */}
        <Select label="DPE" name="dpe" value={formData.dpe} onChange={handleChange} options={["A", "B", "C", "D", "E", "F", "G"]} />
        <Input label="Indice consommation" name="dpe_conso_indice" value={formData.dpe_conso_indice} onChange={handleChange} />
        <Input label="Indice GES" name="dpe_ges_indice" value={formData.dpe_ges_indice} onChange={handleChange} />
        <Input label="Énergie finale (kWh)" name="energie_finale_kwh" value={formData.energie_finale_kwh} onChange={handleChange} />
        <Input label="Coût min DPE (€)" name="dpe_cout_min" value={formData.dpe_cout_min} onChange={handleChange} />
        <Input label="Coût max DPE (€)" name="dpe_cout_max" value={formData.dpe_cout_max} onChange={handleChange} />

        {/* Chauffage / construction */}
        <Input label="Type de chauffage" name="type_chauffage" value={formData.type_chauffage} onChange={handleChange} />
        <Input label="Mode de chauffage" name="mode_chauffage" value={formData.mode_chauffage} onChange={handleChange} />
        <Input label="Année de construction" name="annee_construction" value={formData.annee_construction} onChange={handleChange} />

        {/* Bloc prix */}
        <Input label="Prix net vendeur (€)" name="prix_net_vendeur" value={formData.prix_net_vendeur} onChange={handleChange} />
        <Input label="Honoraires (€)" name="honoraires" value={formData.honoraires} onChange={handleChange} />
        <Input label="% Honoraires" name="pourcentage_honoraires" value={formData.pourcentage_honoraires} onChange={handleChange} />
        <Input label="💰 Prix total affiché (€)" name="prix_vente" value={formData.prix_vente} onChange={handleChange} required />
        <Input label="Taxe foncière (€)" name="taxe_fonciere" value={formData.taxe_fonciere} onChange={handleChange} />
        <Input label="Quote-part annuelle (€)" name="quote_part_charges" value={formData.quote_part_charges} onChange={handleChange} />
        <Input label="Fonds travaux (€)" name="fonds_travaux" value={formData.fonds_travaux} onChange={handleChange} />

        {/* Checkboxes */}
        <div className="col-span-full space-x-4">
          <label className="inline-flex items-center">
            <input type="checkbox" name="charge_vendeur" checked={formData.charge_vendeur} onChange={handleChange} className="mr-2" /> Vendeur
          </label>
          <label className="inline-flex items-center">
            <input type="checkbox" name="charge_acquereur" checked={formData.charge_acquereur} onChange={handleChange} className="mr-2" /> Acquéreur
          </label>
        </div>

        {/* Description */}
        <div className="col-span-full">
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Description du bien..."
          />
          <p className="text-sm text-gray-500 mt-1">
            🔒 Cette phrase sera ajoutée automatiquement : <br />
            <em>Les informations sur les risques auxquels ce bien est exposé sont disponibles sur le site <a href="https://www.georisques.gouv.fr" target="_blank" className="underline text-orange-600">Géorisques</a>.</em>
          </p>
        </div>

        <div className="col-span-full flex justify-between items-center mt-6">
          <Link href={`/biens/ajouter/etape1?id=${id}`} className="text-sm text-orange-600 hover:underline">
            ⬅️ Retour étape 1
          </Link>
          <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded font-semibold">
            ➡️ Étape suivante
          </button>
        </div>
      </form>
    </div>
  )
}

function Input({ label, name, value, onChange, required = false }) {
  return (
    <div>
      <label className="block font-medium text-sm mb-1">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border border-gray-300 rounded px-3 py-2"
        type="text"
      />
    </div>
  )
}

function Select({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block font-medium text-sm mb-1">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded px-3 py-2"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  )
}

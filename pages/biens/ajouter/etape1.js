import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"

export default function Etape1() {
  const router = useRouter()
  const [agentId, setAgentId] = useState(null)
  const [loading, setLoading] = useState(true)

  const [titre, setTitre] = useState("")
  const [typeBien, setTypeBien] = useState("")
  const [mandat, setMandat] = useState("")
  const [statut, setStatut] = useState("Disponible")
  const [ville, setVille] = useState("")
  const [cp, setCp] = useState("")
  const [vente, setVente] = useState(false)
  const [location, setLocation] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const id = session?.user?.id
      if (!id) {
        alert("Erreur : utilisateur non connecté")
        router.push("/login")
      } else {
        setAgentId(id)
        setLoading(false)
      }
    }
    getUser()
  }, [])

  const handleSubmit = async () => {
    if (!agentId) return alert("Chargement utilisateur en cours…")

    const newBien = {
      titre,
      type_bien: typeBien,
      mandat,
      statut,
      ville,
      code_postal: cp,
      vente,
      location,
      agent_id: agentId,
    }

    const { data, error } = await supabase
      .from("biens")
      .insert([newBien])
      .select()

    if (error) {
      console.error("❌ Erreur Supabase :", error)
      alert("Erreur à l’enregistrement du bien")
    } else {
      const insertedBien = data?.[0]
      if (!insertedBien) return alert("Erreur : bien non inséré")

      // ✅ Recalcul des rapprochements automatique
      const { error: rpcError } = await supabase.rpc("recalcul_rapprochements")
      if (rpcError) {
        console.warn("⚠️ Bien créé, mais rapprochement non recalculé :", rpcError)
      }

      const id = insertedBien.id
      router.push(`/biens/ajouter/etape2?id=${id}`)
    }
  }

  if (loading) return <p className="text-center mt-10">Chargement...</p>

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 mt-10 rounded-xl shadow space-y-6 border">
      <h1 className="text-2xl font-bold text-orange-600">📝 Étape 1 : Localisation & type de bien</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold">Titre du bien</label>
          <input type="text" className="input" value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Ex: Maison avec jardin" />
        </div>

        <div>
          <label className="text-sm font-semibold">Type de bien</label>
          <select className="input" value={typeBien} onChange={(e) => setTypeBien(e.target.value)}>
            <option value="">-- Sélectionner --</option>
            <option value="Maison">Maison</option>
            <option value="Appartement">Appartement</option>
            <option value="Immeuble">Immeuble</option>
            <option value="Terrain">Terrain</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold">Ville</label>
          <input type="text" className="input" value={ville} onChange={(e) => setVille(e.target.value)} placeholder="Ex: Bordeaux" />
        </div>

        <div>
          <label className="text-sm font-semibold">Code postal</label>
          <input type="text" className="input" value={cp} onChange={(e) => setCp(e.target.value)} placeholder="Ex: 33000" />
        </div>

        <div>
          <label className="text-sm font-semibold">Type de mandat</label>
          <select className="input" value={mandat} onChange={(e) => setMandat(e.target.value)}>
            <option value="">-- Choisir --</option>
            <option value="Exclusif">Exclusif</option>
            <option value="Simple">Simple</option>
            <option value="Mandat de recherche">Mandat de recherche</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold">Statut du bien</label>
          <select className="input" value={statut} onChange={(e) => setStatut(e.target.value)}>
            <option value="Disponible">Disponible</option>
            <option value="Sous compromis">Sous compromis</option>
            <option value="Vendu">Vendu</option>
          </select>
        </div>

        <div className="md:col-span-2 flex gap-6 items-center">
          <label className="inline-flex items-center">
            <input type="checkbox" checked={vente} onChange={(e) => setVente(e.target.checked)} className="mr-2" />
            Vente
          </label>
          <label className="inline-flex items-center">
            <input type="checkbox" checked={location} onChange={(e) => setLocation(e.target.checked)} className="mr-2" />
            Location
          </label>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span></span>
        <button
          onClick={handleSubmit}
          className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 transition"
        >
          ✅ Enregistrer et passer à l’étape 2
        </button>
      </div>
    </div>
  )
}

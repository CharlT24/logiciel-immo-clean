import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { saveAs } from "file-saver"
import Papa from "papaparse"

export default function ExportBiens() {
  const [biens, setBiens] = useState([])

  useEffect(() => {
    const fetchBiens = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data } = await supabase
        .from("biens")
        .select("*")
        .eq("agent_id", session.user.id)

      setBiens(data || [])
    }

    fetchBiens()
  }, [])

  const exportCSV = () => {
    if (biens.length === 0) return alert("Aucun bien à exporter.")
    
    const csv = Papa.unparse(
      biens.map(b => ({
        Titre: b.titre,
        Ville: b.ville,
        Surface: b.surface_m2,
        Prix: b.prix,
        DPE: b.dpe,
        Statut: b.vendu ? "Vendu" : b.sous_compromis ? "Sous compromis" : b.disponible ? "Disponible" : "Non dispo"
      }))
    )

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    saveAs(blob, "biens_export.csv")
  }

  const exportXML = () => {
    if (biens.length === 0) return alert("Aucun bien à exporter.")

    const xmlItems = biens.map((b) => `
  <bien>
    <titre>${b.titre}</titre>
    <ville>${b.ville}</ville>
    <surface>${b.surface_m2}</surface>
    <prix>${b.prix}</prix>
    <dpe>${b.dpe}</dpe>
    <statut>${b.vendu ? "Vendu" : b.sous_compromis ? "Sous compromis" : b.disponible ? "Disponible" : "Indisponible"}</statut>
  </bien>
    `).join("")

    const fullXml = `<?xml version="1.0" encoding="UTF-8"?>
<biens>
${xmlItems}
</biens>`

    const blob = new Blob([fullXml], { type: "application/xml;charset=utf-8;" })
    saveAs(blob, "biens_export.xml")
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">📤 Export de mes biens</h1>
      <p className="mb-6 text-gray-600">Tu peux exporter tes biens au format Excel (CSV) ou pour portails (XML)</p>

      <div className="flex gap-4">
        <button onClick={exportCSV} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          📄 Exporter CSV
        </button>
        <button onClick={exportXML} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          🗂️ Exporter XML
        </button>
      </div>
    </div>
  )
}

import { supabase } from "@/lib/supabaseClient"

export default async function handler(req, res) {
  const { data: biens, error } = await supabase
    .from("biens")
    .select("*")
    .eq("disponible", true)
    .eq("export_bienici", true)

  if (error) {
    return res.status(500).json({ error: "Erreur Supabase" })
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<biens>
${biens.map(bien => `
  <bien>
    <nom>${bien.titre}</nom>
    <ville>${bien.ville}</ville>
    <prix>${bien.prix}</prix>
    <surface>${bien.surface_m2}</surface>
    <dpe>${bien.dpe || "NC"}</dpe>
    <details>${bien.description || "Référencement via Logiciel Immo."}</details>
  </bien>
`).join("\n")}
</biens>
`

  res.setHeader("Content-Type", "application/xml")
  return res.status(200).send(xml)
}

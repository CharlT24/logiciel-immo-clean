import { supabase } from "@/lib/supabaseClient"

export default async function handler(req, res) {
  const { data: biens, error } = await supabase
    .from("biens")
    .select("*")
    .eq("disponible", true)
    .eq("export_leboncoin", true)

  if (error) {
    return res.status(500).json({ error: "Erreur Supabase" })
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<annonces>
${biens.map(bien => `
  <annonce>
    <titre>${bien.titre}</titre>
    <ville>${bien.ville}</ville>
    <prix>${bien.prix}</prix>
    <surface>${bien.surface_m2}</surface>
    <dpe>${bien.dpe || "NC"}</dpe>
    <description>${bien.description || "Bien proposé via Logiciel Immo."}</description>
  </annonce>
`).join("\n")}
</annonces>
`

  res.setHeader("Content-Type", "application/xml")
  return res.status(200).send(xml)
}

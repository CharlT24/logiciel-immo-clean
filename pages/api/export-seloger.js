import { supabase } from "@/lib/supabaseClient"

export default async function handler(req, res) {
  const { data: biens, error } = await supabase
    .from("biens")
    .select("*")
    .eq("disponible", true)
    .eq("export_seloger", true)

  if (error) {
    return res.status(500).json({ error: "Erreur Supabase" })
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<liste_annonces>
${biens.map(bien => `
  <annonce>
    <titre>${bien.titre}</titre>
    <localisation>${bien.ville}</localisation>
    <prix>${bien.prix}</prix>
    <surface>${bien.surface_m2}</surface>
    <classe_energie>${bien.dpe || "NC"}</classe_energie>
    <texte>${bien.description || "Bien référencé via Logiciel Immo."}</texte>
  </annonce>
`).join("\n")}
</liste_annonces>
`

  res.setHeader("Content-Type", "application/xml")
  return res.status(200).send(xml)
}

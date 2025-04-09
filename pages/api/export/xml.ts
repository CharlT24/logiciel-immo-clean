import { supabase } from "@/lib/supabaseClient"
import { generateXML } from "@/lib/exports/generateXML"

export default async function handler(req, res) {
  const { portail = "leboncoin" } = req.query

  const { data: biens, error } = await supabase
    .from("biens")
    .select("*")
    .eq("disponible", true)
    .eq("export_leboncoin", true)

  if (error) {
    return res.status(500).json({ error: "Erreur Supabase" })
  }

  try {
    const xml = generateXML(portail, biens)
    res.setHeader("Content-Type", "application/xml")
    res.status(200).send(xml)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

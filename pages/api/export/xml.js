import { supabase } from "@/lib/supabaseClient"
import { generateXML } from "@/utils/xmlGenerator"
import { getSettings } from "@/utils/getSettings"

export default async function handler(req, res) {
  const { data: biens } = await supabase.from("biens").select("*")
  const settings = await getSettings()

  // Liste des portails actifs : clé = portail_xxx, valeur = "1"
  const portailsActifs = Object.keys(settings)
    .filter(k => k.startsWith("portail_") && settings[k] === "1")
    .map(k => k.replace("portail_", ""))

  // Filtrer les biens qui ont au moins un export coché vers un portail actif
  const biensExportables = (biens || []).filter(bien => {
    const exp = bien.exports || {}
    return portailsActifs.some(p => exp[p])
  })

  const xml = generateXML(biensExportables)

  res.setHeader("Content-Type", "application/xml")
  res.send(xml)
}
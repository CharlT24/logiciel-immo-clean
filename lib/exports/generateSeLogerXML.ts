export const generateSeLogerXML = (biens: any[]) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<biens>
${biens.map(bien => `
  <bien>
    <titre>${bien.titre || ""}</titre>
    <ville>${bien.ville || ""}</ville>
    <prix>${bien.prix_vente || 0}</prix>
    <surface>${bien.surface_m2 || 0}</surface>
  </bien>
`).join("\n")}
</biens>`
}

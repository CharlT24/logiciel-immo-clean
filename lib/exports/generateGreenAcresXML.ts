export const generateGreenAcresXML = (biens: any[]) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<greenacres>
${biens.map(b => `
  <property>
    <title>${b.titre}</title>
    <location>${b.ville}</location>
    <area>${b.surface_m2}</area>
    <price>${b.prix_vente}</price>
  </property>
`).join("\n")}
</greenacres>`
}

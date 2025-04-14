export const generateWordpressXML = (biens: any[]) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<wordpress>
${biens.map(b => `
  <post>
    <title>${b.titre}</title>
    <slug>${b.titre?.toLowerCase().replace(/\\s+/g, "-")}</slug>
    <excerpt>${b.description?.slice(0, 160)}</excerpt>
  </post>
`).join("\n")}
</wordpress>`
}

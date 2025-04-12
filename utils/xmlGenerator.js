// utils/xmlGenerator.js

export const generateXML = (biens) => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<annonces>\n`
  
    for (const bien of biens) {
      xml += `  <annonce>\n`
      xml += `    <id>${bien.id}</id>\n`
      xml += `    <titre>${bien.titre}</titre>\n`
      xml += `    <ville>${bien.ville}</ville>\n`
      xml += `    <prix>${bien.prix || 0}</prix>\n`
      xml += `    <surface>${bien.surface || 0}</surface>\n`
      xml += `  </annonce>\n`
    }
  
    xml += `</annonces>\n`
    return xml
  }
  
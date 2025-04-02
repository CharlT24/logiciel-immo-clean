export const generateLeBonCoinXML = (biens: any[]) => {
    return `<?xml version="1.0" encoding="UTF-8"?>
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
  </annonces>`;
  };
  
import { generateLeBonCoinXML } from "./generateLeBonCoinXML"

export const generateXML = (portail: string, biens: any[]) => {
  switch (portail) {
    case "leboncoin":
      return generateLeBonCoinXML(biens)
    // case "seloger": return generateSeLogerXML(biens)
    default:
      throw new Error("Portail non supporté")
  }
}

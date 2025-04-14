import { generateLeBonCoinXML } from "./generateLeBonCoinXML"
import { generateSeLogerXML } from "./generateSeLogerXML"
import { generateBienIciXML } from "./generateBienIciXML"
import { generateFigaroXML } from "./generateFigaroXML"
import { generateFnaimXML } from "./generateFnaimXML"
import { generateGreenAcresXML } from "./generateGreenAcresXML"
import { generateWordpressXML } from "./generateWordpressXML"

export const generateXML = (portail: string, biens: any[]) => {
  switch (portail) {
    case "leboncoin":
      return generateLeBonCoinXML(biens)
    case "seloger":
      return generateSeLogerXML(biens)
    case "bienici":
      return generateBienIciXML(biens)
    case "figaro":
      return generateFigaroXML(biens)
    case "fnaim":
      return generateFnaimXML(biens)
    case "greenacres":
      return generateGreenAcresXML(biens)
    case "wordpress":
      return generateWordpressXML(biens)
    default:
      throw new Error("Portail non supporté : " + portail)
  }
}
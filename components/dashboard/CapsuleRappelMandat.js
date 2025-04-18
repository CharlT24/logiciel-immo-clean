import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"

export default function CapsuleRappelMandat() {
  const [rappels, setRappels] = useState([])

  useEffect(() => {
    const fetchRappels = async () => {
      const today = new Date()
      const futureDate = new Date()
      futureDate.setDate(today.getDate() + 30)

      const { data, error } = await supabase
        .from("biens")
        .select("id, titre, date_fin_mandat")
        .not("date_fin_mandat", "is", null)
        .lte("date_fin_mandat", futureDate.toISOString())
        .order("date_fin_mandat", { ascending: true })

      if (!error && data) setRappels(data)
    }

    fetchRappels()
  }, [])

  return (
    <div className="bg-white shadow-md rounded-xl p-6 border">
      <h3 className="text-lg font-bold mb-4 text-red-600">⏰ Mandats à renouveler</h3>
      {rappels.length === 0 ? (
        <p className="text-sm text-gray-500">Aucun mandat à échéance proche.</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {rappels.map(bien => (
            <li key={bien.id} className="flex justify-between items-center">
              <Link href={`/biens/${bien.id}`} className="text-orange-600 hover:underline">
                {bien.titre}
              </Link>
              <span className="text-gray-500">{new Date(bien.date_fin_mandat).toLocaleDateString("fr-FR")}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

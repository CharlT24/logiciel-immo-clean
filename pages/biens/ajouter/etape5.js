import { useRouter } from "next/router"

export default function Etape5() {
  const router = useRouter()

  return (
    <div className="max-w-xl mx-auto bg-white p-10 mt-16 rounded-xl shadow border text-center space-y-6">
      <h1 className="text-3xl font-bold text-green-600">✅ Bien enregistré !</h1>
      <p className="text-gray-600">Tu peux maintenant le retrouver dans ta liste de biens ou ajouter d’autres informations.</p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => router.push("/biens")}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded"
        >
          📂 Voir mes biens
        </button>
        <button
          onClick={() => router.push("/biens/ajouter/etape1")}
          className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700"
        >
          ➕ Ajouter un autre
        </button>
      </div>
    </div>
  )
}

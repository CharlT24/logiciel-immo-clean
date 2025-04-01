import { useRouter } from "next/router"

export default function AdminPage() {
  const router = useRouter()

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">⚙️ Espace Administration</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => router.push("/admin/utilisateurs")}
          className="bg-orange-500 text-white px-5 py-4 rounded shadow hover:bg-orange-600 transition"
        >
          👥 Gérer les utilisateurs
        </button>

        <button
          onClick={() => router.push("/admin/export")}
          className="bg-blue-500 text-white px-5 py-4 rounded shadow hover:bg-blue-600 transition"
        >
          🌍 Plateformes d’export
        </button>

        <button
          onClick={() => router.push("/admin/site")}
          className="bg-green-500 text-white px-5 py-4 rounded shadow hover:bg-green-600 transition"
        >
          🖥️ Gestion du site vitrine
        </button>

        <button
          onClick={() => router.push("/admin/pdf")}
         className="bg-red-500 text-white px-5 py-4 rounded shadow hover:bg-red-600 transition"
        >
         📰 Uploader une newsletter
        </button>

        <button
          onClick={() => router.push("/admin/crm")}
          className="bg-purple-500 text-white px-5 py-4 rounded shadow hover:bg-purple-600 transition"
        >
          🛠️ Personnalisation CRM
        </button>
      </div>
    </div>
  )
}

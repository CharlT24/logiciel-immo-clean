import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import Layout from "../../components/layout"; // Assurez-vous que Layout est importé correctement

export default function BienDetails() {
  const router = useRouter();
  const { id } = router.query;  // Récupérer l'ID du bien
  const [bien, setBien] = useState(null);

  // Récupérer les détails du bien à partir de Supabase
  useEffect(() => {
    if (!id) return;  // Si l'ID n'est pas encore disponible, on ne fait pas la requête

    const fetchBien = async () => {
      const { data, error } = await supabase.from("immo_pro").select("*").eq("id", id).single();
      if (error) {
        console.error("Erreur de récupération des détails du bien:", error);
        return;
      }
      setBien(data);
    };

    fetchBien();
  }, [id]);

  if (!bien) return <div>Chargement...</div>;  // Affichage pendant le chargement

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-orange-600 mb-6">Détails du Bien</h1>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold">{bien.titre}</h2>
          <p className="text-gray-600">📍 {bien.ville}</p>
          <p className="text-gray-600">💰 {bien.prix} €</p>
          <p className="text-gray-500 mt-4">{bien.description}</p>
          <div className="mt-6">
            <button
              onClick={() => router.push(`/immopro/modifier/${bien.id}`)}
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700"
            >
              Modifier le bien
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

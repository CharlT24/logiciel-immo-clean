import Link from "next/link"

export default function UtilisateurIndex() {
  const testId = "123"

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>👥 Utilisateurs</h1>
      <p>
        Ce lien devrait t’envoyer vers une page de modification dynamique :
      </p>
      <Link href={`/admin/utilisateur/${testId}/modifier`} passHref>
        <span style={{
          display: "inline-block",
          marginTop: "1rem",
          padding: "10px 20px",
          backgroundColor: "#f97316",
          color: "#fff",
          borderRadius: "8px",
          cursor: "pointer"
        }}>
          ✏️ Modifier utilisateur #{testId}
        </span>
      </Link>
    </div>
  )
}

"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
export default function WeinBearbeiten() {  
    const params = useParams();

const id = Number(params.id);

const [wein, setWein] = useState({
  produzent: "",
  weinname: "",
});
useEffect(() => {
  const gespeicherteWeine = JSON.parse(
    localStorage.getItem("weine") || "[]"
  );

  const gefundenerWein = gespeicherteWeine.find(
    (eintrag: { id: number }) => eintrag.id === id
  );

  if (gefundenerWein) {
    setWein(gefundenerWein);
  }
}, [id]);
  return (
    <main
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        padding: "30px",
        backgroundColor: "white",
        borderRadius: "16px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        fontFamily: "Arial",
      }}
    >
      <h1>🍷 Wein bearbeiten</h1>

      <p>Hier bearbeiten wir später den ausgewählten Wein.</p>

      <hr style={{ margin: "25px 0" }} />

     <label>Produzent</label>
<input
  type="text"
  value={wein.produzent}
  onChange={(e) =>
    setWein({
      ...wein,
      produzent: e.target.value,
    })
  }
  style={{
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    marginBottom: "18px",
  }}
/>

<label>Weinname</label>
<input
  type="text"
  value={wein.weinname}
  onChange={(e) =>
    setWein({
      ...wein,
      weinname: e.target.value,
    })
  }
  style={{
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    marginBottom: "18px",
  }}
/>

      <button
        style={{
          padding: "12px 24px",
          backgroundColor: "#7b1026",
          color: "white",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
        }}
      >
        Speichern
      </button>
    </main>
  );
}
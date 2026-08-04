"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function WeinBearbeiten() {  
    const params = useParams();
const router = useRouter();
const id = Number(params.id);

const [wein, setWein] = useState({
  produzent: "",
  weinname: "",
  jahrgang: "",
  land: "",
  region: "",
  rebsorte: "",
  preis: 0,
  anzahl: 1,
  bewertung: 0,
  bild: "",
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
function speichern() {
  const weine = JSON.parse(localStorage.getItem("weine") || "[]");

  const neueWeine = weine.map((w: any) =>
    w.id === id ? wein : w
  );

  localStorage.setItem("weine", JSON.stringify(neueWeine));

  router.push("/weinkeller");
}
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

      <p>Passe die gewünschten Angaben an und speichere die Änderungen.</p>

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
<label>Jahrgang</label>
<input
  type="number"
  value={wein.jahrgang}
  onChange={(e) =>
    setWein({
      ...wein,
      jahrgang: e.target.value,
    })
  }
  style={{
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    marginBottom: "18px",
  }}
/>
<label>Land</label>
<input
  type="text"
  value={wein.land}
  onChange={(e) =>
    setWein({
      ...wein,
      land: e.target.value,
    })
  }
  style={{
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    marginBottom: "18px",
  }}
/>

<label>Region</label>
<input
  type="text"
  value={wein.region}
  onChange={(e) =>
    setWein({
      ...wein,
      region: e.target.value,
    })
  }
  style={{
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    marginBottom: "18px",
  }}
/>
<label>Rebsorte</label>
<input
  type="text"
  value={wein.rebsorte}
  onChange={(e) =>
    setWein({
      ...wein,
      rebsorte: e.target.value,
    })
  }
  style={{
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    marginBottom: "18px",
  }}
/>

<label>Preis pro Flasche</label>
<input
  type="number"
  step="0.05"
  value={wein.preis}
  onChange={(e) =>
    setWein({
      ...wein,
      preis: Number(e.target.value),
    })
  }
  style={{
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    marginBottom: "18px",
  }}
/>

<label>Anzahl Flaschen</label>
<input
  type="number"
  min="0"
  value={wein.anzahl}
  onChange={(e) =>
    setWein({
      ...wein,
      anzahl: Number(e.target.value),
    })
  }
  style={{
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    marginBottom: "18px",
  }}
/>
<label>Bild</label>

{wein.bild && (
  <img
    src={wein.bild}
    alt="Wein"
    style={{
      width: "220px",
      borderRadius: "12px",
      display: "block",
      marginBottom: "15px",
    }}
  />
)}

<input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const datei = e.target.files?.[0];

    if (!datei) return;

    const reader = new FileReader();

    reader.onload = () => {
      setWein({
        ...wein,
        bild: reader.result as string,
      });
    };

    reader.readAsDataURL(datei);
  }}
/>



<label>Bewertung</label>

<div
  style={{
    fontSize: "32px",
    marginTop: "8px",
    marginBottom: "20px",
  }}
>
  {[1, 2, 3, 4, 5].map((stern) => (
    <span
      key={stern}
      onClick={() =>
        setWein({
          ...wein,
          bewertung: stern,
        })
      }
      style={{
        cursor: "pointer",
        color:
          stern <= wein.bewertung
            ? "#d4a017"
            : "#cccccc",
      }}
    >
      ★
    </span>
  ))}
</div>

<button
  type="button"
  onClick={speichern}
     
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
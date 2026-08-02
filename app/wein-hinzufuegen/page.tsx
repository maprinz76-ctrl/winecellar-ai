"use client";
import { useState } from "react";

  export default function WeinHinzufuegen() {
    const [produzent, setProduzent] = useState("");
  const [weinname, setWeinname] = useState("");
  const [jahrgang, setJahrgang] = useState("");
  const [land, setLand] = useState("");
  const [region, setRegion] = useState("");
  const [rebsorte, setRebsorte] = useState("");
  const [anzahl, setAnzahl] = useState("");
  const [preis, setPreis] = useState("");
 
  function handleSubmit(event: any) {
    event.preventDefault();

    if (!produzent.trim() || !weinname.trim()) {
      alert("Bitte Produzent und Weinname eingeben.");
      return;
    }

    const neuerWein = {
      id: Date.now(),
      produzent,
      weinname,
      jahrgang,
      land,
      region,
      rebsorte,
      anzahl: Number(anzahl),
      preis: Number(preis),
      bewertung: 0,
    };

    const gespeicherteWeine = JSON.parse(
      localStorage.getItem("weine") || "[]"
    );

    gespeicherteWeine.push(neuerWein);

    localStorage.setItem(
      "weine",
      JSON.stringify(gespeicherteWeine)
    );

    alert(`${produzent} ${weinname} wurde gespeichert.`);

    setProduzent("");
    setWeinname("");
    setJahrgang("");
    setLand("");
    setRegion("");
    setRebsorte("");
    setAnzahl("");
    setPreis("");
  }
  return (
    <main
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        fontFamily: "Arial",
        padding: "20px",
      }}
    >
      <h1>🍷 Wein hinzufügen</h1>

<form
  onSubmit={handleSubmit}
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "30px",
  }}
>
        <input
  placeholder="Produzent"
  value={produzent}
  onChange={(e) => setProduzent(e.target.value)}
/>
        <input
  placeholder="Weinname"
  value={weinname}
  onChange={(e) => setWeinname(e.target.value)}
/>
        <input
  placeholder="Jahrgang"
  type="number"
  value={jahrgang}
  onChange={(e) => setJahrgang(e.target.value)}
/>

        <input
  placeholder="Land"
  value={land}
  onChange={(e) => setLand(e.target.value)}
/>
        <input
  placeholder="Region"
  value={region}
  onChange={(e) => setRegion(e.target.value)}
/>
        <input
  placeholder="Rebsorte"
  value={rebsorte}
  onChange={(e) => setRebsorte(e.target.value)}
/>
        <input
  placeholder="Anzahl Flaschen"
  type="number"
  value={anzahl}
  onChange={(e) => setAnzahl(e.target.value)}
/>
        <input
  placeholder="Kaufpreis in CHF"
  type="number"
  step="0.05"
  value={preis}
  onChange={(e) => setPreis(e.target.value)}
/>

<button
  type="submit"
  style={{
            background: "#8b0f24",
            color: "white",
            padding: "15px",
            border: "none",
            borderRadius: "8px",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          Speichern
        </button>
      </form>
    </main>
  );
}
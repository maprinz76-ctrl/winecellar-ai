"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

  export default function WeinHinzufuegen() {
    
    const pathname = usePathname();
    const [produzent, setProduzent] = useState("");
  const [weinname, setWeinname] = useState("");
  const [jahrgang, setJahrgang] = useState("");
  const [land, setLand] = useState("");
  const [region, setRegion] = useState("");
  const [rebsorte, setRebsorte] = useState("");
  const [anzahl, setAnzahl] = useState("");
  const [preis, setPreis] = useState("");
  const [bild, setBild] = useState("");
  function bildAuswaehlen(event: React.ChangeEvent<HTMLInputElement>) {
  const datei = event.target.files?.[0];

  if (!datei) {
    return;
  }

  if (!datei.type.startsWith("image/")) {
    alert("Bitte eine Bilddatei auswählen.");
    return;
  }

  const reader = new FileReader();

  reader.onloadend = () => {
    if (typeof reader.result === "string") {
      setBild(reader.result);
    }
  };

  reader.readAsDataURL(datei);
}
 
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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
      bild,
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
    setBild("");
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
<button
  type="button"
  style={{
    width: "100%",
    marginTop: "20px",
    marginBottom: "10px",
    padding: "14px",
    backgroundColor: "#ece7f8",
    color: "#4b2c83",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  }}
>
  📷 Etikett fotografieren (demnächst)
</button>
<div
  style={{
    background: "white",
    padding: "28px",
    borderRadius: "18px",
    boxShadow: "0 6px 20px rgba(40,30,30,0.08)",
    marginTop: "25px",
  }}
>
<form
  onSubmit={handleSubmit}
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "0",
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
  min="0"
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

  <label
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    fontWeight: "bold",
  }}
>
  Foto der Flasche

  <input
    type="file"
    accept="image/*"
    capture="environment"
    onChange={bildAuswaehlen}
  />
</label>

{bild && (
  <img
     src={bild}
  alt="Vorschau"
  style={{
    width: "140px",
    display: "block",
    margin: "0 auto 15px auto",
    borderRadius: "10px",
    border: "1px solid #ddd",
    }}
  />
)}
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
    </div>
    <nav
  style={{
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTop: "1px solid #ded8d2",
    padding: "12px 20px",
    zIndex: 1000,
  }}
>
  <div
    style={{
      maxWidth: "820px",
      margin: "0 auto",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      fontSize: "24px",
    }}
  >
    <Link href="/" style={{ textDecoration: "none" }}>
      🏠
    </Link>

    <Link href="/weinkeller" style={{ textDecoration: "none" }}>
      🍷
    </Link>

    <Link
      href="/wein-hinzufuegen"
      style={{
        textDecoration: "none",
        borderBottom:
          pathname === "/wein-hinzufuegen"
            ? "3px solid #7b1026"
            : "none",
        paddingBottom: "5px",
      }}
    >
      ➕
    </Link>

    <span>🔍</span>

    <span>👤</span>
  </div>
</nav>
    </main>
  );
}
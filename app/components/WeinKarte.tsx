"use client";
import Link from "next/link";
import InfoBox from "./InfoBox";
type Wein = {
  id: number;
  produzent: string;
  weinname: string;
  jahrgang: string;
  land: string;
  region: string;
  rebsorte: string;
  anzahl: number;
  preis: number;
  bewertung?: number;
   bild?: string;
};

type Props = {
  wein: Wein;
  bestandAendern: (id: number, veraenderung: number) => void;
  bewertungAendern: (id: number, sterne: number) => void;
  weinLoeschen: (id: number) => void;
};

export default function WeinKarte({
  wein,
  bestandAendern,
  bewertungAendern,
  weinLoeschen,
}: Props) {
  const gesamtwert = wein.anzahl * wein.preis;
  return (
  <article
  style={{
    backgroundColor: "white",
    padding: "22px",
    borderRadius: "16px",
    boxShadow: "0 6px 20px rgba(40, 30, 30, 0.08)",
    marginBottom: "20px",
  }}
>
  {wein.bild && (
  <img
    src={wein.bild}
    alt={wein.weinname}
    style={{
  
  width: "170px",
  height: "170px",
  objectFit: "contain",
  display: "block",
  margin: "0 auto 20px",
  borderRadius: "12px",
  backgroundColor: "#fafafa",
}}
  />
)}
 <h2
  style={{
    margin: 0,
    color: "#7b1026",
    fontSize: "28px",
    fontWeight: "700",
  }}
>
  {wein.produzent}
</h2>

<p
  style={{
    margin: "6px 0 12px",
    fontSize: "22px",
    color: "#222",
    fontWeight: "500",
  }}
>
  {wein.weinname}
</p>

<div
  style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "16px",
  }}
>
  <span
    style={{
      background: "#f5f2ee",
      padding: "6px 10px",
      borderRadius: "999px",
      fontSize: "14px",
    }}
  >
    🌍 {wein.land}
  </span>

  <span
    style={{
      background: "#f5f2ee",
      padding: "6px 10px",
      borderRadius: "999px",
      fontSize: "14px",
    }}
  >
    📍 {wein.region}
  </span>

  <span
    style={{
      background: "#f5f2ee",
      padding: "6px 10px",
      borderRadius: "999px",
      fontSize: "14px",
    }}
  >
    🍇 {wein.rebsorte}
  </span>

  <span
    style={{
      background: "#f5f2ee",
      padding: "6px 10px",
      borderRadius: "999px",
      fontSize: "14px",
    }}
  >
    📅 {wein.jahrgang}
  </span>
</div>
<div
  style={{
    margin: "10px 0",
    fontSize: "24px",
  }}
>
  {[1, 2, 3, 4, 5].map((stern) => (
    <span
      key={stern}
      
      style={{
        cursor: "default",
        color:
          stern <= (wein.bewertung || 0)
            ? "#d4a017"
            : "#cccccc",
      }}
    >
      ★
    </span>
  ))}
</div>
<hr
  style={{
    border: "none",
    borderTop: "1px solid #eee8e3",
    margin: "18px 0",
  }}
/>

<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "12px",
    alignItems: "stretch",
  }}
>
  <InfoBox
    title="💰 Preis pro Flasche"
    value={`CHF ${wein.preis.toFixed(2)}`}
  />

  <div
    style={{
      backgroundColor: "#f6f2ec",
      padding: "14px",
      borderRadius: "10px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <span
      style={{
        color: "#7b6f68",
        fontSize: "13px",
        marginBottom: "8px",
      }}
    >
      📦 Bestand
    </span>

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
      }}
    >
      <button
        type="button"
        onClick={() => bestandAendern(wein.id, -1)}
        disabled={wein.anzahl === 0}
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          border: "none",
          backgroundColor: "#ece7f8",
          cursor: wein.anzahl === 0 ? "not-allowed" : "pointer",
          fontSize: "22px",
          opacity: wein.anzahl === 0 ? 0.5 : 1,
        }}
      >
        −
      </button>

      <strong
        style={{
          minWidth: "30px",
          textAlign: "center",
          fontSize: "24px",
        }}
      >
        {wein.anzahl}
      </strong>

      <button
        type="button"
        onClick={() => bestandAendern(wein.id, 1)}
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          border: "none",
          backgroundColor: "#ece7f8",
          cursor: "pointer",
          fontSize: "22px",
        }}
      >
        +
      </button>
    </div>
  </div>
</div>

<div
  style={{
    marginTop: "12px",
  }}
>
  <InfoBox
    title="💎 Gesamtwert"
    value={`CHF ${gesamtwert.toFixed(2)}`}
  />
</div>

<div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "18px",
    paddingTop: "16px",
    borderTop: "1px solid #eee8e3",
  }}
>
  <Link
    href={`/wein-bearbeiten/${wein.id}`}
    style={{ textDecoration: "none" }}
  >
    <button
      type="button"
      style={{
        border: "none",
        backgroundColor: "#ece7f8",
        color: "#4b2c83",
        padding: "10px 14px",
        borderRadius: "9px",
        cursor: "pointer",
      }}
    >
      ✏️ Bearbeiten
    </button>
  </Link>

  <button
    type="button"
    onClick={() => weinLoeschen(wein.id)}
    style={{
      border: "none",
      backgroundColor: "#f4e7e9",
      color: "#7b1026",
      padding: "10px 14px",
      borderRadius: "9px",
      cursor: "pointer",
    }}
  >
    🗑️ Löschen
  </button>
</div>
    </article>
  );
}
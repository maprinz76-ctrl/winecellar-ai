"use client";
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
      <h2>{wein.weinname}</h2>
      <p
  style={{
    margin: 0,
    color: "#7b1026",
    fontWeight: "bold",
  }}
>
  {wein.produzent}
</p>

<div
  style={{
    margin: "10px 0",
    fontSize: "24px",
  }}
>
  {[1, 2, 3, 4, 5].map((stern) => (
    <span
      key={stern}
      onClick={() => bewertungAendern(wein.id, stern)}
      style={{
        cursor: "pointer",
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
      {wein.bild && (
  <img
    src={wein.bild}
    alt={wein.weinname}
    style={{
      width: "120px",
      height: "180px",
      objectFit: "contain",
      display: "block",
      margin: "15px auto",
      borderRadius: "10px",
      border: "1px solid #ddd",
      backgroundColor: "white",
    }}
  />
)}
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "12px",
    marginTop: "20px",
  }}
>
  
  <InfoBox
  title="Preis pro Flasche"
  value={`CHF ${wein.preis.toFixed(2)}`}
  
/> <InfoBox
  title="Gesamtwert"
  value={`CHF ${gesamtwert.toFixed(2)}`}
  />
</div>
 
    </article>
  );
}
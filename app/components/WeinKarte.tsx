"use client";
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
      <p>{wein.produzent}</p>
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
    </article>
  );
}
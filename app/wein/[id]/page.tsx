"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Wein = {
  id: number;
  produzent: string;
  weinname: string;
  jahrgang: string;
  land: string;
  region: string;
  appellation?: string;
  rebsorte: string;
  anzahl: number;
  preis: number;
  bewertung?: number;
  bild?: string;
  notiz?: string;
  favorit?: boolean;
};

export default function WeinDetail() {
  const params = useParams();
  const [wein, setWein] = useState<Wein | null>(null);

  useEffect(() => {
    const daten = localStorage.getItem("weine");

    if (!daten) return;

    const weine: Wein[] = JSON.parse(daten);

    const gefundenerWein = weine.find(
      (einWein) => String(einWein.id) === String(params.id)
    );

    setWein(gefundenerWein || null);
  }, [params.id]);

  if (!wein) {
    return (
      <main style={{ padding: "40px", fontFamily: "Arial" }}>
        <p>Wein wurde nicht gefunden.</p>
        <Link href="/weinkeller">← Zurück zum Weinkeller</Link>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f1ec",
        padding: "30px 20px 100px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: "760px",
          margin: "0 auto",
        }}
      >
        <Link
          href="/weinkeller"
          style={{
            color: "#7b1026",
            textDecoration: "none",
          }}
        >
          ← Zurück zum Weinkeller
        </Link>

        <div
          style={{
            backgroundColor: "white",
            marginTop: "20px",
            padding: "28px",
            borderRadius: "18px",
            boxShadow: "0 6px 20px rgba(40,30,30,0.08)",
          }}
        >
        <div
  style={{
    position: "relative",
    marginBottom: "20px",
  }}
>
  {wein.bild && (
    <img
      src={wein.bild}
      alt={wein.weinname}
      style={{
        width: "220px",
        maxHeight: "260px",
        height: "auto",
        objectFit: "contain",
        display: "block",
        margin: "0 auto",
      }}
    />
  )}

  <button
    type="button"
    onClick={() => {
      const daten = localStorage.getItem("weine");
      if (!daten) return;

      const weine: Wein[] = JSON.parse(daten);

      const neueWeine = weine.map((einWein) =>
        einWein.id === wein.id
          ? { ...einWein, favorit: !wein.favorit }
          : einWein
      );

      localStorage.setItem("weine", JSON.stringify(neueWeine));

      setWein({
        ...wein,
        favorit: !wein.favorit,
      });
    }}
    style={{
      position: "absolute",
      top: "0",
      right: "0",
      border: "none",
      background: "transparent",
      fontSize: "30px",
      cursor: "pointer",
    }}
    title={wein.favorit ? "Favorit entfernen" : "Als Favorit markieren"}
  >
    {wein.favorit ? "❤️" : "🤍"}
  </button>
</div>
          <div
  style={{
    marginTop: "8px",
    marginBottom: "18px",
  }}
>
  <h1
    style={{
      color: "#7b1026",
      fontSize: "28px",
      margin: "0 0 6px 0",
    }}
  >
    {wein.produzent}
  </h1>

  <div
    style={{
      fontSize: "22px",
      color: "#222",
    }}
  >
    {wein.weinname}
  </div>
</div>

          <div
            style={{
              fontSize: "26px",
              marginBottom: "20px",
              color: "#d4a017",
            }}
          >
            {"★".repeat(wein.bewertung || 0)}
            <span style={{ color: "#cccccc" }}>
              {"★".repeat(5 - (wein.bewertung || 0))}
            </span>
          </div>

          <div
  style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "20px",
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

  {wein.appellation && (
    <span
      style={{
        background: "#f5f2ee",
        padding: "6px 10px",
        borderRadius: "999px",
        fontSize: "14px",
      }}
    >
      🏷️ {wein.appellation}
    </span>
  )}

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

          <hr
            style={{
              border: "none",
              borderTop: "1px solid #eee",
              margin: "25px 0",
            }}
          />

          <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "12px",
    marginBottom: "25px",
  }}
>
  <div
    style={{
      backgroundColor: "#f6f2ec",
      padding: "16px",
      borderRadius: "12px",
    }}
  >
    <div style={{ fontSize: "13px", color: "#7b6f68", marginBottom: "6px" }}>
      💰 Preis pro Flasche
    </div>
    <strong>CHF {wein.preis.toFixed(2)}</strong>
  </div>

  <div
    style={{
      backgroundColor: "#f6f2ec",
      padding: "16px",
      borderRadius: "12px",
    }}
  >
    <div style={{ fontSize: "13px", color: "#7b6f68", marginBottom: "6px" }}>
      📦 Bestand
    </div>
    <strong>{wein.anzahl} Flaschen</strong>
  </div>

  <div
    style={{
      backgroundColor: "#f6f2ec",
      padding: "16px",
      borderRadius: "12px",
    }}
  >
    <div style={{ fontSize: "13px", color: "#7b6f68", marginBottom: "6px" }}>
      💎 Gesamtwert
    </div>
    <strong>CHF {(wein.preis * wein.anzahl).toFixed(2)}</strong>
  </div>
</div>
          <Link
  href={`/wein-bearbeiten/${wein.id}`}
  style={{ textDecoration: "none" }}
><hr
  style={{
    border: "none",
    borderTop: "1px solid #eee",
    margin: "25px 0",
  }}
/>

<div
  style={{
    backgroundColor: "#f6f2ec",
    padding: "18px",
    borderRadius: "12px",
  }}
>
  <h3
    style={{
      marginTop: 0,
      marginBottom: "10px",
      color: "#7b1026",
    }}
  >
    📝 Meine Notizen
  </h3>

  <p
    style={{
      margin: 0,
      lineHeight: 1.6,
      color: "#4b4542",
    }}
  >
    {wein.notiz || "Noch keine Notiz erfasst."}
  </p>
</div>
  <button
    type="button"
    style={{
      width: "100%",
      marginTop: "25px",
      padding: "14px",
      border: "none",
      borderRadius: "10px",
      backgroundColor: "#7b1026",
      color: "white",
      fontSize: "16px",
      fontWeight: "bold",
      cursor: "pointer",
    }}
  >
    ✏️ Wein bearbeiten
  </button>
</Link>
        </div>
      </div>
    </main>
  );
}
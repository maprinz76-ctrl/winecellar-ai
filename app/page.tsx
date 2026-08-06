"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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

export default function Home() {
  const [weine, setWeine] = useState<Wein[]>([]);

  useEffect(() => {
    const daten = localStorage.getItem("weine");

    if (daten) {
      setWeine(JSON.parse(daten));
    }
  }, []);

  const kennzahlen = useMemo(() => {
    const anzahlWeine = weine.length;

    const anzahlFlaschen = weine.reduce(
      (summe, wein) => summe + wein.anzahl,
      0
    );

    const gesamtwert = weine.reduce(
      (summe, wein) => summe + wein.anzahl * wein.preis,
      0
    );

    const durchschnittspreis =
      anzahlFlaschen > 0 ? gesamtwert / anzahlFlaschen : 0;

      const durchschnittBewertung =
        anzahlWeine > 0
          ? weine.reduce(
              (summe, wein) => summe + (wein.bewertung || 0),
              0
            ) / anzahlWeine
          : 0;
const lieblingswein =
  weine.length > 0
    ? [...weine].sort(
        (a, b) =>
          (b.bewertung || 0) - (a.bewertung || 0) ||
          b.preis - a.preis
      )[0]
    : null;
    return {
      anzahlWeine,
      anzahlFlaschen,
      gesamtwert,
      durchschnittspreis,
      durchschnittBewertung,
      lieblingswein,
    };
  }, [weine]);

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f1ec",
        color: "#231f20",
        fontFamily: "Arial, sans-serif",
        padding: "28px 20px 110px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "820px",
          margin: "0 auto",
        }}
      >
        <header style={{ marginBottom: "28px" }}>
          <p
            style={{
              margin: 0,
              color: "#7b6f68",
              fontSize: "16px",
            }}
          >
            Willkommen zurück, Marco
          </p>

          <h1
            style={{
              margin: "8px 0 0",
              fontSize: "38px",
            }}
          >
            🍷 WineCellar AI
          </h1>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "16px",
          }}
        >
          <DashboardCard
            icon="🍷"
            title="Weine"
            value={String(kennzahlen.anzahlWeine)}
          />
          <DashboardCard
            icon="🍾"
            title="Flaschen"
            value={String(kennzahlen.anzahlFlaschen)}
          />
          <DashboardCard
            icon="💰"
            title="Gesamtwert"
            value={`CHF ${kennzahlen.gesamtwert.toFixed(2)}`}
          />
          <DashboardCard
          icon="⭐"
            title="Ø Bewertung"
            value={`${kennzahlen.durchschnittBewertung.toFixed(1)} / 5`}
          />
          {kennzahlen.lieblingswein && (
  <div
    style={{
      gridColumn: "1 / -1",
      backgroundColor: "white",
      padding: "22px",
      borderRadius: "16px",
      boxShadow: "0 6px 20px rgba(40, 30, 30, 0.08)",
    }}
  >
    <div style={{ fontSize: "28px" }}>🏆</div>

    <p
      style={{
        margin: "14px 0 6px",
        color: "#7b6f68",
        fontSize: "14px",
      }}
    >
      Höchst bewerteter Wein
    </p>

    <strong
      style={{
        display: "block",
        fontSize: "22px",
        color: "#7b1026",
      }}
    >
      {kennzahlen.lieblingswein.produzent}
    </strong>
{kennzahlen.lieblingswein.bild && (
  <img
    src={kennzahlen.lieblingswein.bild}
    alt={kennzahlen.lieblingswein.weinname}
    style={{
      width: "90px",
      height: "90px",
      objectFit: "contain",
      marginTop: "10px",
      borderRadius: "10px",
    }}
  />
)}
    <span
      style={{
        display: "block",
        marginTop: "4px",
        fontSize: "18px",
      }}
    >
      {kennzahlen.lieblingswein.weinname}
    </span>

    <div
      style={{
        marginTop: "12px",
        color: "#d4a017",
        fontSize: "22px",
      }}
    >
      {"★".repeat(kennzahlen.lieblingswein.bewertung || 0)}
      {"☆".repeat(5 - (kennzahlen.lieblingswein.bewertung || 0))}
    </div>

    <p
      style={{
        margin: "10px 0 0",
        color: "#7b6f68",
      }}
    >
      CHF {kennzahlen.lieblingswein.preis.toFixed(2)}
    </p>
  </div>
)}
        </section>


        <Link
          href="/wein-hinzufuegen"
          style={{
            display: "block",
            marginTop: "28px",
            padding: "17px",
            backgroundColor: "#7b1026",
            color: "white",
            textAlign: "center",
            textDecoration: "none",
            borderRadius: "14px",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          + Wein hinzufügen
        </Link>

        <Link
          href="/weinkeller"
          style={{
            display: "block",
            marginTop: "14px",
            padding: "17px",
            backgroundColor: "white",
            color: "#7b1026",
            textAlign: "center",
            textDecoration: "none",
            borderRadius: "14px",
            fontSize: "18px",
            fontWeight: "bold",
            border: "1px solid #ded8d2",
          }}
        >
          Mein Weinkeller öffnen
        </Link>
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
        }}
      >
        <div
          style={{
            maxWidth: "820px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-around",
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
            style={{ textDecoration: "none" }}
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

function DashboardCard({
  icon,
  title,
  value,
}: {
  icon: string;
  title: string;
  value: string;
}) {
  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "22px",
        borderRadius: "16px",
        boxShadow: "0 6px 20px rgba(40, 30, 30, 0.08)",
      }}
    >
      <div style={{ fontSize: "28px" }}>{icon}</div>

      <p
        style={{
          margin: "14px 0 6px",
          color: "#7b6f68",
          fontSize: "14px",
        }}
      >
        {title}
      </p>

      <strong style={{ fontSize: "22px" }}>{value}</strong>
    </div>
  );
}
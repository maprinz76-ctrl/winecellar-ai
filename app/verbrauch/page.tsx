"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Verbrauch = {
  id: number;
  weinId: number;
  produzent: string;
  weinname: string;
  jahrgang: string;
  datum: string;
  anzahl: number;
  preis: number;
};

export default function VerbrauchSeite() {
  const [verbraeuche, setVerbraeuche] = useState<Verbrauch[]>([]);

  useEffect(() => {
    const daten = localStorage.getItem("verbraeuche");

    if (daten) {
      setVerbraeuche(JSON.parse(daten));
    }
  }, []);
const getrunkeneFlaschen = verbraeuche.reduce(
  (summe, eintrag) => summe + eintrag.anzahl,
  0
);

const verbrauchswert = verbraeuche.reduce(
  (summe, eintrag) => summe + eintrag.anzahl * eintrag.preis,
  0
);

const jetzt = new Date();

const verbrauchDieserMonat = verbraeuche
  .filter((eintrag) => {
    const datum = new Date(eintrag.datum);

    return (
      datum.getMonth() === jetzt.getMonth() &&
      datum.getFullYear() === jetzt.getFullYear()
    );
  })
  .reduce((summe, eintrag) => summe + eintrag.anzahl, 0);
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f1ec",
        padding: "30px 20px",
        fontFamily: "Arial, sans-serif",
        color: "#231f20",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "850px",
          margin: "0 auto",
        }}
      >
        <Link
          href="/weinkeller"
          style={{
            color: "#7b1026",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          ← Zurück zum Weinkeller
        </Link>

        <h1 style={{ marginTop: "30px" }}>🍷 Verbrauchshistorie</h1>
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "14px",
    marginTop: "20px",
    marginBottom: "28px",
  }}
>
  <div
    style={{
      backgroundColor: "white",
      padding: "18px",
      borderRadius: "14px",
      boxShadow: "0 4px 14px rgba(40,30,30,0.06)",
    }}
  >
    <div style={{ fontSize: "24px" }}>🍷</div>
    <p
      style={{
        margin: "10px 0 5px",
        color: "#7b6f68",
        fontSize: "13px",
      }}
    >
      Getrunkene Flaschen
    </p>
    <strong style={{ fontSize: "22px" }}>
      {getrunkeneFlaschen}
    </strong>
  </div>

  <div
    style={{
      backgroundColor: "white",
      padding: "18px",
      borderRadius: "14px",
      boxShadow: "0 4px 14px rgba(40,30,30,0.06)",
    }}
  >
    <div style={{ fontSize: "24px" }}>💰</div>
    <p
      style={{
        margin: "10px 0 5px",
        color: "#7b6f68",
        fontSize: "13px",
      }}
    >
      Verbrauchswert
    </p>
    <strong style={{ fontSize: "22px" }}>
      CHF {verbrauchswert.toFixed(2)}
    </strong>
  </div>

  <div
    style={{
      backgroundColor: "white",
      padding: "18px",
      borderRadius: "14px",
      boxShadow: "0 4px 14px rgba(40,30,30,0.06)",
    }}
  >
    <div style={{ fontSize: "24px" }}>📅</div>
    <p
      style={{
        margin: "10px 0 5px",
        color: "#7b6f68",
        fontSize: "13px",
      }}
    >
      Diesen Monat
    </p>
    <strong style={{ fontSize: "22px" }}>
      {verbrauchDieserMonat}
    </strong>
  </div>
</div>
        {verbraeuche.length === 0 ? (
          <p>Noch keine Entnahmen gespeichert.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "14px",
              marginTop: "24px",
            }}
          >
           {[...verbraeuche].reverse().map((eintrag) => (
  <div
    key={eintrag.id}
    style={{
      backgroundColor: "white",
      padding: "18px 20px",
      borderRadius: "14px",
      boxShadow: "0 4px 14px rgba(40,30,30,0.06)",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        flexWrap: "wrap",
      }}
    >
      <div>
        <strong
          style={{
            color: "#7b1026",
            fontSize: "16px",
          }}
        >
          {eintrag.produzent} – {eintrag.weinname}
        </strong>

        <div
          style={{
            marginTop: "7px",
            color: "#6f625c",
            fontSize: "14px",
          }}
        >
          🍇 Jahrgang {eintrag.jahrgang || "–"}
          {" · "}
          📅 {new Date(eintrag.datum).toLocaleString("de-CH")}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <span
          style={{
            backgroundColor: "#f4f1ec",
            padding: "8px 12px",
            borderRadius: "10px",
            fontWeight: "bold",
          }}
        >
          🍷 {eintrag.anzahl} {eintrag.anzahl === 1 ? "Flasche" : "Flaschen"}
        </span>

        <span
          style={{
            backgroundColor: "#f4f1ec",
            padding: "8px 12px",
            borderRadius: "10px",
            fontWeight: "bold",
          }}
        >
          💰 CHF {(eintrag.anzahl * eintrag.preis).toFixed(2)}
        </span>
      </div>
    </div>
  </div>
))}
          </div>
        )}
      </div>
    </main>
  );
}
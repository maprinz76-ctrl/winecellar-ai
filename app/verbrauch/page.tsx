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
                  padding: "18px",
                  borderRadius: "14px",
                  boxShadow: "0 4px 14px rgba(40,30,30,0.06)",
                }}
              >
                <strong style={{ color: "#7b1026" }}>
                  {eintrag.produzent} – {eintrag.weinname}
                </strong>

                <div style={{ marginTop: "8px" }}>
                  Jahrgang: {eintrag.jahrgang || "–"}
                </div>

                <div>
                  Datum: {new Date(eintrag.datum).toLocaleString("de-CH")}
                </div>

                <div>
                  Entnommen: {eintrag.anzahl} Flasche
                </div>

                <div>
                  Wert: CHF {(eintrag.anzahl * eintrag.preis).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
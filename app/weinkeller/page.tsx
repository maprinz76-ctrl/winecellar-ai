"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
  bewertung: number;
};

export default function Weinkeller() {
  const [weine, setWeine] = useState<Wein[]>([]);
const [suche, setSuche] = useState("");
  useEffect(() => {
    
        const daten = localStorage.getItem("weine");

    if (daten) {
      setWeine(JSON.parse(daten));
    }
  }, []);
const gefilterteWeine = weine.filter((wein: Wein) => {
  const text = `
    ${wein.produzent}
    ${wein.weinname}
    ${wein.land}
    ${wein.region}
    ${wein.rebsorte}
    ${wein.jahrgang}
  `.toLowerCase();

  return text.includes(suche.toLowerCase());
});
function bestandAendern(id: number, veraenderung: number) {
  const neueListe = weine.map((wein) => {
    if (wein.id !== id) {
      return wein;
    }

    return {
      ...wein,
      anzahl: Math.max(0, wein.anzahl + veraenderung),
    };
  });

  setWeine(neueListe);
  localStorage.setItem("weine", JSON.stringify(neueListe));
}
function bewertungAendern(id: number, sterne: number) {
  const neueListe = weine.map((wein) => {
    if (wein.id !== id) {
      return wein;
    }

    return {
      ...wein,
      bewertung: sterne,
    };
  });

  setWeine(neueListe);
  localStorage.setItem("weine", JSON.stringify(neueListe));
}
  function weinLoeschen(id: number) {
    const bestaetigt = window.confirm(
      "Möchtest du diesen Wein wirklich löschen?"
    );

    if (!bestaetigt) {
      return;
    }

    const neueListe = weine.filter((wein) => wein.id !== id);

    setWeine(neueListe);
    localStorage.setItem("weine", JSON.stringify(neueListe));
  }

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
          href="/"
          style={{
            color: "#7b1026",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          ← Zurück zum Dashboard
        </Link>

        <div style={{ marginTop: "28px", marginBottom: "26px" }}>
          <p
            style={{
              margin: 0,
              color: "#7b6f68",
            }}
          >
            Deine persönliche Sammlung
          </p>

          <h1
            style={{
              margin: "8px 0 0",
              fontSize: "36px",
            }}
          >
            🍷 Mein Weinkeller
          </h1>
        </div>
<input
  type="text"
  placeholder="🔍 Wein, Produzent, Land oder Rebsorte suchen..."
  value={suche}
  onChange={(e) => setSuche(e.target.value)}
  style={{
    width: "100%",
    padding: "14px",
    marginBottom: "24px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    fontSize: "16px",
    boxSizing: "border-box",
  }}
/>
        {weine.length === 0 ? (
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "16px",
              textAlign: "center",
            }}
          >
            <p>Es sind noch keine Weine gespeichert.</p>

            <Link
              href="/wein-hinzufuegen"
              style={{
                display: "inline-block",
                marginTop: "12px",
                padding: "14px 22px",
                backgroundColor: "#7b1026",
                color: "white",
                textDecoration: "none",
                borderRadius: "10px",
                fontWeight: "bold",
              }}
            >
              + Ersten Wein hinzufügen
            </Link>
          </div>
        ) : gefilterteWeine.length === 0 ? (
  <div
    style={{
      backgroundColor: "white",
      padding: "30px",
      borderRadius: "16px",
      textAlign: "center",
    }}
  >
    <p>Keine passenden Weine gefunden.</p>
  </div>
) : (
          <div
            style={{
              display: "grid",
              gap: "18px",
            }}
          >
            {gefilterteWeine.map((wein) => {
              const gesamtwert = wein.anzahl * wein.preis;

              return (
                <article
                  key={wein.id}
                  style={{
                    backgroundColor: "white",
                    padding: "22px",
                    borderRadius: "16px",
                    boxShadow: "0 6px 20px rgba(40, 30, 30, 0.08)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "20px",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          margin: 0,
                          color: "#7b1026",
                          fontWeight: "bold",
                        }}
                      >
                        {wein.produzent}
                      </p>

                      <h2
                         style={{
                          margin: "5px 0 10px",
                          fontSize: "25px",
                        }}
                      >
                        {wein.weinname}
                      </h2>
<div
  style={{
    margin: "5px 0 10px",
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
</div>
                    <button
  type="button"
  onClick={() => alert("Bearbeiten kommt gleich 😊")}
  style={{
    border: "none",
    backgroundColor: "#ece7f8",
    color: "#4b2c83",
    padding: "9px 12px",
    borderRadius: "9px",
    cursor: "pointer",
    marginRight: "8px",
  }}
>
  Bearbeiten
</button>
                    <button
                      type="button"
                      onClick={() => weinLoeschen(wein.id)}
                      style={{
                        border: "none",
                        backgroundColor: "#f4e7e9",
                        color: "#7b1026",
                        padding: "9px 12px",
                        borderRadius: "9px",
                        cursor: "pointer",
                      }}
                    >
                      Löschen
                    </button>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(3, minmax(0, 1fr))",
                      gap: "12px",
                      marginTop: "20px",
                    }}
                  >
                    <div
  style={{
    backgroundColor: "#f6f2ec",
    padding: "14px",
    borderRadius: "10px",
  }}
>
  <p
    style={{
      margin: "0 0 10px",
      color: "#7b6f68",
      fontSize: "13px",
    }}
  >
    Flaschen
  </p>

  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "10px",
    }}
  >
    <button
      type="button"
      onClick={() => bestandAendern(wein.id, -1)}
      disabled={wein.anzahl === 0}
      style={{
        width: "34px",
        height: "34px",
        border: "none",
        borderRadius: "8px",
        backgroundColor: "#eadcdf",
        color: "#7b1026",
        fontSize: "20px",
        cursor: wein.anzahl === 0 ? "not-allowed" : "pointer",
      }}
    >
      −
    </button>

    <strong style={{ fontSize: "18px" }}>{wein.anzahl}</strong>

    <button
      type="button"
      onClick={() => bestandAendern(wein.id, 1)}
      style={{
        width: "34px",
        height: "34px",
        border: "none",
        borderRadius: "8px",
        backgroundColor: "#7b1026",
        color: "white",
        fontSize: "20px",
        cursor: "pointer",
      }}
    >
      +
    </button>
  </div>
</div>

                    <InfoBox
                      title="Preis pro Flasche"
                      value={`CHF ${wein.preis.toFixed(2)}`}
                    />

                    <InfoBox
                      title="Gesamtwert"
                      value={`CHF ${gesamtwert.toFixed(2)}`}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {weine.length > 0 && (
          <Link
            href="/wein-hinzufuegen"
            style={{
              display: "block",
              marginTop: "26px",
              padding: "16px",
              backgroundColor: "#7b1026",
              color: "white",
              textAlign: "center",
              textDecoration: "none",
              borderRadius: "12px",
              fontWeight: "bold",
            }}
          >
            + Weiteren Wein hinzufügen
          </Link>
        )}
      </div>
    </main>
  );
}

function InfoBox({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div
      style={{
        backgroundColor: "#f6f2ec",
        padding: "14px",
        borderRadius: "10px",
      }}
    >
      <p
        style={{
          margin: "0 0 6px",
          color: "#7b6f68",
          fontSize: "13px",
        }}
      >
        {title}
      </p>

      <strong>{value}</strong>
    </div>
  );
}
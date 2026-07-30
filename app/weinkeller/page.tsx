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
};

export default function Weinkeller() {
  const [weine, setWeine] = useState<Wein[]>([]);

  useEffect(() => {
    const daten = localStorage.getItem("weine");

    if (daten) {
      setWeine(JSON.parse(daten));
    }
  }, []);

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
        ) : (
          <div
            style={{
              display: "grid",
              gap: "18px",
            }}
          >
            {weine.map((wein) => {
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

                      <p
                        style={{
                          margin: 0,
                          color: "#6e6560",
                          lineHeight: 1.6,
                        }}
                      >
                        Jahrgang: {wein.jahrgang || "nicht angegeben"}
                        <br />
                        Herkunft:{" "}
                        {[wein.region, wein.land]
                          .filter(Boolean)
                          .join(", ") || "nicht angegeben"}
                        <br />
                        Rebsorte: {wein.rebsorte || "nicht angegeben"}
                      </p>
                    </div>

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
                    <InfoBox
                      title="Flaschen"
                      value={String(wein.anzahl)}
                    />

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
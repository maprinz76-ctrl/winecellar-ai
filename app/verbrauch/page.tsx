"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

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
  async function verbraeucheLaden() {
    const { data, error } = await supabase
      .from("verbraeuche")
      .select("*")
      .order("datum", { ascending: false });

    if (error) {
      console.error("Fehler beim Laden der Verbräuche:", error);
      return;
    }

    const geladeneVerbraeuche: Verbrauch[] = (data || []).map((eintrag: any) => ({
      id: eintrag.id,
      weinId: eintrag.wein_id,
      produzent: eintrag.produzent,
      weinname: eintrag.weinname,
      jahrgang: eintrag.jahrgang,
      datum: eintrag.datum,
      anzahl: Number(eintrag.anzahl || 0),
      preis: Number(eintrag.preis || 0),
    }));

    setVerbraeuche(geladeneVerbraeuche);
  }

  verbraeucheLaden();
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
  const monatsAuswertung = Object.values(
  verbraeuche.reduce((monate, eintrag) => {
    const datum = new Date(eintrag.datum);

    const schluessel = `${datum.getFullYear()}-${datum.getMonth()}`;

    const monatName = datum.toLocaleDateString("de-CH", {
      month: "long",
      year: "numeric",
    });

    if (!monate[schluessel]) {
      monate[schluessel] = {
        monat: monatName,
        flaschen: 0,
        wert: 0,
        datum: datum.getTime(),
      };
    }

    monate[schluessel].flaschen += eintrag.anzahl;
    monate[schluessel].wert += eintrag.anzahl * eintrag.preis;

    return monate;
  }, {} as Record<string, {
    monat: string;
    flaschen: number;
    wert: number;
    datum: number;
  }>)
).sort((a, b) => b.datum - a.datum);
const grenze12Monate = new Date();
grenze12Monate.setMonth(grenze12Monate.getMonth() - 11);
grenze12Monate.setDate(1);
grenze12Monate.setHours(0, 0, 0, 0);

const monatsAuswertungLetzte12Monate = monatsAuswertung.filter(
  (monat) => monat.datum >= grenze12Monate.getTime()
);
async function verbrauchLoeschen(eintrag: Verbrauch) {
  const bestaetigt = window.confirm(
    "Möchtest du diesen Verbrauch wirklich löschen? Die Flasche wird dem Bestand wieder gutgeschrieben."
  );

  if (!bestaetigt) {
    return;
  }

  const { data: weinDaten, error: weinFehler } = await supabase
    .from("weine")
    .select("anzahl")
    .eq("id", eintrag.weinId)
    .single();

  if (weinFehler) {
    console.error("Fehler beim Laden des Weinbestands:", weinFehler);
    return;
  }

  const neuerBestand = Number(weinDaten.anzahl || 0) + eintrag.anzahl;

  const { error: bestandFehler } = await supabase
    .from("weine")
    .update({
      anzahl: neuerBestand,
    })
    .eq("id", eintrag.weinId);

  if (bestandFehler) {
    console.error("Fehler beim Wiederherstellen des Bestands:", bestandFehler);
    return;
  }

  const { error: loeschFehler } = await supabase
    .from("verbraeuche")
    .delete()
    .eq("id", eintrag.id);

  if (loeschFehler) {
    console.error("Fehler beim Löschen des Verbrauchs:", loeschFehler);
    return;
  }

  setVerbraeuche((alt) =>
    alt.filter((verbrauch) => verbrauch.id !== eintrag.id)
  );
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

      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "14px",
          boxShadow: "0 4px 14px rgba(40,30,30,0.06)",
          marginBottom: "28px",
        }}
      >
        <h2
          style={{
            margin: "0 0 16px",
            fontSize: "20px",
            color: "#7b1026",
          }}
        >
          📊 Verbrauch nach Monaten
        </h2>

        {monatsAuswertungLetzte12Monate.length === 0 ? (
          <p style={{ margin: 0 }}>Noch keine Monatsdaten vorhanden.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "10px",
            }}
          >
           {monatsAuswertungLetzte12Monate.map((monat) => (
              <div
                key={monat.monat}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "20px",
                  padding: "12px 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                <strong style={{ textTransform: "capitalize" }}>
                  {monat.monat}
                </strong>

                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    fontWeight: "600",
                  }}
                >
                  <span>
                    🍷 {monat.flaschen}{" "}
                    {monat.flaschen === 1 ? "Flasche" : "Flaschen"}
                  </span>

                  <span>💰 CHF {monat.wert.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {verbraeuche.length === 0 ? (
        <p>Noch keine Entnahmen gespeichert.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "14px",
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
                    🍷 {eintrag.anzahl}{" "}
                    {eintrag.anzahl === 1 ? "Flasche" : "Flaschen"}
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
                  <button
  type="button"
  onClick={() => verbrauchLoeschen(eintrag)}
  style={{
    backgroundColor: "#f7e9ec",
    color: "#7b1026",
    border: "none",
    padding: "8px 12px",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
  }}
>
  🗑️ Löschen
</button>
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
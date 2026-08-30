"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

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
  favorit?: boolean;
archiviert?: boolean;
};
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
export default function Home() {
  const pathname = usePathname();
  const [weine, setWeine] = useState<Wein[]>([]);

  const [verbraeuche, setVerbraeuche] = useState<Verbrauch[]>([]);
const [weinDesAbends, setWeinDesAbends] = useState<Wein | null>(null);
  useEffect(() => {
  async function datenLaden() {
    const { data: weinDaten, error: weinFehler } = await supabase
      .from("weine")
      .select("*");

    if (weinFehler) {
      console.error("Fehler beim Laden der Weine:", weinFehler);
    } else {
      setWeine((weinDaten || []).map((wein: any) => ({
        ...wein,
        anzahl: Number(wein.anzahl || 0),
        preis: Number(wein.preis || 0),
        bewertung: Number(wein.bewertung || 0),
      })));
    }

    const { data: verbrauchsDaten, error: verbrauchsFehler } =
      await supabase
        .from("verbraeuche")
        .select("*")
        .order("datum", { ascending: false });

    if (verbrauchsFehler) {
      console.error(
        "Fehler beim Laden der Verbräuche:",
        verbrauchsFehler
      );
    } else {
      setVerbraeuche(
        (verbrauchsDaten || []).map((eintrag: any) => ({
          id: eintrag.id,
          weinId: eintrag.wein_id,
          produzent: eintrag.produzent,
          weinname: eintrag.weinname,
          jahrgang: eintrag.jahrgang,
          datum: eintrag.datum,
          anzahl: Number(eintrag.anzahl || 0),
          preis: Number(eintrag.preis || 0),
        }))
      );
    }
  }

  datenLaden();
}, []);
function neuenWeinVorschlagen() {
  const verfuegbareWeine = weine.filter(
    (wein) => wein.archiviert !== true && wein.anzahl > 0
  );

  if (verfuegbareWeine.length === 0) {
    setWeinDesAbends(null);
    return;
  }

 const gewichteteWeine = verfuegbareWeine.flatMap((wein) => {
  const gewicht = Math.max(1, wein.bewertung || 1);
  return Array(gewicht).fill(wein);
});

const zufallsIndex = Math.floor(Math.random() * gewichteteWeine.length);
setWeinDesAbends(gewichteteWeine[zufallsIndex]);
}
  const kennzahlen = useMemo(() => {
    const aktiveWeine = weine.filter(
  (wein) => wein.archiviert !== true
);

const archivierteWeine = weine.filter(
  (wein) => wein.archiviert === true
);
const zuletztGetrunken =
  verbraeuche.length > 0 ? verbraeuche[0] : null;
    const anzahlWeine = aktiveWeine.length;
const getrunkeneFlaschen = verbraeuche.reduce(
  (summe, verbrauch) => summe + verbrauch.anzahl,
  0
);
const jetzt = new Date();

const getrunkenDiesenMonat = verbraeuche
  .filter((verbrauch) => {
    const datum = new Date(verbrauch.datum);

    return (
      datum.getMonth() === jetzt.getMonth() &&
      datum.getFullYear() === jetzt.getFullYear()
    );
  })
  .reduce(
    (summe, verbrauch) => summe + verbrauch.anzahl,
    0
  );
  const verbrauchswertDiesenMonat = verbraeuche
  .filter((verbrauch) => {
    const datum = new Date(verbrauch.datum);

    return (
      datum.getMonth() === jetzt.getMonth() &&
      datum.getFullYear() === jetzt.getFullYear()
    );
  })
  .reduce(
    (summe, verbrauch) =>
      summe + verbrauch.anzahl * verbrauch.preis,
    0
  );
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

      const bewerteteWeine = aktiveWeine.filter(
  (wein) => Number(wein.bewertung || 0) > 0
);

const durchschnittBewertung =
  bewerteteWeine.length > 0
    ? bewerteteWeine.reduce(
        (summe, wein) => summe + Number(wein.bewertung || 0),
        0
      ) / bewerteteWeine.length
    : 0;
const lieblingswein =
  aktiveWeine.length > 0
    ? [...aktiveWeine].sort(
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
      anzahlArchivierteWeine: archivierteWeine.length,
      getrunkeneFlaschen,
      getrunkenDiesenMonat,
      verbrauchswertDiesenMonat,
      zuletztGetrunken,
    };
  }, [weine, verbraeuche]);

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

        <section className="dashboard-grid">
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
         <DashboardCard
  icon="📅"
  title="Diesen Monat"
  value={String(kennzahlen.getrunkenDiesenMonat)}
  href="/verbrauch"
/>
<DashboardCard
  icon="💸"
  title="Verbrauchswert"
  value={`CHF ${kennzahlen.verbrauchswertDiesenMonat.toFixed(2)}`}
  href="/verbrauch"
/>
{kennzahlen.zuletztGetrunken && (
  <DashboardCard
    icon="🍷"
    title="Zuletzt getrunken"
    fullWidth={true}
   value={`${kennzahlen.zuletztGetrunken.produzent} – ${kennzahlen.zuletztGetrunken.weinname} · ${new Date(kennzahlen.zuletztGetrunken.datum).toLocaleDateString("de-CH")} · CHF ${kennzahlen.zuletztGetrunken.preis.toFixed(2)}`}
    href="/verbrauch"
  />
)}
          <DashboardCard
  icon="📦"
  title="Archiv"
  value={String(kennzahlen.anzahlArchivierteWeine)}
  fullWidth={true}
  href="/weinkeller?ansicht=archiv"
/>
<div style={{ gridColumn: "1 / -1" }}>
<DashboardCard
  icon="🍷"
  title="Wein des Abends"
  href={weinDesAbends ? `/wein/${weinDesAbends.id}` : undefined}
value={
  weinDesAbends
? `${weinDesAbends.produzent} – ${weinDesAbends.weinname} · ${weinDesAbends.jahrgang} · ${(weinDesAbends.bewertung ?? 0) > 0 ? `⭐ ${weinDesAbends.bewertung}/5` : "Noch nicht bewertet"} · 🍾 ${weinDesAbends.anzahl} ${weinDesAbends.anzahl === 1 ? "Flasche" : "Flaschen"}`
    : "Noch keinen Wein ausgewählt"
}
/>
<button

  type="button"
  onClick={neuenWeinVorschlagen}
  style={{
  marginTop: "12px",
  width: "100%",
  padding: "12px 16px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#7b1026",
  color: "white",
  fontWeight: "700",
  fontSize: "14px",
  cursor: "pointer",
}}
>
  Anderen Wein vorschlagen
</button>
</div>
          {kennzahlen.lieblingswein && (
    
    <Link
  href={`/wein/${kennzahlen.lieblingswein.id}`}
  style={{
    textDecoration: "none",
    color: "inherit",
  }}
>
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
  </Link>
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
    padding: "10px 20px",
    paddingBottom: "max(10px, env(safe-area-inset-bottom))",
    boxShadow: "0 -4px 18px rgba(40, 30, 30, 0.08)",
    zIndex: 1000,
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
          <Link
  href="/"
  style={{
    textDecoration: "none",
    color: pathname === "/" ? "#7b1026" : "#8a817c",
    fontWeight: pathname === "/" ? "bold" : "normal",
    transform: pathname === "/" ? "scale(1.12)" : "scale(1)",
    transition: "0.2s",
  }}
>
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

         <button
  type="button"
  onClick={() => {
    window.location.href = "/weinkeller?suche=1";
  }}
  style={{
    background: "none",
    border: "none",
    padding: 0,
    fontSize: "24px",
    cursor: "pointer",
  }}
>
  🔍
</button>
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
  fullWidth = false,
  href,
}: {
  icon: string;
  title: string;
  value: string;
  fullWidth?: boolean;
  href?: string;
}) {
 
    const inhalt = (
  <div
    style={{
      gridColumn: fullWidth ? "1 / -1" : "auto",
      backgroundColor: "white",
      padding: "22px",
      borderRadius: "16px",
      boxShadow: "0 6px 20px rgba(40, 30, 30, 0.08)",
      cursor: href ? "pointer" : "default",
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

  if (href) {
    return (
      <Link
        href={href}
        style={{
          gridColumn: fullWidth ? "1 / -1" : "auto",
          textDecoration: "none",
          color: "inherit",
        }}
      >
        {inhalt}
      </Link>
    );
  }

  return inhalt;
}
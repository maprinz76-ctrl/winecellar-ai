"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

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
const [verbraeuche, setVerbraeuche] = useState<any[]>([]);
 useEffect(() => {
  async function weinLaden() {
    const { data, error } = await supabase
      .from("weine")
      .select("*")
      .eq("id", Number(params.id))
      .single();

    if (error) {
      console.error("Fehler beim Laden des Weins:", error);
      setWein(null);
      return;
    }
if (data) {
  setWein({
    id: data.id,
    produzent: data.produzent || "",
    weinname: data.weinname || "",
    jahrgang: String(data.jahrgang || ""),
    land: data.land || "",
    region: data.region || "",
    appellation: data.appellation || "",
    rebsorte: data.rebsorte || "",
    anzahl: Number(data.anzahl || 0),
    preis: Number(data.preis || 0),
    bewertung: Number(data.bewertung || 0),
    bild: data.bild || "",
    notiz: data.notiz || "",
    favorit: data.favorit || false,
  });
}
    const { data: verbrauchsDaten, error: verbrauchsFehler } =
  await supabase
    .from("verbraeuche")
    .select("*")
    .eq("wein_id", Number(params.id))
    .order("datum", { ascending: false });

if (verbrauchsFehler) {
  console.error("Fehler beim Laden der Verbräuche:", verbrauchsFehler);
} else {
  setVerbraeuche(verbrauchsDaten || []);
}
}

weinLaden();
}, [params.id]);

async function bestandAendern(veraenderung: number) {
  if (!wein) return;

  if (veraenderung === -1 && wein.anzahl <= 0) {
    return;
  }

  const neueAnzahl = Math.max(0, wein.anzahl + veraenderung);

  // Wenn eine Flasche entnommen wird, Verbrauch speichern
  if (veraenderung === -1 && wein.anzahl > 0) {
    const datum = new Date().toISOString();

    const { data: neuerVerbrauch, error: verbrauchFehler } =
      await supabase
        .from("verbraeuche")
        .insert({
          wein_id: wein.id,
          produzent: wein.produzent,
          weinname: wein.weinname,
          jahrgang: wein.jahrgang,
          datum: datum,
          anzahl: 1,
          preis: wein.preis,
        })
        .select()
        .single();

    if (verbrauchFehler) {
      console.error(
        "Fehler beim Speichern des Verbrauchs:",
        verbrauchFehler
      );
      alert("Der Verbrauch konnte nicht gespeichert werden.");
      return;
    }

    if (neuerVerbrauch) {
      setVerbraeuche((bisher) => [neuerVerbrauch, ...bisher]);
    }
  }

  const { error } = await supabase
    .from("weine")
    .update({
      anzahl: neueAnzahl,
    })
    .eq("id", wein.id);

  if (error) {
    console.error("Fehler beim Ändern des Bestands:", error);
    alert("Der Bestand konnte nicht gespeichert werden.");
    return;
  }

  setWein({
    ...wein,
    anzahl: neueAnzahl,
  });
}
async function verbrauchRueckgaengigMachen(eintrag: any) {
  if (!wein) return;

  const bestaetigt = window.confirm(
    "Möchtest du diesen Verbrauch wirklich rückgängig machen? Die Flasche wird dem Bestand wieder gutgeschrieben."
  );

  if (!bestaetigt) {
    return;
  }

  const neueAnzahl = wein.anzahl + Number(eintrag.anzahl || 0);

  const { error: bestandsFehler } = await supabase
    .from("weine")
    .update({
      anzahl: neueAnzahl,
    })
    .eq("id", wein.id);

  if (bestandsFehler) {
    console.error(
      "Fehler beim Wiederherstellen des Bestands:",
      bestandsFehler
    );
    alert("Der Bestand konnte nicht wiederhergestellt werden.");
    return;
  }

  const { error: loeschFehler } = await supabase
    .from("verbraeuche")
    .delete()
    .eq("id", eintrag.id);

  if (loeschFehler) {
    console.error(
      "Fehler beim Löschen des Verbrauchs:",
      loeschFehler
    );
    alert("Der Verbrauch konnte nicht gelöscht werden.");
    return;
  }

  setWein({
    ...wein,
    anzahl: neueAnzahl,
  });

  setVerbraeuche((bisher) =>
    bisher.filter((verbrauch) => verbrauch.id !== eintrag.id)
  );
}

const getrunkeneFlaschen = verbraeuche.reduce(
  (summe, eintrag) => summe + Number(eintrag.anzahl || 0),
  0
);

const letzterVerbrauch =
  verbraeuche.length > 0 ? verbraeuche[0].datum : null;
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
   onClick={async () => {
  const neuerFavorit = !wein.favorit;

  const { error } = await supabase
    .from("weine")
    .update({
      favorit: neuerFavorit,
    })
    .eq("id", wein.id);

  if (error) {
    console.error("Fehler beim Speichern des Favoriten:", error);
    alert("Der Favorit konnte nicht gespeichert werden.");
    return;
  }

  setWein({
    ...wein,
    favorit: neuerFavorit,
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
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
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
  <div
    style={{
      fontSize: "13px",
      color: "#7b6f68",
      marginBottom: "8px",
    }}
  >
    📦 Bestand
  </div>

  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "14px",
    }}
  >
    <button
      type="button"
      onClick={() => bestandAendern(-1)}
      style={{
  border: "none",
  borderRadius: "50%",
  width: "34px",
  height: "34px",
  cursor: "pointer",
  fontSize: "20px",
  backgroundColor: "#eee8f8",
  color: "#4b2a7b",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}}
    >
      −
    </button>

    <strong>{wein.anzahl} Flaschen</strong>

    <button
      type="button"
      onClick={() => bestandAendern(1)}
      style={{
  border: "none",
  borderRadius: "50%",
  width: "34px",
  height: "34px",
  cursor: "pointer",
  fontSize: "20px",
  backgroundColor: "#eee8f8",
  color: "#4b2a7b",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}}
    >
      +
    </button>
  </div>
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
<hr
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
    marginBottom: "25px",
  }}
>
  <h3
    style={{
      marginTop: 0,
      marginBottom: "12px",
      color: "#7b1026",
    }}
  >
    🍷 Verbrauch dieses Weins
  </h3>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "12px",
    }}
  >
    <div>
      <div
        style={{
          fontSize: "13px",
          color: "#7b6f68",
          marginBottom: "6px",
        }}
      >
        Getrunkene Flaschen
      </div>

      <strong>{getrunkeneFlaschen}</strong>
    </div>

    <div>
      <div
        style={{
          fontSize: "13px",
          color: "#7b6f68",
          marginBottom: "6px",
        }}
      >
        Letzter Verbrauch
      </div>

      <strong>
        {letzterVerbrauch
          ? new Date(letzterVerbrauch).toLocaleDateString("de-CH")
          : "Noch kein Verbrauch"}
      </strong>
    </div>
  </div>
</div>
 
<hr
  style={{
    border: "none",
    borderTop: "1px solid #eee",
    margin: "25px 0",
  }}
/>
{verbraeuche.length > 0 && (
  <div
    style={{
      backgroundColor: "#f6f2ec",
      padding: "18px",
      borderRadius: "12px",
      marginBottom: "25px",
    }}
  >
    <h3
      style={{
        marginTop: 0,
        marginBottom: "12px",
        color: "#7b1026",
      }}
    >
      📋 Verbrauchshistorie
    </h3>

    <div
      style={{
        display: "grid",
        gap: "10px",
      }}
    >
      {verbraeuche.map((eintrag) => (
        <div
          key={eintrag.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
            borderBottom: "1px solid #e5ded7",
            paddingBottom: "10px",
          }}
        >
          <span>
            {new Date(eintrag.datum).toLocaleDateString("de-CH")}
          </span>

          <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
  }}
>
  <strong>
    🍷 {eintrag.anzahl}{" "}
    {Number(eintrag.anzahl) === 1 ? "Flasche" : "Flaschen"}
  </strong>

  <button
    type="button"
    onClick={() => verbrauchRueckgaengigMachen(eintrag)}
    style={{
      border: "none",
      backgroundColor: "#f7e9ec",
      color: "#7b1026",
      borderRadius: "8px",
      padding: "6px 10px",
      cursor: "pointer",
      fontWeight: "bold",
    }}
    title="Verbrauch rückgängig machen"
  >
    ↩️
  </button>
</div>
        </div>
      ))}
    </div>
  </div>
)}
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
<Link
  href={`/wein-bearbeiten/${wein.id}`}
>
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
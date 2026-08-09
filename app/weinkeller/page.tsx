"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import WeinKarte from "../components/WeinKarte";

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
  bild?: string;
  favorit?: boolean;
  archiviert?: boolean;
};

export default function Weinkeller() {
  const [weine, setWeine] = useState<Wein[]>([]);
const [suche, setSuche] = useState("");
const [sortierung, setSortierung] = useState("name");
const [nurFavoriten, setNurFavoriten] = useState(false);
const [archivAnzeigen, setArchivAnzeigen] = useState(false);
  useEffect(() => {
    
        const daten = localStorage.getItem("weine");

    if (daten) {
      setWeine(JSON.parse(daten));
    }
  }, []);
const gefilterteWeine = weine
  .filter((wein: Wein) => {
    const text = `
      ${wein.produzent}
      ${wein.weinname}
      ${wein.land}
      ${wein.region}
      ${wein.rebsorte}
      ${wein.jahrgang}
    `.toLowerCase();

   const passtZurSuche = text.includes(suche.toLowerCase());
const passtZuFavoriten = !nurFavoriten || wein.favorit === true;
const passtZumArchiv = archivAnzeigen
  ? wein.archiviert === true
  : wein.archiviert !== true;

return passtZurSuche && passtZuFavoriten && passtZumArchiv;
  })
  .sort((a, b) => {
    switch (sortierung) {
      case "name":
        return a.weinname.localeCompare(b.weinname);

      case "produzent":
        return a.produzent.localeCompare(b.produzent);

      case "bewertung":
        return b.bewertung - a.bewertung;

      case "preisAuf":
        return a.preis - b.preis;

      case "preisAb":
        return b.preis - a.preis;

      case "jahrgang":
        return Number(b.jahrgang) - Number(a.jahrgang);

      default:
        return 0;
    }
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
  function weinArchivieren(id: number) {
 const aktuellerWein = weine.find((wein) => wein.id === id);

const bestaetigt = window.confirm(
  aktuellerWein?.archiviert
    ? "Möchtest du diesen Wein zurück in den Weinkeller legen?"
    : "Möchtest du diesen Wein wirklich archivieren?"
);

  if (!bestaetigt) {
    return;
  }

 const neueListe = weine.map((wein) =>
  wein.id === id
    ? { ...wein, archiviert: !wein.archiviert }
    : wein
);

  setWeine(neueListe);
  localStorage.setItem("weine", JSON.stringify(neueListe));
}
  function backupExportieren() {
    const daten = localStorage.getItem("weine");

    if (!daten) {
      alert("Es sind keine Weine zum Sichern vorhanden.");
      return;
    }

    const blob = new Blob([daten], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `weinkeller-backup-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;

    link.click();
    URL.revokeObjectURL(url);
  }
    function backupImportieren(datei: File) {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const inhalt = event.target?.result;

        if (typeof inhalt !== "string") {
          alert("Die Backup-Datei konnte nicht gelesen werden.");
          return;
        }

        const importierteWeine = JSON.parse(inhalt);

        if (!Array.isArray(importierteWeine)) {
          alert("Diese Datei ist kein gültiges Weinkeller-Backup.");
          return;
        }

        const bestaetigt = window.confirm(
          "Möchtest du das Backup wirklich wiederherstellen? Die aktuell gespeicherten Weine werden ersetzt."
        );

        if (!bestaetigt) return;

        localStorage.setItem("weine", JSON.stringify(importierteWeine));
        setWeine(importierteWeine);

        alert("Backup wurde erfolgreich wiederhergestellt.");
      } catch {
        alert("Die Backup-Datei ist ungültig oder beschädigt.");
      }
    };

    reader.readAsText(datei);
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
        <div
  style={{
    marginBottom: "15px",
    display: "flex",
    justifyContent: "flex-end",
  }}
>
  <select
    value={sortierung}
    onChange={(e) => setSortierung(e.target.value)}
    style={{
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #ddd",
      fontSize: "15px",
    }}
  >
    <option value="name">Name A–Z</option>
    <option value="produzent">Produzent</option>
    <option value="bewertung">Bewertung</option>
    <option value="preisAuf">Preis ↑</option>
    <option value="preisAb">Preis ↓</option>
    <option value="jahrgang">Jahrgang</option>
  </select>
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
<button
  type="button"
  onClick={() => setNurFavoriten(!nurFavoriten)}
  style={{
    marginBottom: "24px",
    padding: "10px 16px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: nurFavoriten ? "#7b1026" : "#f3eee8",
    color: nurFavoriten ? "white" : "#7b1026",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  }}
>
  ❤️ {nurFavoriten ? "Alle Weine anzeigen" : "Nur Favoriten"}
</button>
<button
  type="button"
  onClick={() => setArchivAnzeigen(!archivAnzeigen)}
  style={{
    marginLeft: "10px",
    marginBottom: "24px",
    padding: "10px 16px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: archivAnzeigen ? "#7b1026" : "#f3eee8",
    color: archivAnzeigen ? "white" : "#7b1026",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  }}
>
  📦 {archivAnzeigen ? "Aktive Weine anzeigen" : "Archiv anzeigen"}
</button>
<button
  type="button"
  onClick={backupExportieren}
  style={{
    marginLeft: "10px",
    marginBottom: "24px",
    padding: "10px 16px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#f3eee8",
    color: "#7b1026",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  }}
>
  💾 Backup erstellen
</button>
<label
  style={{
    marginLeft: "12px",
    padding: "12px 18px",
    backgroundColor: "#f4f1ec",
    color: "#7b1026",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
    display: "inline-block",
  }}
>
  📥 Backup wiederherstellen
  <input
    type="file"
    accept=".json,application/json"
    style={{ display: "none" }}
    onChange={(e) => {
      const datei = e.target.files?.[0];
      if (datei) {
        backupImportieren(datei);
      }
      e.target.value = "";
    }}
  />
</label>
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
{gefilterteWeine.map((wein) => (
  <WeinKarte
    key={wein.id}
    wein={wein}
    bestandAendern={bestandAendern}
    bewertungAendern={bewertungAendern}
    weinLoeschen={weinLoeschen}
    weinArchivieren={weinArchivieren}
  />
))}
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
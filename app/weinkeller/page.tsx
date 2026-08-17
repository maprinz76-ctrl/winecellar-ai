"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import WeinKarte from "../components/WeinKarte";

type Wein = {
  id: number;
  produzent: string;
  weinname: string;
  jahrgang: string;
  land: string;
  region: string;
  rebsorte: string;
  appellation: string;
  anzahl: number;
  preis: number;
  bewertung: number;
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
export default function Weinkeller() {
  const pathname = usePathname();
  const [weine, setWeine] = useState<Wein[]>([]);
const [suche, setSuche] = useState("");
const suchfeldRef = useRef<HTMLInputElement>(null);
const [sortierung, setSortierung] = useState("name");
const [nurFavoriten, setNurFavoriten] = useState(false);
const [archivAnzeigen, setArchivAnzeigen] = useState(false);
const [filterAnzeigen, setFilterAnzeigen] = useState(false);
const [filterLand, setFilterLand] = useState("");
const [filterRegion, setFilterRegion] = useState("");
const [filterRebsorte, setFilterRebsorte] = useState("");
const [filterBewertung, setFilterBewertung] = useState("");
  useEffect(() => {
  const daten = localStorage.getItem("weine");

  if (daten) {
    setWeine(JSON.parse(daten));
  }

  const parameter = new URLSearchParams(window.location.search);

  if (parameter.get("ansicht") === "archiv") {
    setArchivAnzeigen(true);
  }
 if (parameter.get("suche") === "1") {
  setTimeout(() => {
    suchfeldRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    suchfeldRef.current?.focus();
  }, 300);
}
}, []);
const gefilterteWeine = weine
  .filter((wein: Wein) => {
    const text = `
      ${wein.produzent}
      ${wein.weinname}
      ${wein.land}
      ${wein.region}
      ${wein.appellation}
      ${wein.rebsorte}
      ${wein.jahrgang}
    `.toLowerCase();

   const passtZurSuche = text.includes(suche.toLowerCase());
const passtZuFavoriten = !nurFavoriten || wein.favorit === true;
const passtZumArchiv = archivAnzeigen
  ? wein.archiviert === true
  : wein.archiviert !== true;

const passtZumLand =
  !filterLand || wein.land === filterLand;
const passtZurRegion =
  !filterRegion || wein.region === filterRegion;
  const passtZurRebsorte =
  !filterRebsorte ||
  wein.rebsorte
    .split(",")
    .map((rebsorte) => rebsorte.trim())
    .includes(filterRebsorte);
    const passtZurBewertung =
  !filterBewertung ||
  (wein.bewertung || 0) >= Number(filterBewertung);
return (
  passtZurSuche &&
  passtZuFavoriten &&
  passtZumArchiv &&
  passtZumLand &&
  passtZurRegion &&
  passtZurRebsorte &&
  passtZurBewertung
);
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
  const aktuellerWein = weine.find((wein) => wein.id === id);

  if (!aktuellerWein) {
    return;
  }

  // Verbrauch speichern, wenn eine Flasche entnommen wird
  if (veraenderung === -1 && aktuellerWein.anzahl > 0) {
    const gespeicherteVerbraeuche = localStorage.getItem("verbraeuche");
    const verbraeuche: Verbrauch[] = gespeicherteVerbraeuche
      ? JSON.parse(gespeicherteVerbraeuche)
      : [];

    const neuerVerbrauch: Verbrauch = {
      id: Date.now(),
      weinId: aktuellerWein.id,
      produzent: aktuellerWein.produzent,
      weinname: aktuellerWein.weinname,
      jahrgang: aktuellerWein.jahrgang,
      datum: new Date().toISOString(),
      anzahl: 1,
      preis: aktuellerWein.preis,
    };

    localStorage.setItem(
      "verbraeuche",
      JSON.stringify([...verbraeuche, neuerVerbrauch])
    );
  }
let sollArchiviertWerden = false;

if (
  veraenderung === -1 &&
  aktuellerWein.anzahl === 1 &&
  !aktuellerWein.archiviert
) {
  sollArchiviertWerden = window.confirm(
    "Das war die letzte Flasche. Möchtest du diesen Wein jetzt ins Archiv verschieben?"
  );
}
  const neueListe = weine.map((wein) => {
    if (wein.id !== id) {
      return wein;
    }

    return {
      ...wein,
      anzahl: Math.max(0, wein.anzahl + veraenderung),
      archiviert: sollArchiviertWerden || wein.archiviert,
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

  if (!aktuellerWein) {
    return;
  }

  if (aktuellerWein.archiviert) {
    const eingabe = window.prompt(
      "Wie viele Flaschen möchtest du zurück in den Weinkeller legen?",
      "1"
    );

    if (eingabe === null) {
      return;
    }

    const neueAnzahl = Number(eingabe);

    if (!Number.isInteger(neueAnzahl) || neueAnzahl < 1) {
      alert("Bitte eine ganze Zahl ab 1 eingeben.");
      return;
    }

    const neueListe = weine.map((wein) =>
      wein.id === id
        ? {
            ...wein,
            archiviert: false,
            anzahl: neueAnzahl,
          }
        : wein
    );

    setWeine(neueListe);
    localStorage.setItem("weine", JSON.stringify(neueListe));
    return;
  }

  const bestaetigt = window.confirm(
  aktuellerWein.anzahl === 0
    ? "Der Bestand ist 0. Möchtest du diesen Wein ins Archiv verschieben?"
    : `Möchtest du diesen Wein wirklich archivieren? Der aktuelle Bestand von ${aktuellerWein.anzahl} ${aktuellerWein.anzahl === 1 ? "Flasche" : "Flaschen"} wird auf 0 gesetzt.`
);

  if (!bestaetigt) {
    return;
  }

  const neueListe = weine.map((wein) =>
    wein.id === id
      ? {
          ...wein,
          archiviert: true,
          anzahl: 0,
        }
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
ref={suchfeldRef}
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
<Link
  href="/verbrauch"
  style={{
    marginLeft: "12px",
    padding: "12px 18px",
    backgroundColor: "#f4f1ec",
    color: "#7b1026",
    borderRadius: "10px",
    fontWeight: "bold",
    textDecoration: "none",
    display: "inline-block",
  }}
>
  🍷 Verbrauch
</Link>
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
><button
  type="button"
  onClick={() => setFilterAnzeigen(!filterAnzeigen)}
  style={{
    border: "none",
    backgroundColor: "#f6f2ec",
    padding: "12px 16px",
    borderRadius: "10px",
    color: "#7b1026",
    fontWeight: "bold",
    cursor: "pointer",
  }}
>
  ⚙️ Filter
</button>
{filterAnzeigen && (
  <div
    style={{
      marginTop: "12px",
      marginBottom: "24px",
      padding: "16px",
      backgroundColor: "#f6f2ec",
      borderRadius: "12px",
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gap: "12px",
    }}
  >
    <select
  value={filterLand}
  onChange={(e) => setFilterLand(e.target.value)}
>
  <option value="">Alle Länder</option>
  <option value="Deutschland">Deutschland</option>
  <option value="Frankreich">Frankreich</option>
  <option value="Italien">Italien</option>
  <option value="Schweiz">Schweiz</option>
  <option value="Spanien">Spanien</option>
  <option value="Portugal">Portugal</option>
  <option value="Österreich">Österreich</option>
  <option value="Argentinien">Argentinien</option>
  <option value="Chile">Chile</option>
  <option value="USA">USA</option>
  <option value="Australien">Australien</option>
  <option value="Neuseeland">Neuseeland</option>
</select>
<select
  value={filterRegion}
  onChange={(e) => setFilterRegion(e.target.value)}
>
  <option value="">Alle Regionen</option>

  {[...new Set(
    weine
      .map((wein) => wein.region)
      .filter((region) => region)
  )]
    .sort()
    .map((region) => (
      <option key={region} value={region}>
        {region}
      </option>
    ))}
</select>
    <select
  value={filterRebsorte}
  onChange={(e) => setFilterRebsorte(e.target.value)}
>
  <option value="">Alle Rebsorten</option>

  {[...new Set(
    weine
      .flatMap((wein) =>
        wein.rebsorte
          .split(",")
          .map((rebsorte) => rebsorte.trim())
      )
      .filter((rebsorte) => rebsorte)
  )]
    .sort()
    .map((rebsorte) => (
      <option key={rebsorte} value={rebsorte}>
        {rebsorte}
      </option>
    ))}
</select>

<select
  value={filterBewertung}
  onChange={(e) => setFilterBewertung(e.target.value)}
>
  <option value="">Alle Bewertungen</option>
  <option value="5">★★★★★</option>
  <option value="4">★★★★☆ und besser</option>
  <option value="3">★★★☆☆ und besser</option>
  <option value="2">★★☆☆☆ und besser</option>
  <option value="1">★☆☆☆☆ und besser</option>
</select>
<button
  type="button"
  onClick={() => {
    setFilterLand("");
    setFilterRegion("");
    setFilterRebsorte("");
    setFilterBewertung("");
  }}
  style={{
    gridColumn: "1 / -1",
    border: "none",
    backgroundColor: "#7b1026",
    color: "white",
    padding: "10px 14px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  }}
>
  Filter zurücksetzen
</button>
  </div>
)}
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
      <nav
  style={{
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTop: "1px solid #ded8d2",
    padding: "12px 20px",
    zIndex: 1000,
  }}
>
  <div
    style={{
      maxWidth: "820px",
      margin: "0 auto",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      fontSize: "24px",
    }}
  >
    <Link href="/" style={{ textDecoration: "none" }}>
      🏠
    </Link>

    <Link
      href="/weinkeller"
      style={{
        textDecoration: "none",
        borderBottom:
          pathname === "/weinkeller" ? "3px solid #7b1026" : "none",
        paddingBottom: "5px",
      }}
    >
      🍷
    </Link>

    <Link href="/wein-hinzufuegen" style={{ textDecoration: "none" }}>
      ➕
    </Link>

    <button
  type="button"
  onClick={() => {
    suchfeldRef.current?.focus();
    suchfeldRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }}
  style={{
    background: "none",
    border: "none",
    padding: "0 0 5px",
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
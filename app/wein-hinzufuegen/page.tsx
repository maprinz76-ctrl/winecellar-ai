"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { supabase } from "../../lib/supabase";
  export default function WeinHinzufuegen() {
    
    const pathname = usePathname();
    const [produzent, setProduzent] = useState("");
  const [weinname, setWeinname] = useState("");
  const [jahrgang, setJahrgang] = useState("");
  const [land, setLand] = useState("");
  const [region, setRegion] = useState("");
  const [appellation, setAppellation] = useState("");
  const [rebsorte, setRebsorte] = useState("");
  const [anzahl, setAnzahl] = useState("");
  const [preis, setPreis] = useState("");
  const [bild, setBild] = useState("");
  const [kiLaedt, setKiLaedt] = useState(false);
const [kiFehler, setKiFehler] = useState("");
const [unsichereFelder, setUnsichereFelder] = useState<string[]>([]);
const [kiWarnung, setKiWarnung] = useState("");
const dateiInputRef = useRef<HTMLInputElement>(null);
function feldBestaetigen(feld: string) {
  setUnsichereFelder((aktuell) => {
    const neueFelder = aktuell.filter((eintrag) => eintrag !== feld);

    if (neueFelder.length > 0) {
      setKiWarnung(
        `Bitte prüfen: ${neueFelder.join(", ")} wurde von der KI nicht eindeutig erkannt.`
      );
    } else {
      setKiWarnung("");
    }

    return neueFelder;
  });
}
  function bildAuswaehlen(event: React.ChangeEvent<HTMLInputElement>) {
  const datei = event.target.files?.[0];

  if (!datei) {
    return;
  }

  if (!datei.type.startsWith("image/")) {
    alert("Bitte eine Bilddatei auswählen.");
    return;
  }

 const reader = new FileReader();

reader.onload = () => {
  if (typeof reader.result !== "string") {
    return;
  }

  const img = new Image();

  img.onload = () => {
    const maxBreite = 900;
    const faktor = Math.min(1, maxBreite / img.width);

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * faktor);
    canvas.height = Math.round(img.height * faktor);

    const context = canvas.getContext("2d");

    if (!context) {
      setBild(reader.result as string);
      return;
    }

    context.drawImage(img, 0, 0, canvas.width, canvas.height);

    const komprimiertesBild = canvas.toDataURL("image/jpeg", 0.75);
    setBild(komprimiertesBild);
  };

  img.src = reader.result;
};

reader.readAsDataURL(datei);
}
 async function etikettErkennen() {
  if (!bild) {
    setKiFehler("Bitte zuerst ein Foto auswählen.");
    return;
  }

  setKiLaedt(true);
  setKiFehler("");

  try {
    const response = await fetch("/api/wein-erkennen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bild,
      }),
    });

    const daten = await response.json();

    if (!response.ok) {
      setKiFehler(daten.fehler || "Die Weinerkennung ist fehlgeschlagen.");
      return;
    }

    const text = daten.output
  ?.flatMap((eintrag: any) => eintrag.content || [])
  ?.find((inhalt: any) => inhalt.type === "output_text")
  ?.text;

if (!text) {
  setKiFehler("Die KI hat keine Weindaten zurückgegeben.");
  return;
}

const weinDaten = JSON.parse(text);
console.log("KI-Sicherheitswerte:", weinDaten.sicherheit);

const sicherheit = weinDaten.sicherheit || {};
const neueUnsichereFelder: string[] = [];

if (sicherheit.produzent >= 70 && sicherheit.produzent < 90) {
  neueUnsichereFelder.push("Produzent");
}

if (sicherheit.weinname >= 70 && sicherheit.weinname < 90) {
  neueUnsichereFelder.push("Weinname");
}

if (sicherheit.jahrgang >= 70 && sicherheit.jahrgang < 90) {
  neueUnsichereFelder.push("Jahrgang");
}

if (sicherheit.land >= 70 && sicherheit.land < 90) {
  neueUnsichereFelder.push("Land");
}

if (sicherheit.region >= 70 && sicherheit.region < 90) {
  neueUnsichereFelder.push("Region");
}

if (sicherheit.appellation >= 70 && sicherheit.appellation < 90) {
  neueUnsichereFelder.push("Appellation");
}

if (sicherheit.rebsorte >= 70 && sicherheit.rebsorte < 90) {
  neueUnsichereFelder.push("Rebsorte");
}

if (neueUnsichereFelder.length > 0) {
  setKiWarnung(
    `Bitte prüfen: ${neueUnsichereFelder.join(", ")} wurde von der KI nicht eindeutig erkannt.`
  );
} else {
  setKiWarnung("");
}

setUnsichereFelder(neueUnsichereFelder);

setProduzent(
  sicherheit.produzent >= 70 ? weinDaten.produzent || "" : ""
);

setWeinname(
  sicherheit.weinname >= 70 ? weinDaten.weinname || "" : ""
);

setJahrgang(
  sicherheit.jahrgang >= 70 ? weinDaten.jahrgang || "" : ""
);

setLand(
  sicherheit.land >= 70 ? weinDaten.land || "" : ""
);

setRegion(
  sicherheit.region >= 70 ? weinDaten.region || "" : ""
);

setAppellation(
  sicherheit.appellation >= 70 ? weinDaten.appellation || "" : ""
);

setRebsorte(
  sicherheit.rebsorte >= 70 ? weinDaten.rebsorte || "" : ""
);
  } catch {
    setKiFehler("Die Verbindung zur Weinerkennung ist fehlgeschlagen.");
  } finally {
    setKiLaedt(false);
  }
}
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!produzent.trim() || !weinname.trim()) {
      alert("Bitte Produzent und Weinname eingeben.");
      return;
    }

    const neuerWein = {
      id: Date.now(),
      produzent,
      weinname,
      jahrgang,
      land,
      region,
      appellation,
      rebsorte,
      anzahl: Number(anzahl),
      preis: Number(preis),
      bewertung: 0,
      bild,
    };

    const { error } = await supabase
  .from("weine")
  .insert([
    {
      produzent,
      weinname,
      jahrgang: jahrgang ? Number(jahrgang) : null,
      land,
      region,
      appellation,
      rebsorte,
      anzahl: Number(anzahl),
      preis: Number(preis),
      bewertung: 0,
      bild: bild || null,
    },
  ]);

if (error) {
  console.error("Fehler beim Speichern des Weins:", error);
  alert("Der Wein konnte nicht gespeichert werden.");
  return;
}

    alert(`${produzent} ${weinname} wurde gespeichert.`);

    setProduzent("");
setWeinname("");
setJahrgang("");
setLand("");
setRegion("");
setAppellation("");
setRebsorte("");
setAnzahl("");
setPreis("");
setBild("");
if (dateiInputRef.current) {
  dateiInputRef.current.value = "";
}
setUnsichereFelder([]);
setKiWarnung("");
setKiFehler("");
  }
  return (
    <main
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        fontFamily: "Arial",
        padding: "20px",
      }}
    >
      <h1>🍷 Wein hinzufügen</h1>
<button
  type="button"
  onClick={etikettErkennen}
  disabled={kiLaedt}
  style={{
    width: "100%",
    marginTop: "20px",
    marginBottom: "10px",
    padding: "14px",
    backgroundColor: "#ece7f8",
    color: "#4b2c83",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  }}
>
 {kiLaedt ? "🤖 Analysiere Etikett..." : "📷 Etikett erkennen"}
</button>
{kiFehler && (
  <p
    style={{
      color: "#b42318",
      margin: "8px 0 0",
      fontSize: "14px",
    }}
  >
    {kiFehler}
  </p>
)}
{kiWarnung && (
  <p
    style={{
      color: "#9a6700",
      backgroundColor: "#fff8e1",
      padding: "10px 12px",
      borderRadius: "8px",
      margin: "8px 0 0",
      fontSize: "14px",
    }}
  >
    ⚠️ {kiWarnung}
  </p>
)}
<div
  style={{
    background: "white",
    padding: "28px",
    borderRadius: "18px",
    boxShadow: "0 6px 20px rgba(40,30,30,0.08)",
    marginTop: "25px",
  }}
>
<form
  onSubmit={handleSubmit}
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "0",
  }}
>
        <input
  placeholder="Produzent"
  value={produzent}
 onChange={(e) => {
  setProduzent(e.target.value);
  feldBestaetigen("Produzent");
}}
  style={{
    backgroundColor: unsichereFelder.includes("Produzent")
      ? "#fff8e1"
      : "white",
    border: unsichereFelder.includes("Produzent")
      ? "1px solid #d4a017"
      : "1px solid #ddd",
  }}
/>
        <input
  placeholder="Weinname"
  value={weinname}
  onChange={(e) => {
  setWeinname(e.target.value);
  feldBestaetigen("Weinname");
}}
  style={{
    backgroundColor: unsichereFelder.includes("Weinname")
      ? "#fff8e1"
      : "white",
    border: unsichereFelder.includes("Weinname")
      ? "1px solid #d4a017"
      : "1px solid #ddd",
  }}
/>
        <input
  placeholder="Jahrgang"
  type="number"
  value={jahrgang}
  onChange={(e) => {
  setJahrgang(e.target.value);
  feldBestaetigen("Jahrgang");
}}
  style={{
    backgroundColor: unsichereFelder.includes("Jahrgang")
      ? "#fff8e1"
      : "white",
    border: unsichereFelder.includes("Jahrgang")
      ? "1px solid #d4a017"
      : "1px solid #ddd",
  }}
/>

       <input
  placeholder="Land"
  value={land}
  onChange={(e) => {
  setLand(e.target.value);
  feldBestaetigen("Land");
}}
  style={{
    backgroundColor: unsichereFelder.includes("Land")
      ? "#fff8e1"
      : "white",
    border: unsichereFelder.includes("Land")
      ? "1px solid #d4a017"
      : "1px solid #ddd",
  }}
/>
        <input
  placeholder="Region"
  value={region}
 onChange={(e) => {
  setRegion(e.target.value);
feldBestaetigen("Region");
}}
  style={{
    backgroundColor: unsichereFelder.includes("Region")
      ? "#fff8e1"
      : "white",
    border: unsichereFelder.includes("Region")
      ? "1px solid #d4a017"
      : "1px solid #ddd",
  }}
/>
<input
  type="text"
  placeholder="Appellation"
  value={appellation}
  onChange={(e) => {
  setAppellation(e.target.value);
  feldBestaetigen("Appellation");
}}
  style={{
    backgroundColor: unsichereFelder.includes("Appellation")
      ? "#fff8e1"
      : "white",
    border: unsichereFelder.includes("Appellation")
      ? "1px solid #d4a017"
      : "1px solid #ddd",
  }}
/>
 <textarea
  placeholder="Rebsorte"
  value={rebsorte}
 onChange={(e) => {
  setRebsorte(e.target.value);
  feldBestaetigen("Rebsorte");
}}
  rows={2}
  style={{
    resize: "vertical",
    fontFamily: "inherit",
    backgroundColor: unsichereFelder.includes("Rebsorte")
      ? "#fff8e1"
      : "white",
    border: unsichereFelder.includes("Rebsorte")
      ? "1px solid #d4a017"
      : "1px solid #ddd",
  }}
/>
        <input
  placeholder="Anzahl Flaschen"
  type="number"
  min="0"
  value={anzahl}
  onChange={(e) => setAnzahl(e.target.value)}
/>
        <input
  placeholder="Kaufpreis in CHF"
  type="number"
  step="0.05"
  value={preis}
  onChange={(e) => setPreis(e.target.value)}
/>

  <label
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    fontWeight: "bold",
  }}
>
  Foto der Flasche

  <input
    type="file"
    ref={dateiInputRef}
    accept="image/*"
    capture="environment"
    onChange={bildAuswaehlen}
  />
</label>

{bild && (
  <img
     src={bild}
  alt="Vorschau"
  style={{
    width: "140px",
    display: "block",
    margin: "0 auto 15px auto",
    borderRadius: "10px",
    border: "1px solid #ddd",
    }}
  />
)}
<button
  type="submit"
  style={{
            background: "#8b0f24",
            color: "white",
            padding: "15px",
            border: "none",
            borderRadius: "8px",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          Speichern
        </button>
            </form>
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

    <Link href="/weinkeller" style={{ textDecoration: "none" }}>
      🍷
    </Link>

    <Link
      href="/wein-hinzufuegen"
      style={{
        textDecoration: "none",
        borderBottom:
          pathname === "/wein-hinzufuegen"
            ? "3px solid #7b1026"
            : "none",
        paddingBottom: "5px",
      }}
    >
      ➕
    </Link>

    <Link
  href="/weinkeller?suche=1"
  style={{
    textDecoration: "none",
  }}
>
  🔍
</Link>

    <span>👤</span>
  </div>
</nav>
    </main>
  );
}
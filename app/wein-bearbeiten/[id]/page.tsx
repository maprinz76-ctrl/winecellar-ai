"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
export default function WeinBearbeiten() {  
    const params = useParams();
const router = useRouter();
const id = Number(params.id);

const [wein, setWein] = useState({
  produzent: "",
  weinname: "",
  jahrgang: "",
  land: "",
  region: "",
  appellation: "",
  rebsorte: "",
  preis: 0,
  anzahl: 1,
  bewertung: 0,
 
  bild: "",
  notiz: "",
  trinkfenster_von: null as number | null,
  trinkfenster_bis: null as number | null,
  trinkfenster_quelle: "",
  trinkfenster_typ: "",
  
falstaff_punkte: null as number | null,
parker_punkte: null as number | null,
suckling_punkte: null as number | null,
winespectator_punkte: null as number | null,
vivino_bewertung: null as number | null,

falstaff_quelle: "",
parker_quelle: "",
suckling_quelle: "",
winespectator_quelle: "",
vivino_quelle: "",

falstaff_quellenart: "",
parker_quellenart: "",
suckling_quellenart: "",
winespectator_quellenart: "",
vivino_quellenart: "",

alkoholgehalt: null as number | null,
weinstil: "",
kaufdatum: "",

});

useEffect(() => {
  async function weinLaden() {
    const { data, error } = await supabase
      .from("weine")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Fehler beim Laden des Weins:", error);
      return;
    }

    if (data) {
      setWein({
        falstaff_quellenart: data.falstaff_quellenart || "",
parker_quellenart: data.parker_quellenart || "",
suckling_quellenart: data.suckling_quellenart || "",
winespectator_quellenart: data.winespectator_quellenart || "",
vivino_quellenart: data.vivino_quellenart || "",
        produzent: data.produzent || "",
        weinname: data.weinname || "",
        jahrgang: String(data.jahrgang || ""),
        land: data.land || "",
        region: data.region || "",
        appellation: data.appellation || "",
        rebsorte: data.rebsorte || "",
        preis: Number(data.preis || 0),
        anzahl: Number(data.anzahl || 0),
        bewertung: Number(data.bewertung || 0),
        bild: data.bild || "",
        notiz: data.notiz || "",
        
trinkfenster_von: data.trinkfenster_von ?? null,
trinkfenster_bis: data.trinkfenster_bis ?? null,
trinkfenster_quelle: data.trinkfenster_quelle ?? "",
trinkfenster_typ: data.trinkfenster_typ ?? "",

falstaff_punkte: data.falstaff_punkte ?? null,
parker_punkte: data.parker_punkte ?? null,
suckling_punkte: data.suckling_punkte ?? null,
winespectator_punkte: data.winespectator_punkte ?? null,
vivino_bewertung: data.vivino_bewertung ?? null,

falstaff_quelle: data.falstaff_quelle ?? "",
parker_quelle: data.parker_quelle ?? "",
suckling_quelle: data.suckling_quelle ?? "",
winespectator_quelle: data.winespectator_quelle ?? "",
vivino_quelle: data.vivino_quelle ?? "",

alkoholgehalt: data.alkoholgehalt ?? null,
weinstil: data.weinstil ?? "",
kaufdatum: data.kaufdatum ?? "",



      });
    }
  }

  weinLaden();
}, [id]);
async function speichern() {
  const { error } = await supabase
    .from("weine")
    .update({
      produzent: wein.produzent,
      weinname: wein.weinname,
      jahrgang: wein.jahrgang,
      land: wein.land,
      region: wein.region,
      appellation: wein.appellation,
      rebsorte: wein.rebsorte,
      anzahl: Number(wein.anzahl || 0),
      preis: Number(wein.preis || 0),
      bewertung: Number(wein.bewertung || 0),
      bild: wein.bild,
      notiz: wein.notiz,
      
      trinkfenster_von: wein.trinkfenster_von,
      trinkfenster_bis: wein.trinkfenster_bis,
      trinkfenster_quelle: wein.trinkfenster_quelle,
      trinkfenster_typ: wein.trinkfenster_typ,
      
falstaff_punkte: wein.falstaff_punkte,
parker_punkte: wein.parker_punkte,
suckling_punkte: wein.suckling_punkte,
winespectator_punkte: wein.winespectator_punkte,
vivino_bewertung: wein.vivino_bewertung,

falstaff_quelle: wein.falstaff_quelle || null,
parker_quelle: wein.parker_quelle || null,
suckling_quelle: wein.suckling_quelle || null,
winespectator_quelle: wein.winespectator_quelle || null,
vivino_quelle: wein.vivino_quelle || null,

falstaff_quellenart: wein.falstaff_quellenart || null,
parker_quellenart: wein.parker_quellenart || null,
suckling_quellenart: wein.suckling_quellenart || null,
winespectator_quellenart: wein.winespectator_quellenart || null,
vivino_quellenart: wein.vivino_quellenart || null,

alkoholgehalt: wein.alkoholgehalt,
weinstil: wein.weinstil,
kaufdatum: wein.kaufdatum || null,


    })
    .eq("id", id);

  if (error) {
    console.error("Fehler beim Speichern des Weins:", error);
    alert("Der Wein konnte nicht gespeichert werden.");
    return;
  }

  router.push(`/wein/${id}`);
}
  return (
    <main
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        padding: "30px",
        backgroundColor: "white",
        borderRadius: "16px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        fontFamily: "Arial",
      }}
    >
      <h1>🍷 Wein bearbeiten</h1>

      <p>Passe die gewünschten Angaben an und speichere die Änderungen.</p>

      <hr style={{ margin: "25px 0" }} />

     <label>Produzent</label>
<input
  type="text"
  value={wein.produzent}
  onChange={(e) =>
    setWein({
      ...wein,
      produzent: e.target.value,
    })
  }
  style={{
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    marginBottom: "18px",
  }}
/>

<label>Weinname</label>
<input
  type="text"
  value={wein.weinname}
  onChange={(e) =>
    setWein({
      ...wein,
      weinname: e.target.value,
    })
  }
  style={{
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    marginBottom: "18px",
  }}
/>
<label>Jahrgang</label>
<input
  type="number"
  value={wein.jahrgang}
  onChange={(e) =>
    setWein({
      ...wein,
      jahrgang: e.target.value,
    })
  }
  style={{
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    marginBottom: "18px",
  }}
/>
<label>Land</label>
<input
  type="text"
  value={wein.land}
  onChange={(e) =>
    setWein({
      ...wein,
      land: e.target.value,
    })
  }
  style={{
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    marginBottom: "18px",
  }}
/>

<label>Region</label>
<input
  type="text"
  value={wein.region}
  onChange={(e) =>
    setWein({
      ...wein,
      region: e.target.value,
    })
  }
  style={{
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    marginBottom: "18px",
  }}
/>
<label>Appellation</label>
<input
  type="text"
  value={wein.appellation || ""}
  onChange={(e) =>
    setWein({
      ...wein,
      appellation: e.target.value,
    })
  }
  style={{
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    marginBottom: "18px",
  }}
/>
<label>Rebsorte</label>
<input
  type="text"
  value={wein.rebsorte}
  onChange={(e) =>
    setWein({
      ...wein,
      rebsorte: e.target.value,
    })
  }
  style={{
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    marginBottom: "18px",
  }}
/>

<label>Preis pro Flasche</label>
<input
  type="number"
  step="0.05"
  value={wein.preis}
  onChange={(e) =>
    setWein({
      ...wein,
      preis: Number(e.target.value),
    })
  }
  style={{
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    marginBottom: "18px",
  }}
/>

<label>Anzahl Flaschen</label>
<input
  type="number"
  min="0"
  value={wein.anzahl}
  onChange={(e) =>
    setWein({
      ...wein,
      anzahl: Number(e.target.value),
    })
  }
  style={{
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    marginBottom: "18px",
  }}
/>
<label>Bild</label>

{wein.bild && (
  <img
    src={wein.bild}
    alt="Wein"
    style={{
      width: "220px",
      borderRadius: "12px",
      display: "block",
      marginBottom: "15px",
    }}
  />
)}

<input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const datei = e.target.files?.[0];

    if (!datei) return;

    const reader = new FileReader();

    reader.onload = () => {
      setWein({
        ...wein,
        bild: reader.result as string,
      });
    };

    reader.readAsDataURL(datei);
  }}
/>



<label>Bewertung</label>

<div
  style={{
    fontSize: "32px",
    marginTop: "8px",
    marginBottom: "20px",
  }}
>
  {[1, 2, 3, 4, 5].map((stern) => (
    <span
      key={stern}
      onClick={() =>
        setWein({
          ...wein,
          bewertung: stern,
        })
      }
      style={{
        cursor: "pointer",
        color:
          stern <= wein.bewertung
            ? "#d4a017"
            : "#cccccc",
      }}
    >
      ★
    </span>
  ))}
</div>

<h3 style={{ color: "#7b1026", marginTop: "25px" }}>
  🍷 Trinkfenster
</h3>

<label>Trinkfenster von (Jahr)</label>
<input
  type="number"
  min="1900"
  max="2200"
  value={wein.trinkfenster_von ?? ""}
  onChange={(e) =>
    setWein({
      ...wein,
      trinkfenster_von:
        e.target.value === "" ? null : Number(e.target.value),
    })
  }
  style={{
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    marginBottom: "18px",
  }}
/>

<label>Trinkfenster bis (Jahr)</label>
<input
  type="number"
  min="1900"
  max="2200"
  value={wein.trinkfenster_bis ?? ""}
  onChange={(e) =>
    setWein({
      ...wein,
      trinkfenster_bis:
        e.target.value === "" ? null : Number(e.target.value),
    })
  }
  style={{
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    marginBottom: "18px",
  }}
/>

<label>Quelle des Trinkfensters</label>
<input
  type="text"
  value={wein.trinkfenster_quelle}
  onChange={(e) =>
    setWein({
      ...wein,
      trinkfenster_quelle: e.target.value,
    })
  }
  placeholder="z. B. Falstaff, Produzent, Wine Advocate"
  style={{
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    marginBottom: "18px",
    boxSizing: "border-box",
  }}
/>

<label>Art des Trinkfensters</label>
<select
  value={wein.trinkfenster_typ}
  onChange={(e) =>
    setWein({
      ...wein,
      trinkfenster_typ: e.target.value,
    })
  }
  style={{
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    marginBottom: "18px",
    boxSizing: "border-box",
  }}
>
  <option value="">Bitte auswählen</option>
  <option value="experte">Expertenbewertung</option>
  <option value="produzent">Angabe des Produzenten</option>
  <option value="schaetzung">Schätzung durch WineCellar AI</option>
</select>

<h3 style={{ color: "#7b1026", marginTop: "25px" }}>
  ⭐ Weinbewertungen
</h3>

{([

["Falstaff", "falstaff_punkte", 100, "falstaff_quelle"],
["Robert Parker", "parker_punkte", 100, "parker_quelle"],
["James Suckling", "suckling_punkte", 100, "suckling_quelle"],
["Wine Spectator", "winespectator_punkte", 100, "winespectator_quelle"],
["Vivino", "vivino_bewertung", 5, "vivino_quelle"],




].map(([name, feld, maximum, quelle]) => {
  const bewertungsfeld = feld as "falstaff_punkte" | "parker_punkte" | "suckling_punkte" | "winespectator_punkte" | "vivino_bewertung";
  return (



  <div key={feld}>
    <label>{name} ({maximum === 5 ? "1–5" : "0–100"} Punkte)</label>
    <input
      type="number"
      min="0"
      max={maximum}
      step={maximum === 5 ? "0.1" : "1"}
      value={wein[bewertungsfeld] ?? ""}
      onChange={(e) =>
        setWein({
          ...wein,
          [feld]: e.target.value === ""
            ? null
            : Number(e.target.value),
        })
      }
      style={{
        width: "100%",
        padding: "10px",
        marginTop: "6px",
        marginBottom: "18px",
        boxSizing: "border-box",
      }}
    />
    
<label>Quelle (Internetadresse)</label>
<input
  type="url"
  value={wein[quelle as "falstaff_quelle" | "parker_quelle" | "suckling_quelle" | "winespectator_quelle" | "vivino_quelle"] ?? ""}
  onChange={(e) =>
    setWein({
      ...wein,
      [quelle]: e.target.value,
    })
  }
  placeholder="https://..."
  style={{
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    marginBottom: "12px",
    boxSizing: "border-box",
  }}
/>
<label>Art der Bewertungsquelle</label>
<select
 value={
  wein[
    String(quelle).replace("_quelle", "_quellenart") as
      | "falstaff_quellenart"
      | "parker_quellenart"
      | "suckling_quellenart"
      | "winespectator_quellenart"
      | "vivino_quellenart"
  ] ?? ""
}
  onChange={(e) =>
    setWein({
      ...wein,
     [String(quelle).replace("_quelle", "_quellenart")]: e.target.value,
    })
  }
  style={{
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    marginBottom: "18px",
    boxSizing: "border-box",
  }}
>
  <option value="">Bitte auswählen</option>
  <option value="original">Originalquelle</option>
  <option value="sekundaer">Sekundärquelle</option>
  <option value="ungeprueft">Ungeprüfte Quelle</option>
</select>
  </div>

  );




}))}






<h3 style={{ color: "#7b1026", marginTop: "25px" }}>
  🍇 Weitere Weinangaben
</h3>

<label>Alkoholgehalt (% vol.)</label>
<input
  type="number"
  min="0"
  max="100"
  step="0.1"
  value={wein.alkoholgehalt ?? ""}
  onChange={(e) =>
    setWein({
      ...wein,
      alkoholgehalt:
        e.target.value === "" ? null : Number(e.target.value),
    })
  }
  style={{
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    marginBottom: "18px",
    boxSizing: "border-box",
  }}
/>

<label>Weinstil</label>
<input
  type="text"
  value={wein.weinstil}
  onChange={(e) =>
    setWein({
      ...wein,
      weinstil: e.target.value,
    })
  }
  placeholder="z. B. kräftig, trocken, fruchtig"
  style={{
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    marginBottom: "18px",
    boxSizing: "border-box",
  }}
/>

<label>Kaufdatum</label>
<input
  type="date"
  value={wein.kaufdatum}
  onChange={(e) =>
    setWein({
      ...wein,
      kaufdatum: e.target.value,
    })
  }
  style={{
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    marginBottom: "18px",
    boxSizing: "border-box",
  }}
/>

<label>Notiz</label>

<textarea
  value={wein.notiz}
  onChange={(e) =>
    setWein({
      ...wein,
      notiz: e.target.value,
    })
  }
  placeholder="Eigene Notizen zum Wein..."
  rows={5}
  style={{
    width: "100%",
    padding: "12px",
    marginTop: "6px",
    marginBottom: "18px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    fontFamily: "Arial",
    fontSize: "15px",
    resize: "vertical",
    boxSizing: "border-box",
  }}
/>
<button
  type="button"
  onClick={speichern}
     
        style={{
          padding: "12px 24px",
          backgroundColor: "#7b1026",
          color: "white",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
        }}
      >
        Speichern
      </button>
    </main>
  );
}
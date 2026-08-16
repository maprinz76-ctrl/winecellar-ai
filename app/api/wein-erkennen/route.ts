import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { fehler: "OPENAI_API_KEY wurde nicht gefunden." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const bild = body.bild;

    if (!bild) {
      return NextResponse.json(
        { fehler: "Kein Bild übermittelt." },
        { status: 400 }
      );
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5.6-terra",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
              text: `Analysiere das Foto dieser Weinflasche sorgfältig und identifiziere den Wein so zuverlässig wie möglich.

Arbeite intern in dieser Reihenfolge:
1. Lies zuerst das sichtbare Etikett und erfasse die tatsächlich lesbaren Wörter und Zahlen.
2. Unterscheide Produzent, Weinname, Jahrgang, Herkunftsangaben und dekorative Elemente voneinander.
3. Identifiziere anhand dieser Angaben den konkreten Wein.
4. Prüfe, ob Produzent, Weinname, Jahrgang, Land, Region, Appellation und Rebsorte logisch zusammenpassen.
5. Gib erst danach das JSON aus.

Ermittle:

- produzent: Der tatsächliche Produzent, das Weingut, Château oder die Kellerei.
- weinname: Der eigentliche Name bzw. die Cuvée des Weins.
- jahrgang: Ausschließlich die vierstellige Jahreszahl des Jahrgangs.
- land: Das Herkunftsland auf Deutsch.
- region: Die übergeordnete Weinregion, z. B. Loire, Burgund, Bordeaux, Toskana, Piemont, Rioja oder Mendoza.
- appellation: Die konkrete Appellation oder offizielle Herkunftsbezeichnung.
- rebsorte: Ausschließlich konkrete Rebsortennamen.

Wichtige Regeln zur Identifikation:

- Sichtbare Angaben auf dem Etikett haben höchste Priorität.
- Interpretiere nicht jede auffällige Schrift automatisch als Weinname oder Produzent.
- Logos, Wappen, Signaturen, Medaillen, Gründungsjahre, Firmenslogans und dekorative Texte sind keine Weinnamen.
- Eine vierstellige Zahl ist nur dann ein Jahrgang, wenn sie im Kontext des Etiketts plausibel als Jahrgang erscheint.
- Wenn Produzent und Wein eindeutig identifiziert sind, darfst du zuverlässiges Weinwissen verwenden, um Region, Appellation oder Rebsorte zu ergänzen.
- Ergänzte Angaben müssen zum konkret identifizierten Wein passen.
- Erfinde keine Angaben.

Regeln für Produzent und Weinname:

- "produzent" enthält ausschließlich den tatsächlichen Hersteller, das Weingut, Château oder die Kellerei.
- "weinname" enthält ausschließlich den eigentlichen Wein- oder Cuvée-Namen.
- Wiederhole den vollständigen Produzentennamen niemals unverändert als Weinname.
- Bei einem Château-Wein steht beispielsweise "Château Chasse-Spleen" unter "produzent" und "Chasse-Spleen" unter "weinname".
- Bei einem Wein wie "Louis Latour Grand Ardèche" steht "Louis Latour" unter "produzent" und "Grand Ardèche" unter "weinname".
- Bei einem Wein wie "Louis Jadot Meursault" steht "Louis Jadot" unter "produzent" und "Meursault" unter "weinname".

Regeln für Herkunft:

- "region" enthält die übergeordnete Weinregion.
- "appellation" enthält die konkrete Appellation bzw. offizielle Herkunftsbezeichnung.
- Verwechsle Region und Appellation nicht.
- Beispiele:
  Bordeaux → Moulis-en-Médoc AOC
  Burgund → Meursault AOC
  Loire → Pouilly-Fumé AOC
  Toskana → Chianti Classico DOCG

Regeln für Rebsorten:

- "rebsorte" enthält ausschließlich konkrete Rebsortennamen.
- Mehrere Rebsorten werden mit Komma getrennt.
- Verwende niemals "und mehr", "weitere", "etc.", "u. a." oder ähnliche Sammelbegriffe.
- Nenne nur Rebsorten, die für den eindeutig identifizierten Wein zuverlässig bestimmbar sind.
- Wenn nur eine Rebsorte sicher ist, nenne nur diese.

Umgang mit Unsicherheit:

- Wenn eine Information nicht zuverlässig bestimmbar ist, verwende einen leeren String.
- Rate nicht, nur um alle Felder auszufüllen.
- Bewerte jedes Feld mit einer Sicherheit von 0 bis 100.
- 90 bis 100 = eindeutig bzw. sehr zuverlässig.
- 70 bis 89 = wahrscheinlich, aber sollte vom Benutzer geprüft werden.
- Unter 70 = unsicher; lasse das zugehörige Feld leer.
- Sichtbar und eindeutig gelesene Angaben dürfen hohe Sicherheitswerte erhalten.
- Aus Weinwissen ergänzte Angaben erhalten nur dann hohe Werte, wenn der konkrete Wein eindeutig identifiziert wurde.

Antworte ausschließlich mit gültigem JSON.
Schreibe keine Erklärung und keinen zusätzlichen Text.

Verwende exakt dieses Format:

{
  "produzent": "",
  "weinname": "",
  "jahrgang": "",
  "land": "",
  "region": "",
  "appellation": "",
  "rebsorte": "",
  "sicherheit": {
    "produzent": 0,
    "weinname": 0,
    "jahrgang": 0,
    "land": 0,
    "region": 0,
    "appellation": 0,
    "rebsorte": 0
  }
}
`,
              },
              {
                type: "input_image",
                image_url: bild,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const fehler = await response.text();
      console.error("OpenAI Fehler:", fehler);

      return NextResponse.json(
        { fehler: "Die Weinerkennung ist fehlgeschlagen." },
        { status: 500 }
      );
    }

    const daten = await response.json();

    return NextResponse.json(daten);
  } catch (error) {
    console.error("Fehler bei der Weinerkennung:", error);

    return NextResponse.json(
      { fehler: "Bei der Weinerkennung ist ein Fehler aufgetreten." },
      { status: 500 }
    );
  }
}
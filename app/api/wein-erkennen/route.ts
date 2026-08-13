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
               text: `Analysiere das Foto dieser Weinflasche sorgfältig.

Identifiziere den Wein anhand aller sichtbaren Informationen auf Etikett, Flasche und Verschluss.

Ermittle:

- produzent: Der tatsächliche Produzent bzw. das Weingut.
- weinname: Der Name des Weins. Wiederhole den Produzenten nicht unnötig im Weinnamen.
- jahrgang: Ausschließlich die vierstellige Jahreszahl des Jahrgangs, falls sicher erkennbar.
- land: Das Herkunftsland auf Deutsch.
- region: Die übergeordnete Weinregion, z. B. Loire, Toskana, Piemont, Rioja oder Bordeaux.
- appellation: Die möglichst genaue Appellation oder Herkunftsbezeichnung, z. B. Pouilly-Fumé, Sancerre, Chianti Classico DOCG oder Barolo DOCG.
- rebsorte: Die Rebsorte bzw. die wichtigsten Rebsorten. Verwende die international gebräuchliche Bezeichnung.

Wichtige Regeln:
- - Lies zuerst alle tatsächlich sichtbaren Angaben auf dem Foto.
- Identifiziere den Wein nur dann anhand deines Wissens, wenn Produzent und Wein eindeutig bestimmbar sind.
- "produzent" enthält ausschließlich den Hersteller, das Weingut oder Château.
- "weinname" enthält ausschließlich den Namen bzw. die Cuvée des Weins. Wiederhole den Produzenten nicht, wenn dies nicht Teil des eigentlichen Weinnamens ist.
- "region" enthält die übergeordnete Weinregion, z. B. Bordeaux, Toskana, Piemont oder Loire.
- "appellation" enthält die konkrete Herkunftsbezeichnung bzw. Appellation, z. B. Moulis-en-Médoc AOC, Chianti Classico DOCG oder Pouilly-Fumé AOC.
- "rebsorte" enthält eine oder mehrere Rebsorten. Mehrere Rebsorten werden mit Komma getrennt.
- Erfinde keinen Jahrgang. Übernimm ihn nur, wenn er auf dem Foto eindeutig erkennbar ist.
- Ergänze andere Informationen nur, wenn sie anhand des eindeutig identifizierten Weins zuverlässig bestimmbar sind.
- Wenn eine Information nicht zuverlässig bestimmbar ist, verwende einen leeren String.
- Bewerte für jedes erkannte Feld die Sicherheit mit einer ganzen Zahl von 0 bis 100.
- 90 bis 100 bedeutet eindeutig erkannt, 70 bis 89 bedeutet sehr wahrscheinlich, unter 70 bedeutet unsicher.
- Wenn eine Information nicht zuverlässig bestimmbar ist, lasse das eigentliche Feld leer und setze die Sicherheit entsprechend niedrig.
- Antworte ausschließlich mit gültigem JSON.
- Schreibe keine Erklärung und keinen zusätzlichen Text.

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
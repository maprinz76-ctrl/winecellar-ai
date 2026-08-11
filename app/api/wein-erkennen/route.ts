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
                text: `Analysiere dieses Weinetikett.

Ermittle soweit auf dem Bild erkennbar:
- Produzent
- Weinname
- Jahrgang
- Land
- Region
- Rebsorte

Antworte ausschließlich als gültiges JSON in diesem Format:

{
  "produzent": "",
  "weinname": "",
  "jahrgang": "",
  "land": "",
  "region": "",
  "rebsorte": ""
}

Wenn eine Information nicht sicher erkennbar ist, verwende einen leeren String.`,
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
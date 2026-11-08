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
        
tools: [{ type: "web_search" }],

tool_choice: "required",


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


Expertenbewertungen:
Recherchiere online nach Bewertungen für den eindeutig identifizierten Wein und Jahrgang.

Für Robert Parker, James Suckling und Wine Spectator:
- Recherchiere die Bewertung für den exakt identifizierten Wein und Jahrgang.
- Gib die Punkte als ganze Zahl auf der 100-Punkte-Skala zurück.
- Gib für jede Bewertung die vollständige Internetadresse der Quelle an.
- Wenn keine eindeutig zuordenbare Bewertung gefunden wird, lasse Punkte und Quelle leer.

Für Vivino:
- Recherchiere die Bewertung des exakt identifizierten Weins.
- Verwende die Bewertungsskala von 1 bis 5 mit maximal einer Dezimalstelle.
- Übernimm eine Bewertung nur, wenn die Quelle eindeutig zum Wein passt und der Jahrgang übereinstimmt.
- Gib die vollständige Internetadresse der Quelle an.
- Wenn keine verlässliche Bewertung gefunden wird, lasse Bewertung und Quelle leer.

Für alle Bewertungen gilt:
- Keine Bewertungen schätzen oder erfinden.
- Keine Punkte anderer Jahrgänge übernehmen.
- Keine Internetadressen erfinden.
- Eine fehlende Bewertung ist besser als eine falsche Bewertung.

Prüfung der Bewertungsquellen:
- Bevorzuge die Originalseiten von Falstaff, Robert Parker / The Wine Advocate, James Suckling, Wine Spectator und Vivino.
- Händlerseiten dürfen nur verwendet werden, wenn sie die konkrete Bewertung ausdrücklich dem jeweiligen Kritiker zuordnen.
- Auf der angegebenen Internetseite müssen Produzent, Wein, Jahrgang und Bewertung eindeutig übereinstimmen.
- Eine allgemeine Produktseite ohne nachweisbare Bewertung ist keine ausreichende Quelle.
- Übernimm keine Bewertung, wenn die Fundstelle nur einen anderen Jahrgang oder einen ähnlichen Wein beschreibt.
- Wenn die konkrete Bewertung auf der Fundstelle nicht überprüft werden kann, lasse Bewertung und Quelle leer.
- Gib ausschliesslich die Internetadresse der tatsächlich verwendeten Fundstelle zurück.

Kennzeichnung der Quellenart:
- Unterscheide bei jeder gefundenen Expertenbewertung zwischen Originalquelle und Sekundärquelle.
- original: Die Bewertung steht auf der offiziellen Internetseite des jeweiligen Weinkritikers.
- sekundaer: Die Bewertung wird auf einer Händlerseite oder einer anderen unabhängigen Weinplattform ausdrücklich dem Kritiker zugeordnet.
- ungeprueft: Die Herkunft oder Zuordnung der Bewertung konnte nicht ausreichend überprüft werden.
- Beurteile die Quellenart anhand der tatsächlich verwendeten Internetadresse.
- Eine Händlerseite darf niemals als Originalquelle bezeichnet werden.
- Die Quellenart allein beweist nicht die Richtigkeit einer Bewertung.

Gib die Quellenart für jede Bewertung im entsprechenden JSON-Feld zurück:
- falstaff_quellenart
- parker_quellenart
- suckling_quellenart
- winespectator_quellenart
- vivino_quellenart

Verwende ausschliesslich diese Werte:
- original
- sekundaer
- ungeprueft

Wenn keine Bewertung vorhanden ist, lasse auch die Quellenart leer.
Wenn eine Bewertung nicht ausreichend überprüfbar ist, übernimm keine Punkte und keine Quelle.

Für Falstaff gelten zusätzlich diese Regeln:
- falstaff_punkte: Gib ausschliesslich die nachweislich veröffentlichte Bewertung für den exakt identifizierten Wein und Jahrgang zurück.
- Verwende nur eine ganze Zahl zwischen 0 und 100.
- falstaff_quelle: Gib die vollständige Internetadresse der Fundstelle zurück.
- Eine Bewertung darf nur übernommen werden, wenn Produzent, Wein und Jahrgang mit der Quelle übereinstimmen.
- Wenn die Bewertung oder ihre Zuordnung nicht eindeutig überprüfbar ist, müssen falstaff_punkte und falstaff_quelle leer bleiben.
- Erfinde niemals Bewertungen oder Internetadressen.

Berücksichtige:
- Falstaff
- Robert Parker / The Wine Advocate
- James Suckling
- Wine Spectator

Übernimm ausschliesslich Bewertungen, die eindeutig zum Produzenten, Wein und Jahrgang gehören.

Erfinde niemals Bewertungspunkte.
Übernimm keine Bewertungen anderer Jahrgänge.
Wenn keine verlässliche Bewertung gefunden wird, lasse das entsprechende Feld leer.

Notiere zu jeder gefundenen Bewertung die genaue Internetadresse der Quelle.

- trinkfenster_von: Schätze das erste Kalenderjahr, ab dem der konkret identifizierte Wein voraussichtlich gut trinkbar ist.
- trinkfenster_bis: Schätze das letzte Kalenderjahr, bis zu dem der Wein bei fachgerechter Lagerung voraussichtlich gut trinkbar bleibt.
- Berücksichtige Produzent, Weinname, Jahrgang, Herkunft, Rebsorten und das typische Lagerpotenzial des Weins.
- Gib für beide Angaben ausschließlich vierstellige Jahreszahlen zurück.
- Berücksichtige, dass sich Weine je nach Lagerbedingungen unterschiedlich entwickeln.
- Erfinde keine Expertenempfehlungen oder Quellen.
- Wenn der Wein nicht ausreichend zuverlässig identifiziert wurde oder eine seriöse Einschätzung nicht möglich ist, verwende für beide Angaben einen leeren String.
- Das Trinkfenster ist immer eine KI-Schätzung und keine bestätigte Expertenempfehlung.

- weinstil: Beschreibe den Stil des konkret identifizierten Weins mit wenigen treffenden Begriffen, beispielsweise "trocken, frisch, mineralisch" oder "trocken, kräftig, tanninreich".
- Berücksichtige Weintyp, Rebsorten, Herkunft und den eindeutig identifizierten Wein.
- Verwende nur Eigenschaften, die sich zuverlässig ableiten lassen.
- Erfinde keine Verkostungsnotizen.
- Wenn der Weinstil nicht ausreichend zuverlässig bestimmbar ist, verwende einen leeren String.

- alkoholgehalt: Der auf dem Etikett angegebene Alkoholgehalt in Prozent, beispielsweise 14.5.
- Gib ausschließlich die Zahl zurück, ohne Prozentzeichen oder "% vol.".
- Verwende einen Punkt als Dezimaltrennzeichen.
- Wenn der Alkoholgehalt auf dem Foto nicht eindeutig lesbar ist, verwende einen leeren String.
- Schätze den Alkoholgehalt niemals anhand der Rebsorte, Region oder des Weintyps.


Wichtige Regeln zur Identifikation:

- Sichtbare Angaben auf dem Etikett haben höchste Priorität.
- Interpretiere nicht jede auffällige Schrift automatisch als Weinname oder Produzent.
- Logos, Wappen, Signaturen, Medaillen, Gründungsjahre, Firmenslogans und dekorative Texte sind keine Weinnamen.
- Eine vierstellige Zahl ist nur dann ein Jahrgang, wenn sie im Kontext des Etiketts plausibel als Jahrgang erscheint.
- Wenn Produzent und Wein eindeutig identifiziert sind, darfst du zuverlässiges Weinwissen verwenden, um Region, Appellation oder Rebsorte zu ergänzen.
- Ergänzte Angaben müssen zum konkret identifizierten Wein passen.
- Erfinde keine Angaben.

- "produzent" enthält ausschließlich den tatsächlichen Hersteller, das Weingut, Château oder die Kellerei.
- "weinname" enthält ausschließlich den eigentlichen Wein- oder Cuvée-Namen.
- Wiederhole den vollständigen Produzentennamen niemals unverändert als Weinname.
- Ein Familienname, Markenname oder Firmenname ist nicht automatisch der Weinname.
- Eine Appellation oder Herkunftsbezeichnung ist nicht automatisch der Weinname.
- Wenn auf dem Etikett Produzent und Weinname getrennt erscheinen, übernimm beide getrennt.
- Wenn kein eigenständiger Weinname sicher erkennbar ist, setze "weinname" auf einen leeren String statt den Produzentennamen zu wiederholen.
- Ergänze einen bekannten Cuvée-Namen wie "Tignanello" nur dann, wenn er auf dem Etikett sichtbar ist oder der konkrete Wein eindeutig identifiziert wurde.
- Beispiel Antinori:
  "Marchesi Antinori" = produzent.
  "Tignanello" = weinname nur wenn Tignanello tatsächlich auf dem Etikett steht oder der Wein eindeutig als Tignanello identifiziert wurde.
  "Marchese Antinori Chianti Classico Riserva" darf nicht automatisch zu "Tignanello" werden.
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
  "alkoholgehalt": "",
  "weinstil": "",
  "trinkfenster_von": "",
"trinkfenster_bis": "",


"falstaff_punkte": "",
"falstaff_quelle": "",
"falstaff_quellenart": "",

"parker_punkte": "",
"parker_quelle": "",
"parker_quellenart": "",

"suckling_punkte": "",
"suckling_quelle": "",
"suckling_quellenart": "",

"winespectator_punkte": "",
"winespectator_quelle": "",
"winespectator_quellenart": "",

"vivino_bewertung": "",
"vivino_quelle": "",
"vivino_quellenart": "",



  "sicherheit": {
  "produzent": 0,
  "weinname": 0,
  "jahrgang": 0,
  "land": 0,
  "region": 0,
  "appellation": 0,
 
"rebsorte": 0,

"alkoholgehalt": 0,
"weinstil": 0,
"trinkfenster_von": 0,
"trinkfenster_bis": 0


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
    
const kiText = daten.output
  ?.flatMap((eintrag: any) => eintrag.content || [])
  ?.find((inhalt: any) => inhalt.type === "output_text")
  ?.text;

if (kiText) {
  try {
    const ergebnis = JSON.parse(kiText);
    console.log("Falstaff-Test:", {
      punkte: ergebnis.falstaff_punkte,
      quelle: ergebnis.falstaff_quelle,
    });
    console.log("Quellenarten-Test:", {
  falstaff: ergebnis.falstaff_quellenart,
  parker: ergebnis.parker_quellenart,
  suckling: ergebnis.suckling_quellenart,
  winespectator: ergebnis.winespectator_quellenart,
  vivino: ergebnis.vivino_quellenart,
});
  } catch {
    console.log("Falstaff-Test: KI-Antwort nicht als JSON lesbar.");
  }
}

    
console.log("Verwendete KI-Werkzeuge:", daten.output?.map((eintrag: { type: string }) => eintrag.type));


    return NextResponse.json(daten);
  } catch (error) {
    console.error("Fehler bei der Weinerkennung:", error);

    return NextResponse.json(
      { fehler: "Bei der Weinerkennung ist ein Fehler aufgetreten." },
      { status: 500 }
    );
  }
}
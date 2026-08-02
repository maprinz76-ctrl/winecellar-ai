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
};

type Props = {
  wein: Wein;
};

export default function WeinKarte({ wein }: Props) {
  return (
    <article>
      <h2>{wein.weinname}</h2>
      <p>{wein.produzent}</p>
    </article>
  );
}
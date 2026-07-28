export default function WeinHinzufuegen() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f1eb",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <h1>🍷 Wein hinzufügen</h1>

      <p>Hier erfassen wir später deine Weine.</p>

      <input
        type="text"
        placeholder="Name des Weins"
        style={{
          width: "300px",
          padding: "10px",
          marginTop: "20px",
          display: "block",
        }}
      />

      <button
        style={{
          marginTop: "20px",
          padding: "12px 25px",
          backgroundColor: "#8B0000",
          color: "white",
          border: "none",
          borderRadius: "8px",
        }}
      >
        Speichern
      </button>
    </main>
  );
}

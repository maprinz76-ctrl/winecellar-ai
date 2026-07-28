import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f1ec",
        color: "#231f20",
        fontFamily: "Arial, sans-serif",
        padding: "24px 20px 110px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "720px",
          margin: "0 auto",
        }}
      >
        <header style={{ marginBottom: "28px" }}>
          <p
            style={{
              margin: 0,
              color: "#7b6f68",
              fontSize: "16px",
            }}
          >
            Guten Abend, Marco
          </p>

          <h1
            style={{
              margin: "8px 0 0",
              fontSize: "36px",
            }}
          >
            🍷 WineCellar AI
          </h1>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "16px",
          }}
        >
          <DashboardCard
            icon="🍾"
            title="Flaschen"
            value="0"
          />

          <DashboardCard
            icon="💰"
            title="Gesamtwert"
            value="CHF 0"
          />

          <DashboardCard
            icon="⭐"
            title="Trinkreif"
            value="0 Weine"
          />

          <DashboardCard
            icon="🆕"
            title="Neu erfasst"
            value="0"
          />
        </section>

        <Link
          href="/wein-hinzufuegen"
          style={{
            display: "block",
            marginTop: "28px",
            padding: "17px",
            backgroundColor: "#7b1026",
            color: "white",
            textAlign: "center",
            textDecoration: "none",
            borderRadius: "14px",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          + Wein hinzufügen
        </Link>
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
        }}
      >
        <div
          style={{
            maxWidth: "720px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-around",
            fontSize: "24px",
          }}
        >
          <span>🏠</span>
          <span>🍷</span>
          <Link
            href="/wein-hinzufuegen"
            style={{ textDecoration: "none" }}
          >
            ➕
          </Link>
          <span>🤖</span>
          <span>👤</span>
        </div>
      </nav>
    </main>
  );
}

function DashboardCard({
  icon,
  title,
  value,
}: {
  icon: string;
  title: string;
  value: string;
}) {
  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "16px",
        boxShadow: "0 6px 20px rgba(40, 30, 30, 0.08)",
      }}
    >
      <div style={{ fontSize: "26px" }}>{icon}</div>

      <p
        style={{
          margin: "14px 0 6px",
          color: "#7b6f68",
          fontSize: "14px",
        }}
      >
        {title}
      </p>

      <strong style={{ fontSize: "22px" }}>{value}</strong>
    </div>
  );
}
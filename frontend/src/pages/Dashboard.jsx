export default function Dashboard() {
  return (
    <div className="dashboard page">
      <section className="dashboard-panel">
        <h1 className="title">Dashboard</h1>

        <p className="subtitle">Bienvenue sur votre tableau de bord</p>

        <div className="cards">
          <div className="card-item">
            <h3>Etudiants</h3>
            <p>120</p>
          </div>

          <div className="card-item">
            <h3>Projets</h3>
            <p>45</p>
          </div>

          <div className="card-item">
            <h3>Messages</h3>
            <p>18</p>
          </div>
        </div>
      </section>
    </div>
  );
}

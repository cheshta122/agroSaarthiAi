const metrics = [
  { value: "3.2k", label: "KCC advisories indexed", trend: "Ready for retrieval" },
  { value: "22", label: "Haryana districts covered", trend: "Location aware" },
  { value: "91%", label: "Queries with local context", trend: "Pincode matched" }
];

const crops = [
  { name: "Wheat", value: 82, className: "fill-green" },
  { name: "Mustard", value: 68, className: "fill-amber" },
  { name: "Cotton", value: 54, className: "fill-blue" },
  { name: "Paddy", value: 46, className: "fill-rose" }
];

const priorities = [
  "Irrigation scheduling",
  "Pest and disease response",
  "Soil nutrient guidance",
  "Government scheme discovery"
];

export default function DashboardPage() {
  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Operations Dashboard</p>
          <h1>Farm advisory intelligence for faster field decisions.</h1>
          <p className="lead">
            Monitor knowledge coverage, district routing, and the guidance themes
            AgroSaarthi AI is prepared to answer for farmers and extension teams.
          </p>
        </div>
        <div className="hero-visual" aria-label="Stylized agricultural data map" />
      </header>

      <div className="grid grid-3">
        {metrics.map((metric) => (
          <article className="metric-card" key={metric.label}>
            <p className="metric-value">{metric.value}</p>
            <p className="metric-label">{metric.label}</p>
            <span className="trend">{metric.trend}</span>
          </article>
        ))}
      </div>

      <div className="grid grid-2">
        <section className="panel">
          <h2>Advisory Demand</h2>
          <div className="chart">
            {crops.map((crop) => (
              <div className="bar-row" key={crop.name}>
                <span>{crop.name}</span>
                <span className="bar-track">
                  <span
                    className={`bar-fill ${crop.className}`}
                    style={{ width: `${crop.value}%` }}
                  />
                </span>
                <strong>{crop.value}%</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2>Field Priorities</h2>
          <ul className="timeline">
            {priorities.map((priority, index) => (
              <li key={priority}>
                <strong>0{index + 1}</strong>
                <p className="muted">{priority}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="panel">
        <h2>System Flow</h2>
        <div className="grid grid-3">
          <div>
            <h3>1. Farmer question</h3>
            <p className="muted">
              Collect a natural-language question and pincode from the assistant.
            </p>
          </div>
          <div>
            <h3>2. Local retrieval</h3>
            <p className="muted">
              Resolve district and retrieve KCC documents from the vector store.
            </p>
          </div>
          <div>
            <h3>3. Grounded answer</h3>
            <p className="muted">
              Generate a response shaped by local context and source snippets.
            </p>
          </div>
        </div>
      </section>
    </section>
  );
}

const principles = [
  {
    title: "Local first",
    copy: "Pincode and district context shape the retrieved evidence before answers are generated."
  },
  {
    title: "Evidence visible",
    copy: "The assistant page surfaces retrieved documents so teams can inspect the support behind a response."
  },
  {
    title: "Built for extension work",
    copy: "The interface favors fast scanning, repeat questions, and practical agricultural decision support."
  }
];

export default function AboutPage() {
  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">About</p>
          <h1>AgroSaarthi AI helps agricultural guidance reach farmers faster.</h1>
          <p className="lead">
            The system pairs a FastAPI RAG backend with a Next.js frontend for
            asking questions, reviewing retrieved knowledge, and understanding
            advisory coverage across Haryana.
          </p>
        </div>
        <div className="hero-visual" aria-label="Stylized advisory coverage map" />
      </header>

      <div className="grid grid-3">
        {principles.map((principle) => (
          <article className="article-card" key={principle.title}>
            <h2>{principle.title}</h2>
            <p>{principle.copy}</p>
          </article>
        ))}
      </div>

      <section className="panel">
        <h2>Architecture</h2>
        <div className="grid grid-3">
          <div>
            <h3>Frontend</h3>
            <p className="muted">
              Next.js app router pages for dashboard, assistant, knowledge base,
              and project context.
            </p>
          </div>
          <div>
            <h3>Backend</h3>
            <p className="muted">
              FastAPI endpoint that resolves location, retrieves documents, and
              generates an answer.
            </p>
          </div>
          <div>
            <h3>Data</h3>
            <p className="muted">
              Haryana KCC records, pincode lookup tables, embeddings, and FAISS
              indexes.
            </p>
          </div>
        </div>
      </section>

      <footer className="footer-band">
        <p>Designed for grounded, local, farmer-facing agricultural support.</p>
        <span className="tag">Next.js + FastAPI</span>
      </footer>
    </section>
  );
}

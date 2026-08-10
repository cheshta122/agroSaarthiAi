const collections = [
  {
    title: "Kisan Call Centre Guidance",
    copy: "Merged Haryana KCC questions and answers prepared for semantic retrieval.",
    tags: ["Crop symptoms", "Input use", "Weather-linked advice"]
  },
  {
    title: "Location Directory",
    copy: "Pincode lookup data that maps farmers to district and local office context.",
    tags: ["Pincode", "District", "Office"]
  },
  {
    title: "Vector Store",
    copy: "FAISS index and document embeddings used to retrieve relevant advisory snippets.",
    tags: ["Embeddings", "RAG", "Search"]
  }
];

const qualityChecks = [
  "Keep district names normalized before retrieval.",
  "Refresh merged KCC data after each source update.",
  "Review retrieved snippets for crop and season relevance.",
  "Track unanswered questions as candidates for dataset expansion."
];

export default function KnowledgeBasePage() {
  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Knowledge Base</p>
          <h1>Organized farm knowledge for grounded advisory responses.</h1>
          <p className="lead">
            AgroSaarthi AI combines curated KCC records, location lookup, and a
            FAISS vector store so each response can be tied back to relevant
            agricultural guidance.
          </p>
        </div>
      </header>

      <div className="grid grid-3">
        {collections.map((collection) => (
          <article className="article-card" key={collection.title}>
            <h2>{collection.title}</h2>
            <p>{collection.copy}</p>
            <div className="tag-row">
              {collection.tags.map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="grid grid-2">
        <section className="panel">
          <h2>Retrieval Pipeline</h2>
          <ul className="timeline">
            <li>
              <strong>Clean</strong>
              <p className="muted">Normalize raw advisory data into usable records.</p>
            </li>
            <li>
              <strong>Embed</strong>
              <p className="muted">Generate vector representations for semantic search.</p>
            </li>
            <li>
              <strong>Retrieve</strong>
              <p className="muted">Filter by district context and question similarity.</p>
            </li>
            <li>
              <strong>Answer</strong>
              <p className="muted">Build a prompt that keeps guidance tied to evidence.</p>
            </li>
          </ul>
        </section>

        <section className="panel">
          <h2>Quality Checks</h2>
          <ul className="plain-list">
            {qualityChecks.map((check) => (
              <li key={check}>{check}</li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}

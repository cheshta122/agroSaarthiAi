"use client";

import { FormEvent, useMemo, useState } from "react";

type AskResponse = {
  question: string;
  district: string;
  office: string;
  answer: string;
  retrieved_documents: unknown[];
};

const API_ROUTE = "/api/ask";

function formatDocument(doc: unknown) {
  if (typeof doc === "string") {
    return doc;
  }

  if (doc && typeof doc === "object") {
    return JSON.stringify(doc, null, 2);
  }

  return "No preview available";
}

export default function AssistantPage() {
  const [question, setQuestion] = useState(
    "What should I do if wheat leaves are turning yellow?"
  );
  const [pincode, setPincode] = useState("125001");
  const [response, setResponse] = useState<AskResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sources = useMemo(
    () => response?.retrieved_documents?.slice(0, 4) || [],
    [response]
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await fetch(API_ROUTE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question, pincode })
      });

      if (!result.ok) {
        const problem = await result.json().catch(() => null);
        throw new Error(
          problem?.detail || `Request failed with status ${result.status}`
        );
      }

      const data = (await result.json()) as AskResponse;
      setResponse(data);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "The assistant could not reach the backend."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Ask AgroSaarthi</p>
          <h1>Ask crop questions with district-aware context.</h1>
          <p className="lead">
            The assistant sends your question and pincode to the FastAPI RAG
            backend, then displays the answer with the matched office and
            retrieved knowledge.
          </p>
        </div>
        <div className="toolbar">
          <span className="tag">API: Next proxy</span>
        </div>
      </header>

      <div className="assistant-layout">
        <form className="panel grid" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="pincode">Pincode</label>
            <input
              className="input"
              id="pincode"
              inputMode="numeric"
              maxLength={6}
              onChange={(event) => setPincode(event.target.value)}
              placeholder="Enter farmer pincode"
              value={pincode}
            />
          </div>

          <div className="field">
            <label htmlFor="question">Question</label>
            <textarea
              className="textarea"
              id="question"
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask about crop health, irrigation, pests, soil, or schemes"
              value={question}
            />
          </div>

          <button className="button primary" disabled={loading} type="submit">
            {loading ? "Thinking..." : "Get advisory"}
          </button>

          {error ? <p className="muted">{error}</p> : null}
        </form>

        <section className="panel">
          <h2>Answer</h2>
          <div className="answer-box">
            {response ? (
              <>
                <div className="tag-row">
                  <span className="tag">District: {response.district}</span>
                  <span className="tag">Office: {response.office}</span>
                </div>
                <p style={{ marginTop: 18 }}>{response.answer}</p>
              </>
            ) : (
              <p className="muted">
                Submit a question to see the generated advisory, matched
                location, and supporting documents.
              </p>
            )}
          </div>
        </section>
      </div>

      <section className="panel">
        <h2>Retrieved Knowledge</h2>
        <ul className="source-list">
          {sources.length ? (
            sources.map((doc, index) => (
              <li className="source-item" key={index}>
                <strong>Source {index + 1}</strong>
                <pre>{formatDocument(doc)}</pre>
              </li>
            ))
          ) : (
            <li className="source-item muted">
              Sources appear here after the assistant receives a backend
              response.
            </li>
          )}
        </ul>
      </section>
    </section>
  );
}

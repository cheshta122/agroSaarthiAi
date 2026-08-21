"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { getAnalytics } from "@/lib/api";

interface AnalyticsData {
  status: string;

  summary: {
    total_kcc_records: number;
    total_districts: number;
    total_pincodes: number;
    pincode_districts: number;
  };

  top_crops: {
    crop: string;
    count: number;
  }[];

  top_districts: {
    district: string;
    count: number;
  }[];

  district_heatmap: {
    district: string;
    count: number;
  }[];

  category_distribution: {
    category: string;
    count: number;
  }[];

  yearly_queries: {
    year: number;
    count: number;
  }[];

  monthly_queries: {
    month: number;
    count: number;
  }[];
}

const chartColors = [
  "#166534",
  "#65a30d",
  "#ca8a04",
  "#2563eb",
  "#dc2626",
  "#9333ea",
  "#0891b2",
  "#ea580c",
  "#475569",
  "#16a34a",
];

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const data = await getAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error(err);
        setError(
          "Unable to load analytics. Please make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <section className="page">
        <header className="page-header">
          <div>
            <p className="eyebrow">Operations Dashboard</p>
            <h1>Farm advisory intelligence for faster field decisions.</h1>
            <p className="lead">Loading analytics...</p>
          </div>
        </header>

        <section className="panel">
          <p className="muted">Loading real KCC data...</p>
        </section>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page">
        <header className="page-header">
          <div>
            <p className="eyebrow">Operations Dashboard</p>
            <h1>Farm advisory intelligence for faster field decisions.</h1>
          </div>
        </header>

        <section className="panel">
          <h2>Analytics unavailable</h2>
          <p className="muted">{error}</p>
        </section>
      </section>
    );
  }

  if (!analytics) return null;

  const districtMax = Math.max(
    ...analytics.district_heatmap.map((item) => item.count),
    1
  );

  return (
    <section className="page">
      {/* HEADER */}
      <header className="page-header">
        <div>
          <p className="eyebrow">Operations Dashboard</p>

          <h1>Farm advisory intelligence for faster field decisions.</h1>

          <p className="lead">
            Monitor KCC knowledge coverage, district distribution, crop
            advisory demand, and yearly query patterns using real AgroSaarthi
            AI data.
          </p>
        </div>

        <div
          className="hero-visual"
          aria-label="Stylized agricultural data map"
        />
      </header>

      {/* SUMMARY CARDS */}
      <div className="grid grid-3">
        <article className="metric-card">
          <p className="metric-value">
            {analytics.summary.total_kcc_records.toLocaleString()}
          </p>

          <p className="metric-label">KCC advisories indexed</p>

          <span className="trend">Ready for retrieval</span>
        </article>

        <article className="metric-card">
          <p className="metric-value">
            {analytics.summary.total_districts}
          </p>

          <p className="metric-label">Haryana districts covered</p>

          <span className="trend">Location aware</span>
        </article>

        <article className="metric-card">
          <p className="metric-value">
            {analytics.summary.total_pincodes.toLocaleString()}
          </p>

          <p className="metric-label">Pincodes available</p>

          <span className="trend">Location directory</span>
        </article>
      </div>

      {/* CHARTS */}
      <div className="grid grid-2">
        {/* TOP CROPS */}
        <section className="panel">
          <h2>Top Crops</h2>

          <p className="muted">
            Most represented crops in the KCC advisory dataset.
          </p>

          <div style={{ width: "100%", height: 360 }}>
            <ResponsiveContainer>
              <BarChart
                data={analytics.top_crops}
                layout="vertical"
                margin={{
                  top: 10,
                  right: 20,
                  left: 20,
                  bottom: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis type="number" />

                <YAxis
                  type="category"
                  dataKey="crop"
                  width={120}
                  tick={{ fontSize: 11 }}
                />

                <Tooltip />

                <Bar
                  dataKey="count"
                  fill="#166534"
                  radius={[0, 5, 5, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* CATEGORY PIE */}
        <ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={analytics.category_distribution}
      dataKey="count"
      nameKey="category"
      cx="40%"
      cy="50%"
      innerRadius={65}
      outerRadius={100}
      paddingAngle={2}
      label={false}
      labelLine={false}
    >
      {analytics.category_distribution.map((entry, index) => (
        <Cell
          key={`category-${entry.category}`}
          fill={chartColors[index % chartColors.length]}
        />
      ))}
    </Pie>

    <Tooltip
      formatter={(value: number | undefined) => [
        `${(value ?? 0).toLocaleString()} records`,
        "Advisories",
      ]}
    />

    <Legend
      layout="vertical"
      align="right"
      verticalAlign="middle"
      iconType="circle"
      formatter={(value) => {
        const item = analytics.category_distribution.find(
          (entry) => entry.category === value
        );

        return `${value} (${(item?.count ?? 0).toLocaleString()})`;
      }}
    />

    {/* Center text */}
    <text
      x="40%"
      y="47%"
      textAnchor="middle"
      dominantBaseline="middle"
      className="fill-stone-900 text-sm font-semibold"
    >
      Total
    </text>

    <text
      x="40%"
      y="56%"
      textAnchor="middle"
      dominantBaseline="middle"
      className="fill-stone-900 text-lg font-bold"
    >
      {analytics.summary.total_kcc_records.toLocaleString()}
    </text>
  </PieChart>
</ResponsiveContainer>
          </div>
        
    

      {/* YEARLY QUERIES */}
      <section className="panel">
        <h2>Queries by Year</h2>

        <p className="muted">
          Year-wise distribution of records across the available KCC datasets.
        </p>

        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <LineChart
              data={analytics.yearly_queries}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="year" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="count"
                stroke="#166534"
                strokeWidth={3}
                dot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* DISTRICT HEATMAP */}
      <section className="panel">
        <h2>District Advisory Heatmap</h2>

        <p className="muted">
          Higher intensity represents a higher number of KCC advisory records.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "12px",
            marginTop: "24px",
          }}
        >
          {analytics.district_heatmap
            .filter((item) => item.district !== "0")
            .map((item) => {
              const intensity = item.count / districtMax;

              return (
                <div
                  key={item.district}
                  style={{
                    padding: "16px",
                    borderRadius: "10px",
                    border: "1px solid #d9e2d9",
                    backgroundColor: `rgba(22, 101, 52, ${
                      0.08 + intensity * 0.75
                    })`,
                    color:
                      intensity > 0.55 ? "white" : "#17351f",
                  }}
                >
                  <strong
                    style={{
                      display: "block",
                      fontSize: "14px",
                      marginBottom: "6px",
                    }}
                  >
                    {item.district}
                  </strong>

                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: 700,
                    }}
                  >
                    {item.count.toLocaleString()}
                  </span>

                  <span
                    style={{
                      display: "block",
                      fontSize: "11px",
                      marginTop: "4px",
                      opacity: 0.8,
                    }}
                  >
                    KCC records
                  </span>
                </div>
              );
            })}
        </div>
      </section>

      {/* FIELD PRIORITIES */}
      <div className="grid grid-2">
        <section className="panel">
          <h2>Field Priorities</h2>

          <ul className="timeline">
            <li>
              <strong>01</strong>
              <p className="muted">Irrigation scheduling</p>
            </li>

            <li>
              <strong>02</strong>
              <p className="muted">Pest and disease response</p>
            </li>

            <li>
              <strong>03</strong>
              <p className="muted">Soil nutrient guidance</p>
            </li>

            <li>
              <strong>04</strong>
              <p className="muted">Government scheme discovery</p>
            </li>
          </ul>
        </section>

        {/* DATA COVERAGE */}
        <section className="panel">
          <h2>Data Coverage</h2>

          <div style={{ display: "grid", gap: "20px" }}>
            <div>
              <h3>KCC Records</h3>
              <p className="muted">
                {analytics.summary.total_kcc_records.toLocaleString()} records
                across the available Haryana KCC datasets.
              </p>
            </div>

            <div>
              <h3>District Coverage</h3>
              <p className="muted">
                {analytics.summary.total_districts} districts represented in
                the KCC records.
              </p>
            </div>

            <div>
              <h3>Pincode Directory</h3>
              <p className="muted">
                {analytics.summary.total_pincodes.toLocaleString()} pincodes
                available for location lookup.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* SYSTEM FLOW */}
      <section className="panel">
        <h2>System Flow</h2>

        <div className="grid grid-3">
          <div>
            <h3>1. Farmer question</h3>

            <p className="muted">
              Collect a natural-language question and pincode from the
              assistant.
            </p>
          </div>

          <div>
            <h3>2. Local retrieval</h3>

            <p className="muted">
              Resolve district and retrieve relevant KCC documents from the
              vector store.
            </p>
          </div>

          <div>
            <h3>3. Grounded answer</h3>

            <p className="muted">
              Generate a response using retrieved agricultural knowledge and
              local context.
            </p>
          </div>
        </div>
      </section>
    </section>
  );
}
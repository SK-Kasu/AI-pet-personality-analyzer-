import { useEffect, useState } from "react";
import "./App.css";

type ApiHealth = {
  status: string;
  service: string;
  timestamp: string;
};

type ConnectionState = "checking" | "connected" | "disconnected";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

function App() {
  const [connection, setConnection] =
    useState<ConnectionState>("checking");

  const [health, setHealth] = useState<ApiHealth | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function checkApi(): Promise<void> {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/health`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error(`API returned HTTP ${response.status}`);
        }

        const data: ApiHealth = await response.json();

        setHealth(data);
        setConnection("connected");
        setError(null);
      } catch (err: unknown) {
        if (controller.signal.aborted) {
          return;
        }

        setConnection("disconnected");

        setError(
          err instanceof Error
            ? err.message
            : "An unexpected error occurred.",
        );
      }
    }

    void checkApi();

    return () => controller.abort();
  }, []);

  return (
    <main className="app">
      <header className="app-header">
        <p className="eyebrow">DEVELOPMENT ENVIRONMENT</p>
        <h1>AI Pet Personality Analyzer</h1>
        <p className="subtitle">
          Monitor the connection between your frontend and backend.
        </p>
      </header>

      <section className="connection-panel" aria-live="polite">
        <h2>Backend API</h2>

        <p>
          <strong>Endpoint:</strong>{" "}
          <code>{API_BASE_URL}/api/v1/health</code>
        </p>

        <p>
          <strong>Connection status:</strong>{" "}
          <span className={`status status-${connection}`}>
            {connection === "checking"
              ? "Checking connection..."
              : connection === "connected"
                ? "Connected"
                : "Disconnected"}
          </span>
        </p>

        {health && (
          <div className="health-details">
            <p>
              <strong>Service:</strong> {health.service}
            </p>

            <p>
              <strong>API status:</strong> {health.status}
            </p>

            <p>
              <strong>Last checked:</strong>{" "}
              {new Date(health.timestamp).toLocaleString()}
            </p>
          </div>
        )}

        {error && (
          <p className="error-message" role="alert">
            Could not connect to the API: {error}
          </p>
        )}
      </section>
    </main>
  );
}

export default App;
import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function statusPage() {
  return (
    <main>
      <style>{`
                body {
                    margin: 0;
                    padding: 0;
                    background: linear-gradient(#00021f, #080644);
                    background-attachment: fixed;
                    background-size: cover;
                }
                h1 {
                  text-align: center;
                  position: relative;
                  top: 210px;
                  color: rgb(255, 255, 255);
                  font: sans-serif;
                }
                p {
                  text-align: left;
                  color: rgb(255, 255, 255);
                  font: sans-serif;
                  }
                
            `}</style>
      <h1>Status</h1>
      <div
        style={{
          backgroundColor: "#00021f",
          borderRadius: "20px",
          textAlign: "center",
          boxShadow:
            "0 6px 10px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
          margin: "0 auto",
          maxWidth: "400px",
          padding: "13px",
          position: "relative",
          top: "215px",
        }}
      >
        <UpdatedAt />
        <PostgresData />
      </div>
    </main>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return (
    <p>
      <strong>Ultima atualização:</strong> {updatedAtText}
    </p>
  );
}

function PostgresData() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let postgresData = "Carregando...";

  if (!isLoading && data) {
    const pgVersion = data.dependencies.database.version;
    const pgMaxConnections = data.dependencies.database.max_connections;
    const pgOpenedConnections = data.dependencies.database.opened_connections;

    postgresData = (
      <div>
        <p>
          <strong>Versão do Postgres:</strong> {pgVersion}
        </p>
        <p>
          <strong>Conexões máximas:</strong> {pgMaxConnections}
        </p>
        <p>
          <strong>Conexões abertas:</strong> {pgOpenedConnections}
        </p>
      </div>
    );
  }
  return <div>{postgresData}</div>;
}

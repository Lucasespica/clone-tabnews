const { spawn } = require("node:child_process");

let shuttingDown = false;

const devProcess = spawn("npm", ["run", "dev:run"], {
  stdio: "inherit",
  shell: true,
});

function stopServices(exitCode) {
  if (shuttingDown) return;
  shuttingDown = true;

  console.log("\n🔴 Encerrando serviços Docker...");

  devProcess.kill("SIGINT");

  const stopProcess = spawn("npm", ["run", "services:stop"], {
    stdio: "inherit",
    shell: true,
  });

  stopProcess.on("close", () => {
    console.log("✅ Serviços parados com sucesso. Exit code:", exitCode);
    process.exit(exitCode || 0);
  });
}

process.on("SIGINT", () => {
  console.log("\nBotão de interromper acionado (Ctrl+C).");
  stopServices(0);
});

devProcess.on("exit", (code) => {
  if (!shuttingDown) {
    console.log(
      `\n🟡 O processo 'next dev' encerrou sozinho (Código: ${code})`,
    );
    stopServices(code);
  }
});

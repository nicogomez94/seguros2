import { spawn } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const commands = [
  ["api", process.execPath, [path.join(root, "server", "index.js")]],
  ["web", process.execPath, [path.join(root, "node_modules", "vite", "bin", "vite.js")]]
];

const children = commands.map(([name, command, args]) => {
  const child = spawn(command, args, {
    cwd: root,
    stdio: ["ignore", "pipe", "pipe"],
    shell: false,
    env: { ...process.env, NODE_ENV: "development" }
  });

  child.stdout.on("data", (data) => process.stdout.write(`[${name}] ${data}`));
  child.stderr.on("data", (data) => process.stderr.write(`[${name}] ${data}`));
  child.on("exit", (code) => {
    if (code) process.stderr.write(`[${name}] exited with code ${code}\n`);
    shutdown();
  });

  return child;
});

let shuttingDown = false;
function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) child.kill();
  }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

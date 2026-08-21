import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const outputDir = path.join(root, "maintenance-state");
const outputPath = path.join(outputDir, "maintenance-state.json");

function git(...args) {
  try {
    return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
  } catch {
    return "unavailable";
  }
}

const priorStatePath = process.env.MAINTENANCE_PRIOR_STATE_PATH;
const priorStateAvailable = Boolean(priorStatePath && existsSync(priorStatePath));
const packageJson = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));

const state = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  source: "github-actions-or-local-maintenance-command",
  commit: git("rev-parse", "HEAD"),
  branch: git("branch", "--show-current"),
  packageManager: packageJson.packageManager ?? "unknown",
  priorStateAvailable,
  validation: ["check", "lint", "test", "build", "android-export"],
  secretPolicy: "No credentials, terminal history, cookies, API keys, or personal data are collected in this state record."
};

mkdirSync(outputDir, { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
console.log(`Wrote safe maintenance state to ${outputPath}`);

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
const manifest = JSON.parse(readFileSync(path.join(root, "MAINTENANCE_MANIFEST.json"), "utf8"));

function readPriorState() {
  if (!priorStateAvailable) return null;
  try {
    return JSON.parse(readFileSync(priorStatePath, "utf8"));
  } catch {
    return null;
  }
}

const priorState = readPriorState();
const priorCycle = Number.isSafeInteger(priorState?.cycle) && priorState.cycle >= 0 ? priorState.cycle : 0;
const maxIntendedCycles = manifest.continuation?.maxIntendedCycles ?? 2400;
const cycle = Math.min(priorCycle + 1, maxIntendedCycles);

const state = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  source: "github-actions-or-local-maintenance-command",
  commit: git("rev-parse", "HEAD"),
  branch: git("branch", "--show-current"),
  packageManager: packageJson.packageManager ?? "unknown",
  priorStateAvailable,
  priorCommit: typeof priorState?.commit === "string" ? priorState.commit : null,
  cycle,
  maxIntendedCycles,
  continuationLimitReached: cycle >= maxIntendedCycles,
  validation: ["check", "lint", "test", "build", "android-export"],
  secretPolicy: "No credentials, terminal history, cookies, API keys, or personal data are collected in this state record."
};

mkdirSync(outputDir, { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
console.log(`Wrote safe maintenance state to ${outputPath}`);

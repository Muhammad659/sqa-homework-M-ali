import { spawnSync } from "node:child_process";
import path from "node:path";

const PROJECT_ROOT = path.resolve(__dirname, "..");
const EVALUATOR_SCRIPT = path.join(__dirname, "response_evaluator.py");
const PYTHON_EXECUTABLE =
  process.env.PYTHON_EXECUTABLE ??
  path.join(
    PROJECT_ROOT,
    ".venv",
    process.platform === "win32" ? "Scripts/python.exe" : "bin/python",
  );

type EvaluationInput = {
  question: string;
  response: string;
};

type ResponseEvaluation = {
  passed: boolean;
  score: number;
  reason: string;
};

export function evaluateResponseRelevance({
  question,
  response,
}: EvaluationInput): ResponseEvaluation {
  const result = spawnSync(PYTHON_EXECUTABLE, [EVALUATOR_SCRIPT], {
    input: JSON.stringify({ question, response }),
    encoding: "utf8",
    timeout: 150_000,
    maxBuffer: 1024 * 1024,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(
      result.stderr.trim() || `DeepEval exited with code ${result.status}.`,
    );
  }

  return JSON.parse(result.stdout) as ResponseEvaluation;
}

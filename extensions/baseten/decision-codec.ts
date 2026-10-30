import {
  validateDecisionResultV2,
  type DecisionBatchV2,
  type DecisionEntry,
  type ProviderDecisionOutcomeV2,
} from "openclaw/plugin-sdk/decisions";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";

function text(value: DecisionEntry | undefined): string {
  return typeof value === "string" ? value : value === undefined ? "" : JSON.stringify(value);
}

function questions(batch: DecisionBatchV2) {
  return Object.fromEntries(
    Object.entries(batch.questions).map(([id, q]) => {
      const instructions = text(q.instructions);
      if (q.type === "boolean") {
        return [
          id,
          {
            type: "noul",
            instructions: q.criteria
              ? `${instructions}\nTrue criterion: ${text(q.criteria.true)}\nFalse criterion: ${text(q.criteria.false)}`
              : instructions,
          },
        ];
      }
      if (q.type === "choice") {
        return [
          id,
          {
            type: "choice",
            instructions,
            criteria: Object.fromEntries(
              Object.entries(q.criteria).map(([key, value]) => [key, text(value)]),
            ),
          },
        ];
      }
      if (q.type === "score") {
        return [id, { type: "score", instructions, criteria: q.criteria.map(text) }];
      }
      throw new Error("Unsupported Baseten decision question");
    }),
  );
}

export function decodeBasetenDecisionResult(
  batch: DecisionBatchV2,
  payload: Record<string, unknown>,
): ProviderDecisionOutcomeV2 {
  const invalid = { status: "unavailable", reason: "invalid-response" } as const;
  if (
    !isRecord(payload.answers) ||
    Object.keys(payload.answers).length !== Object.keys(batch.questions).length ||
    !isRecord(payload.usage)
  ) {
    return invalid;
  }
  const usage = payload.usage;
  if (
    !Number.isSafeInteger(usage.input_tokens) ||
    typeof usage.input_tokens !== "number" ||
    usage.input_tokens < 0 ||
    usage.output_tokens !== Object.keys(batch.questions).length
  ) {
    return invalid;
  }
  const answers: Record<string, unknown> = Object.create(null);
  for (const [id, q] of Object.entries(batch.questions)) {
    const answer = payload.answers[id];
    if (!isRecord(answer)) {
      return invalid;
    }
    if (q.type === "boolean") {
      if (answer.type !== "noul") {
        return invalid;
      }
      answers[id] = { type: "boolean", probabilityTrue: answer.noul };
      continue;
    }
    if (
      answer.type !== q.type ||
      !isRecord(answer.probabilities) ||
      typeof answer.confidence !== "number" ||
      answer.confidence < 0 ||
      answer.confidence > 1
    ) {
      return invalid;
    }
    if (q.type === "choice") {
      answers[id] = {
        type: "choice",
        choice: answer.choice,
        probabilities: answer.probabilities,
        confidence: answer.confidence,
      };
    } else if (q.type === "score") {
      const legend = answer.legend;
      const probabilities = answer.probabilities;
      if (
        !isRecord(legend) ||
        Object.keys(legend).length !== q.criteria.length ||
        Object.keys(probabilities).length !== q.criteria.length ||
        q.criteria.some((value, index) => legend[String(index)] !== text(value))
      ) {
        return invalid;
      }
      answers[id] = {
        type: "score",
        score: answer.score,
        probabilities: q.criteria.map((_, index) => probabilities[String(index)]),
        confidence: answer.confidence,
      };
    } else {
      return invalid;
    }
  }
  // The backend model may differ from the requested public slug. Preserve it.
  const result = {
    model: payload.model,
    answers,
    usage: { inputTokens: usage.input_tokens, outputTokens: usage.output_tokens },
  };
  return validateDecisionResultV2(batch, result) ? { status: "ok", result } : invalid;
}

export function encodeBasetenDecisionRequest(batch: DecisionBatchV2, modelId: string): string {
  return JSON.stringify({
    model: modelId,
    state:
      batch.state.type === "text"
        ? batch.state.text
        : batch.state.type === "json"
          ? JSON.stringify(batch.state.value)
          : "",
    questions: questions(batch),
  });
}

import json
import os
import sys

from deepeval.metrics import AnswerRelevancyMetric
from deepeval.models import GeminiModel
from deepeval.test_case import LLMTestCase


if not os.getenv("GOOGLE_API_KEY"):
    raise RuntimeError(
        "GOOGLE_API_KEY is required for the Gemini DeepEval judge."
    )

payload = json.load(sys.stdin)

judge = GeminiModel(
    model=os.getenv("GEMINI_MODEL_NAME", "gemini-2.5-flash"),
    temperature=0,
)

test_case = LLMTestCase(
    input=payload["question"],
    actual_output=payload["response"],
)

metric = AnswerRelevancyMetric(
    threshold=0.7,
    model=judge,
    include_reason=True,
)

metric.measure(test_case)

json.dump(
    {
        "passed": bool(metric.is_successful()),
        "score": metric.score,
        "reason": metric.reason or "",
    },
    sys.stdout,
)

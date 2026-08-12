export const SUGGESTED_TOPIC_NAMES = [
  "What is Permission",
  "Best way to earn ASK",
  "How permission uses my data",
  "What is passive earning",
  "What is data ownership",
  "Permission Wallet",
] as const;

export const WHAT_IS_PERMISSION_TOPIC = SUGGESTED_TOPIC_NAMES[0];

export const WHAT_IS_PERMISSION_QUESTION = "What is Permission?";

export const FREE_TEXT_QUESTION = "What are data permissions?";

const MULTILINE_FIRST_LINE = "First line";
const MULTILINE_SECOND_LINE = "Second line";

export const MULTILINE_INPUT = {
  firstLine: MULTILINE_FIRST_LINE,
  secondLine: MULTILINE_SECOND_LINE,
  expectedValue: `${MULTILINE_FIRST_LINE}\n${MULTILINE_SECOND_LINE}`,
} as const;

export const EMPTY_INPUT_VALUE = "";

export const MINIMUM_RESPONSE_LENGTH = 50;

export const TEST_TIMEOUTS = {
  suggestedTopicsVisible: 15_000,
  inputReady: 30_000,
  streamingStart: 10_000,
  streamingComplete: 60_000,
  semanticResponseTest: 150_000,
} as const;

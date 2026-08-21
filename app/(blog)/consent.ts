export type ConsentCategory = "necessary" | "functional" | "analytics";

export type ConsentChoices = Record<ConsentCategory, boolean>;

export interface ConsentRecord {
  choices: ConsentChoices;
  timestamp: number;
  version: string;
}

export const CONSENT_STORAGE_KEY = "vigoleis-consent";
export const CONSENT_VERSION = "1";
export const CONSENT_CHANGE_EVENT = "vigoleis-consent-change";

export const CONSENT_CATEGORIES: ConsentCategory[] = [
  "necessary",
  "functional",
  "analytics",
];

export const DEFAULT_CHOICES: ConsentChoices = {
  necessary: true,
  functional: false,
  analytics: false,
};

export const ALL_CHOICES: ConsentChoices = {
  necessary: true,
  functional: true,
  analytics: true,
};

export const NECESSARY_ONLY_CHOICES: ConsentChoices = {
  necessary: true,
  functional: false,
  analytics: false,
};

export const CONSENT_LABELS: Record<
  ConsentCategory,
  { title: string; description: string }
> = {
  necessary: {
    title: "Necessary",
    description:
      "Required for the site to function correctly. Cannot be disabled.",
  },
  functional: {
    title: "Functional",
    description:
      "Enable enhanced features such as remembering your preferences.",
  },
  analytics: {
    title: "Analytics",
    description:
      "Help us improve the site by collecting anonymous usage information.",
  },
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function parseRecord(value: string | null): ConsentRecord | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Partial<ConsentRecord>;
    if (
      parsed &&
      typeof parsed.choices === "object" &&
      parsed.choices !== null &&
      typeof parsed.timestamp === "number" &&
      typeof parsed.version === "string"
    ) {
      const choices = { ...DEFAULT_CHOICES, ...parsed.choices };
      return { choices, timestamp: parsed.timestamp, version: parsed.version };
    }
  } catch {
    // ignore malformed entries
  }
  return null;
}

export function getConsent(): ConsentRecord | null {
  if (!isBrowser()) return null;
  return parseRecord(window.localStorage.getItem(CONSENT_STORAGE_KEY));
}

export function hasConsent(category: ConsentCategory): boolean {
  if (category === "necessary") return true;
  const record = getConsent();
  if (!record) return false;
  return Boolean(record.choices[category]);
}

export function saveConsent(choices: ConsentChoices): ConsentRecord {
  const record: ConsentRecord = {
    choices: { ...choices, necessary: true },
    timestamp: Date.now(),
    version: CONSENT_VERSION,
  };
  if (isBrowser()) {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
    window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT));
  }
  return record;
}

export function clearConsent(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT));
}

export type ConsentListener = (record: ConsentRecord | null) => void;

export function subscribeConsent(listener: ConsentListener): () => void {
  if (!isBrowser()) return () => {};
  const handler = () => listener(getConsent());
  window.addEventListener(CONSENT_CHANGE_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(CONSENT_CHANGE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

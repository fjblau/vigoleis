"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  ALL_CHOICES,
  CONSENT_CATEGORIES,
  CONSENT_LABELS,
  DEFAULT_CHOICES,
  NECESSARY_ONLY_CHOICES,
  getConsent,
  saveConsent,
  subscribeConsent,
  type ConsentChoices,
  type ConsentRecord,
} from "./consent";

export default function ConsentBanner() {
  const [record, setRecord] = useState<ConsentRecord | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [choices, setChoices] = useState<ConsentChoices>(DEFAULT_CHOICES);

  useEffect(() => {
    setRecord(getConsent());
    setLoaded(true);
    return subscribeConsent((next) => setRecord(next));
  }, []);

  if (!loaded || record) return null;

  function handleAcceptAll() {
    saveConsent(ALL_CHOICES);
  }

  function handleRejectAll() {
    saveConsent(NECESSARY_ONLY_CHOICES);
  }

  function handleSavePreferences() {
    saveConsent(choices);
  }

  function toggleCategory(category: keyof ConsentChoices) {
    if (category === "necessary") return;
    setChoices((prev) => ({ ...prev, [category]: !prev[category] }));
  }

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 z-50 w-full border-t border-accent-2 bg-white/95 backdrop-blur"
    >
      <div className="container mx-auto px-5 py-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-lg font-bold tracking-tight">
              We value your privacy
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              We use cookies to keep the site working and to improve it with
              anonymous analytics. Necessary cookies are always on. You can
              accept or reject optional cookies, and change your choices at any
              time in our{" "}
              <Link
                href="/privacy-policy"
                className="underline hover:text-cyan transition-colors duration-200"
              >
                privacy policy
              </Link>
              .
            </p>
          </div>

          <div className="flex flex-wrap gap-3 md:shrink-0">
            <button
              type="button"
              onClick={handleAcceptAll}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              Accept all
            </button>
            <button
              type="button"
              onClick={handleRejectAll}
              className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition-colors"
            >
              Reject optional
            </button>
            <button
              type="button"
              onClick={() => setShowPreferences((prev) => !prev)}
              className="underline hover:text-cyan transition-colors duration-200 px-2 py-2"
              aria-expanded={showPreferences}
              aria-controls="consent-preferences"
            >
              Preferences
            </button>
          </div>
        </div>

        {showPreferences && (
          <div
            id="consent-preferences"
            className="mt-5 border-t border-gray-200 pt-4"
          >
            <ul className="space-y-3">
              {CONSENT_CATEGORIES.map((category) => {
                const label = CONSENT_LABELS[category];
                const isNecessary = category === "necessary";
                const checked = isNecessary ? true : choices[category];
                return (
                  <li
                    key={category}
                    className="flex items-start justify-between gap-4"
                  >
                    <div>
                      <p className="text-sm font-semibold">{label.title}</p>
                      <p className="text-sm text-gray-600">
                        {label.description}
                      </p>
                    </div>
                    <label className="flex shrink-0 cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={isNecessary}
                        onChange={() => toggleCategory(category)}
                        className="h-4 w-4 rounded border-gray-300 text-black focus:ring focus:ring-gray-400 disabled:opacity-60"
                      />
                      <span className="text-sm text-gray-700">
                        {checked ? "On" : "Off"}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4">
              <button
                type="button"
                onClick={handleSavePreferences}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
              >
                Save preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

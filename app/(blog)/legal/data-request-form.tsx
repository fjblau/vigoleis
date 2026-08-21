"use client";

import { useEffect, useRef, useState, useActionState } from "react";

import { submitDataRequest, type DataRequestState } from "./actions";

const initialState: DataRequestState = { ok: false, message: "" };

export default function DataRequestForm() {
  const [state, formAction, pending] = useActionState(
    submitDataRequest,
    initialState,
  );
  const [formKey, setFormKey] = useState(0);
  const prevOk = useRef(false);

  // Clear the form fields after a successful submission.
  useEffect(() => {
    if (state.ok && !prevOk.current) {
      setFormKey((k) => k + 1);
    }
    prevOk.current = state.ok;
  }, [state.ok]);

  const errors = state.errors;
  const values = state.values;

  return (
    <section
      aria-labelledby="data-request-heading"
      className="mt-16 border-t border-gray-200 pt-12"
    >
      <h2
        id="data-request-heading"
        className="text-3xl font-bold tracking-tight mb-3"
      >
        Data Subject Request
      </h2>
      <p className="mb-6 text-gray-600">
        Under the GDPR you have the right to request access to, export of, or
        deletion of the personal data we hold about you. Use the form below and
        we will respond to your email.
      </p>

      {state.ok && state.message && (
        <div
          role="status"
          className="mb-6 rounded border border-green-200 bg-green-50 p-4 text-green-800"
        >
          {state.message}
        </div>
      )}
      {!state.ok && state.message && (
        <div
          role="alert"
          className="mb-6 rounded border border-red-200 bg-red-50 p-4 text-red-800"
        >
          {state.message}
        </div>
      )}

      <form key={formKey} action={formAction} className="space-y-5">
        <div>
          <label
            htmlFor="data-request-type"
            className="block text-sm font-semibold mb-1"
          >
            Request type
          </label>
          <select
            id="data-request-type"
            name="requestType"
            defaultValue={values?.requestType ?? ""}
            aria-invalid={!!errors?.requestType}
            aria-describedby="data-request-type-error"
            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-gray-400"
          >
            <option value="" disabled>
              Select a request type…
            </option>
            <option value="access">Access my data</option>
            <option value="export">Export my data</option>
            <option value="deletion">Delete my data</option>
          </select>
          {errors?.requestType && (
            <p
              id="data-request-type-error"
              className="mt-1 text-sm text-red-600"
            >
              {errors.requestType}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="data-request-name"
            className="block text-sm font-semibold mb-1"
          >
            Name
          </label>
          <input
            id="data-request-name"
            name="name"
            type="text"
            defaultValue={values?.name ?? ""}
            autoComplete="name"
            aria-invalid={!!errors?.name}
            aria-describedby="data-request-name-error"
            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-gray-400"
          />
          {errors?.name && (
            <p id="data-request-name-error" className="mt-1 text-sm text-red-600">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="data-request-email"
            className="block text-sm font-semibold mb-1"
          >
            Email
          </label>
          <input
            id="data-request-email"
            name="email"
            type="email"
            defaultValue={values?.email ?? ""}
            autoComplete="email"
            aria-invalid={!!errors?.email}
            aria-describedby="data-request-email-error"
            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-gray-400"
          />
          {errors?.email && (
            <p
              id="data-request-email-error"
              className="mt-1 text-sm text-red-600"
            >
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="data-request-message"
            className="block text-sm font-semibold mb-1"
          >
            Message{" "}
            <span className="font-normal text-gray-500">(optional)</span>
          </label>
          <textarea
            id="data-request-message"
            name="message"
            rows={4}
            defaultValue={values?.message ?? ""}
            aria-invalid={!!errors?.message}
            aria-describedby="data-request-message-error"
            placeholder="e.g. the order reference or data you want to access or delete"
            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-gray-400"
          />
          {errors?.message && (
            <p
              id="data-request-message-error"
              className="mt-1 text-sm text-red-600"
            >
              {errors.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={pending}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors disabled:opacity-60"
        >
          {pending ? "Submitting…" : "Submit request"}
        </button>
      </form>
    </section>
  );
}

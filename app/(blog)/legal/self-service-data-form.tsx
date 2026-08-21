"use client";

import { useState, useActionState } from "react";

import { deleteMyData, type DataRemovalState } from "./actions";

const removalInitialState: DataRemovalState = { ok: false, message: "" };

const inputClass =
  "w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-gray-400";

export default function SelfServiceDataForm() {
  const [removalState, removalAction, removalPending] = useActionState(
    deleteMyData,
    removalInitialState,
  );

  const [exportOrderRef, setExportOrderRef] = useState("");
  const [exportEmail, setExportEmail] = useState("");
  const [exportPending, setExportPending] = useState(false);
  const [exportStatus, setExportStatus] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  async function handleExport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setExportStatus(null);
    setExportPending(true);

    try {
      const fd = new FormData();
      fd.append("orderReference", exportOrderRef);
      fd.append("email", exportEmail);

      const res = await fetch("/api/data-export", { method: "POST", body: fd });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const disposition = res.headers.get("Content-Disposition") ?? "";
        const match = /filename="?([^"]+)"?/.exec(disposition);
        link.download = match ? match[1] : "personal-data.json";
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        setExportStatus({
          ok: true,
          message: "Your data has been downloaded as a JSON file.",
        });
      } else {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        setExportStatus({
          ok: false,
          message:
            data?.error ||
            "We could not find an order matching that reference and email.",
        });
      }
    } catch {
      setExportStatus({
        ok: false,
        message: "Something went wrong while exporting your data. Please try again later.",
      });
    } finally {
      setExportPending(false);
    }
  }

  return (
    <section
      aria-labelledby="self-service-data-heading"
      className="mt-16 border-t border-gray-200 pt-12"
    >
      <h2
        id="self-service-data-heading"
        className="text-3xl font-bold tracking-tight mb-3"
      >
        Self-service: export or delete your data
      </h2>
      <p className="mb-10 text-gray-600">
        If you have placed an order, you can exercise your GDPR rights directly.
        Enter your order reference (e.g. <code>ORD-20260821-A1B2C3</code>) and the
        email address used at checkout. We verify ownership against your order
        before returning or removing any data.
      </p>

      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <h3 className="text-xl font-semibold mb-3">Export your data</h3>
          <p className="mb-4 text-sm text-gray-600">
            Download a JSON file containing your customer profile and full order
            history.
          </p>
          {exportStatus && (
            <div
              role={exportStatus.ok ? "status" : "alert"}
              className={`mb-4 rounded border p-3 text-sm ${
                exportStatus.ok
                  ? "border-green-200 bg-green-50 text-green-800"
                  : "border-red-200 bg-red-50 text-red-800"
              }`}
            >
              {exportStatus.message}
            </div>
          )}
          <form onSubmit={handleExport} className="space-y-4">
            <div>
              <label
                htmlFor="export-order-ref"
                className="block text-sm font-semibold mb-1"
              >
                Order reference
              </label>
              <input
                id="export-order-ref"
                name="orderReference"
                type="text"
                autoComplete="off"
                required
                value={exportOrderRef}
                onChange={(e) => setExportOrderRef(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label
                htmlFor="export-email"
                className="block text-sm font-semibold mb-1"
              >
                Email
              </label>
              <input
                id="export-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={exportEmail}
                onChange={(e) => setExportEmail(e.target.value)}
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              disabled={exportPending}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors disabled:opacity-60"
            >
              {exportPending ? "Preparing…" : "Download my data"}
            </button>
          </form>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Delete your data</h3>
          <p className="mb-4 text-sm text-gray-600">
            Permanently remove your customer profile and all associated orders.
            This cannot be undone.
          </p>
          {removalState.ok && removalState.message && (
            <div
              role="status"
              className="mb-4 rounded border border-green-200 bg-green-50 p-3 text-sm text-green-800"
            >
              {removalState.message}
            </div>
          )}
          {!removalState.ok && removalState.message && (
            <div
              role="alert"
              className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800"
            >
              {removalState.message}
            </div>
          )}
          <form action={removalAction} className="space-y-4">
            <div>
              <label
                htmlFor="delete-order-ref"
                className="block text-sm font-semibold mb-1"
              >
                Order reference
              </label>
              <input
                id="delete-order-ref"
                name="orderReference"
                type="text"
                autoComplete="off"
                required
                defaultValue={removalState.values?.orderReference ?? ""}
                aria-invalid={!!removalState.errors?.orderReference}
                aria-describedby="delete-order-ref-error"
                className={inputClass}
              />
              {removalState.errors?.orderReference && (
                <p
                  id="delete-order-ref-error"
                  className="mt-1 text-sm text-red-600"
                >
                  {removalState.errors.orderReference}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="delete-email"
                className="block text-sm font-semibold mb-1"
              >
                Email
              </label>
              <input
                id="delete-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                defaultValue={removalState.values?.email ?? ""}
                aria-invalid={!!removalState.errors?.email}
                aria-describedby="delete-email-error"
                className={inputClass}
              />
              {removalState.errors?.email && (
                <p id="delete-email-error" className="mt-1 text-sm text-red-600">
                  {removalState.errors.email}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={removalPending}
              className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition-colors disabled:opacity-60"
            >
              {removalPending ? "Deleting…" : "Delete my data"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

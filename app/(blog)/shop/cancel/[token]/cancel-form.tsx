"use client";

import { useActionState } from "react";

import type { CancellationState } from "../actions";

export default function CancelForm({
  action,
}: {
  action: (state: CancellationState) => Promise<CancellationState>;
}) {
  const [state, formAction, pending] = useActionState(action, {
    status: "ready",
    message: "",
  } as CancellationState);

  if (state.status !== "ready") {
    return <p role="status" className="border border-gray-200 rounded-lg p-5">{state.message}</p>;
  }

  return (
    <form action={formAction}>
      <button
        type="submit"
        disabled={pending}
        className="bg-black text-white px-5 py-3 rounded hover:bg-gray-800 disabled:bg-gray-400"
      >
        {pending ? "Cancelling…" : "Confirm cancellation"}
      </button>
    </form>
  );
}

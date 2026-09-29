import "server-only";

export const merchantEmail = "puetz@vigoleis.de";

export function mailConfiguration() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  const siteUrl = process.env.SHOP_SITE_URL?.trim();
  if (!apiKey || !from || !siteUrl) return null;
  try {
    const origin = new URL(siteUrl);
    if (origin.protocol !== "https:" && !(process.env.NODE_ENV === "development" && origin.hostname === "localhost")) return null;
    if (origin.username || origin.password || origin.search || origin.hash) return null;
    return { apiKey, from, origin: origin.origin };
  } catch {
    return null;
  }
}

export async function sendShopEmail(
  config: NonNullable<ReturnType<typeof mailConfiguration>>,
  to: string,
  subject: string,
  text: string,
  idempotencyKey: string,
) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({ from: config.from, to: [to], subject, text }),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Email provider rejected request (${response.status}).`);
  }
  const body: unknown = await response.json();
  if (!body || typeof body !== "object" || !("id" in body) || typeof body.id !== "string") {
    throw new Error("Email provider did not acknowledge the request.");
  }
}

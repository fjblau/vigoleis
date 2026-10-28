"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";

import { useCart } from "../../cart-provider";
import { createOrder, type CreateOrderResult } from "./actions";

interface AddressState {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  shippingAddress: AddressState;
  billingAddress: AddressState;
}

const EMPTY_ADDRESS: AddressState = {
  street: "",
  city: "",
  postalCode: "",
  country: "",
};

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  shippingAddress: { ...EMPTY_ADDRESS },
  billingAddress: { ...EMPTY_ADDRESS },
};

export default function Checkout() {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<
    Extract<CreateOrderResult, { success: true }> | null
  >(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const requestId = useRef<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  function updateField(field: "name" | "email" | "phone", value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateAddress(
    address: "shippingAddress" | "billingAddress",
    field: keyof AddressState,
    value: string,
  ) {
    setForm((prev) => ({
      ...prev,
      [address]: { ...prev[address], [field]: value },
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    try {
      requestId.current ??= sessionStorage.getItem("shop-request-id");
      requestId.current ??= crypto.randomUUID();
      sessionStorage.setItem("shop-request-id", requestId.current);
    } catch {
      requestId.current ??= crypto.randomUUID();
    }
    startTransition(async () => {
      try {
        const res = await createOrder({
          requestId: requestId.current!,
          customer: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            shippingAddress: form.shippingAddress,
            billingAddress: sameAsShipping
              ? form.shippingAddress
              : form.billingAddress,
          },
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        });
        if (res.success) {
          requestId.current = null;
          try {
            sessionStorage.removeItem("shop-request-id");
          } catch {}
          clearCart();
          setResult(res);
        } else {
          setFormError(res.error);
        }
      } catch {
        setFormError("Ihre Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut.");
      }
    });
  }

  if (!mounted) {
    return (
      <p className="text-gray-500" aria-live="polite">
        Warenkorb wird geladen…
      </p>
    );
  }

  if (result) {
    return (
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tighter md:text-6xl">
          Kaufanfrage eingegangen
        </h1>
        <div className="border border-gray-200 rounded-lg p-6">
          <p className="mb-2 text-lg">
            Vielen Dank, Ihre Kaufanfrage wurde erfasst. Es wurde keine Zahlung
            vorgenommen.
          </p>
          <p className="mb-1 text-gray-700">
            <span className="font-semibold">Anfragenummer:</span>{" "}
            {result.orderNumber}
          </p>
          <p className="mb-4 text-gray-700">
            <span className="font-semibold">Zwischensumme:</span> €
            {result.total.toFixed(2)}
          </p>
          {result.confirmationEmailSent ? (
            <p className="text-sm text-gray-600">
              Eine Bestätigungs-E-Mail mit einem Link zur Stornierung wurde an{" "}
              <span className="font-medium">{result.email}</span> gesendet. Wir
              bestätigen die Versandkosten und vereinbaren die Zahlung per Rechnung.
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Wir bestätigen die Versandkosten und vereinbaren die Zahlung per Rechnung.
              Der Versand einer E-Mail mit dem Link zur Stornierung konnte nicht bestätigt werden.
              Bitte kontaktieren Sie den Shop, wenn Sie Ihre Anfrage stornieren möchten.
            </p>
          )}
          {!result.merchantEmailSent && (
            <p className="mt-3 text-sm text-red-700" role="alert">
              Wir konnten nicht bestätigen, dass der Shop eine E-Mail zu Ihrer Anfrage erhalten hat. Bitte kontaktieren Sie den Shop direkt und nennen Sie Ihre Anfragenummer.
            </p>
          )}
        </div>
        <div className="mt-8 flex gap-4">
          <Link
            href="/shop"
            className="bg-black text-white px-5 py-3 rounded hover:bg-gray-800 transition-colors"
          >
            Weiter einkaufen
          </Link>
          <button
            type="button"
            onClick={() => {
              setResult(null);
              setForm({
                ...EMPTY_FORM,
                shippingAddress: { ...EMPTY_ADDRESS },
                billingAddress: { ...EMPTY_ADDRESS },
              });
              setSameAsShipping(true);
            }}
            className="border border-gray-300 px-5 py-3 rounded hover:bg-gray-50 transition-colors"
          >
            Weitere Anfrage stellen
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tighter md:text-6xl">
          Warenkorb und Kaufanfrage
        </h1>
        <div className="border border-gray-200 rounded-lg p-6 text-center">
          <p className="mb-4 text-lg text-gray-700">Ihr Warenkorb ist leer.</p>
          <Link
            href="/shop"
            className="inline-block bg-black text-white px-5 py-3 rounded hover:bg-gray-800 transition-colors"
          >
            Zum Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-8 text-5xl font-bold leading-tight tracking-tighter md:text-6xl">
        Warenkorb und Kaufanfrage
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <section aria-label="Ihr Warenkorb">
          <h2 className="mb-4 text-xl font-bold">Ihr Warenkorb</h2>
          <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg">
            {items.map((item) => (
              <li key={item.productId} className="flex items-center gap-4 p-4">
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/shop/${encodeURIComponent(item.slug)}`}
                    className="font-medium hover:underline"
                  >
                    {item.title}
                  </Link>
                  <p className="text-sm text-gray-600">
                    €{Number(item.price).toFixed(2)} pro Stück
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1)
                    }
                    aria-label={`Anzahl von ${item.title} verringern`}
                    className="h-8 w-8 rounded border border-gray-300 hover:bg-gray-100 transition-colors"
                  >
                    −
                  </button>
                  <span className="w-8 text-center tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                    aria-label={`Anzahl von ${item.title} erhöhen`}
                    className="h-8 w-8 rounded border border-gray-300 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
                <div className="w-24 text-right font-semibold tabular-nums">
                  €{(Number(item.price) * item.quantity).toFixed(2)}
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  aria-label={`${item.title} aus dem Warenkorb entfernen`}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={clearCart}
              className="text-sm text-gray-500 hover:text-black hover:underline transition-colors"
            >
              Warenkorb leeren
            </button>
            <div className="text-lg font-bold">
              Zwischensumme: €{subtotal.toFixed(2)}
            </div>
          </div>
        </section>

        <section aria-label="Ihre Angaben">
          <h2 className="mb-4 text-xl font-bold">Ihre Angaben</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field
              id="name"
              label="Vollständiger Name"
              value={form.name}
              onChange={(v) => updateField("name", v)}
              autoComplete="name"
              required
            />
            <Field
              id="email"
              label="E-Mail-Adresse"
              type="email"
              value={form.email}
              onChange={(v) => updateField("email", v)}
              autoComplete="email"
              required
            />
            <Field
              id="phone"
              label="Telefonnummer"
              type="tel"
              value={form.phone}
              onChange={(v) => updateField("phone", v)}
              autoComplete="tel"
              required
            />
            <fieldset className="space-y-4 border-t border-gray-200 pt-4">
              <legend className="text-lg font-semibold">Lieferadresse</legend>
              <AddressFields
                prefix="shipping"
                address={form.shippingAddress}
                onChange={(field, value) =>
                  updateAddress("shippingAddress", field, value)
                }
              />
            </fieldset>
            <fieldset className="space-y-4 border-t border-gray-200 pt-4">
              <legend className="text-lg font-semibold">Rechnungsadresse</legend>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={sameAsShipping}
                  onChange={(event) => setSameAsShipping(event.target.checked)}
                  className="h-4 w-4 accent-black"
                />
                Wie Lieferadresse
              </label>
              {!sameAsShipping && (
                <AddressFields
                  prefix="billing"
                  address={form.billingAddress}
                  onChange={(field, value) =>
                    updateAddress("billingAddress", field, value)
                  }
                />
              )}
            </fieldset>

            {formError && (
              <p
                role="alert"
                className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2"
              >
                {formError}
              </p>
            )}

            <div className="border-t border-gray-200 pt-4">
              <div className="mb-4 flex items-center justify-between text-lg font-bold">
                <span>Zwischensumme</span>
                <span className="tabular-nums">€{subtotal.toFixed(2)}</span>
              </div>
              <button
                type="submit"
                disabled={pending || items.length === 0}
                className="w-full bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {pending ? "Anfrage wird gesendet…" : "Kaufanfrage absenden"}
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Versandkosten und Verfügbarkeit werden persönlich bestätigt. Es erfolgt
              keine Online-Zahlung; wir kontaktieren Sie zu Versand und Rechnungsstellung.
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}

function AddressFields({
  prefix,
  address,
  onChange,
}: {
  prefix: "shipping" | "billing";
  address: AddressState;
  onChange: (field: keyof AddressState, value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <Field
        id={`${prefix}-street`}
        label="Straße und Hausnummer"
        value={address.street}
        onChange={(value) => onChange("street", value)}
        autoComplete={`${prefix} address-line1`}
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Field
          id={`${prefix}-postalCode`}
          label="Postleitzahl"
          value={address.postalCode}
          onChange={(value) => onChange("postalCode", value)}
          autoComplete={`${prefix} postal-code`}
          required
        />
        <Field
          id={`${prefix}-city`}
          label="Ort"
          value={address.city}
          onChange={(value) => onChange("city", value)}
          autoComplete={`${prefix} address-level2`}
          required
        />
      </div>
      <Field
        id={`${prefix}-country`}
        label="Land"
        value={address.country}
        onChange={(value) => onChange("country", value)}
        autoComplete={`${prefix} country-name`}
        required
      />
    </div>
  );
}

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  required,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black outline-none"
      />
    </div>
  );
}

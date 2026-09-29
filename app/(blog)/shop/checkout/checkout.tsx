"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

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
    startTransition(async () => {
      try {
        const res = await createOrder({
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
          clearCart();
          setResult(res);
        } else {
          setFormError(res.error);
        }
      } catch {
        setFormError("Could not submit your request. Please try again.");
      }
    });
  }

  if (!mounted) {
    return (
      <p className="text-gray-500" aria-live="polite">
        Loading your cart…
      </p>
    );
  }

  if (result) {
    return (
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tighter md:text-6xl">
          Purchase request received
        </h1>
        <div className="border border-gray-200 rounded-lg p-6">
          <p className="mb-2 text-lg">
            Thank you, your purchase request has been recorded. No payment has
            been taken.
          </p>
          <p className="mb-1 text-gray-700">
            <span className="font-semibold">Request number:</span>{" "}
            {result.orderNumber}
          </p>
          <p className="mb-4 text-gray-700">
            <span className="font-semibold">Item subtotal:</span> €
            {result.total.toFixed(2)}
          </p>
          {"confirmationEmailSent" in result && result.confirmationEmailSent === true ? (
            <p className="text-sm text-gray-600">
              A confirmation email with a cancellation link is on its way to{" "}
              <span className="font-medium">{result.email}</span>. We will
              confirm shipping and arrange payment by invoice.
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              We will confirm shipping and arrange payment by invoice. We
              could not confirm delivery of a cancellation link by email.
            </p>
          )}
        </div>
        <div className="mt-8 flex gap-4">
          <Link
            href="/shop"
            className="bg-black text-white px-5 py-3 rounded hover:bg-gray-800 transition-colors"
          >
            Continue shopping
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
            Place another order
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tighter md:text-6xl">
          Checkout
        </h1>
        <div className="border border-gray-200 rounded-lg p-6 text-center">
          <p className="mb-4 text-lg text-gray-700">Your cart is empty.</p>
          <Link
            href="/shop"
            className="inline-block bg-black text-white px-5 py-3 rounded hover:bg-gray-800 transition-colors"
          >
            Browse the shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-8 text-5xl font-bold leading-tight tracking-tighter md:text-6xl">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <section aria-label="Your cart">
          <h2 className="mb-4 text-xl font-bold">Your cart</h2>
          <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg">
            {items.map((item) => (
              <li key={item.productId} className="flex items-center gap-4 p-4">
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/shop/${item.slug}`}
                    className="font-medium hover:underline"
                  >
                    {item.title}
                  </Link>
                  <p className="text-sm text-gray-600">
                    €{Number(item.price).toFixed(2)} each
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1)
                    }
                    aria-label={`Decrease quantity of ${item.title}`}
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
                    aria-label={`Increase quantity of ${item.title}`}
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
                  aria-label={`Remove ${item.title} from cart`}
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
              Clear cart
            </button>
            <div className="text-lg font-bold">
              Subtotal: €{subtotal.toFixed(2)}
            </div>
          </div>
        </section>

        <section aria-label="Your details">
          <h2 className="mb-4 text-xl font-bold">Your details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field
              id="name"
              label="Full name"
              value={form.name}
              onChange={(v) => updateField("name", v)}
              autoComplete="name"
              required
            />
            <Field
              id="email"
              label="Email"
              type="email"
              value={form.email}
              onChange={(v) => updateField("email", v)}
              autoComplete="email"
              required
            />
            <Field
              id="phone"
              label="Phone number"
              type="tel"
              value={form.phone}
              onChange={(v) => updateField("phone", v)}
              autoComplete="tel"
              required
            />
            <fieldset className="space-y-4 border-t border-gray-200 pt-4">
              <legend className="text-lg font-semibold">Shipping address</legend>
              <AddressFields
                prefix="shipping"
                address={form.shippingAddress}
                onChange={(field, value) =>
                  updateAddress("shippingAddress", field, value)
                }
              />
            </fieldset>
            <fieldset className="space-y-4 border-t border-gray-200 pt-4">
              <legend className="text-lg font-semibold">Billing address</legend>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={sameAsShipping}
                  onChange={(event) => setSameAsShipping(event.target.checked)}
                  className="h-4 w-4 accent-black"
                />
                Same as shipping address
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
                <span>Item subtotal</span>
                <span className="tabular-nums">€{subtotal.toFixed(2)}</span>
              </div>
              <button
                type="submit"
                disabled={pending || items.length === 0}
                className="w-full bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {pending ? "Submitting request…" : "Submit purchase request"}
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Shipping costs and availability are confirmed manually. No online
              payment is taken; we will contact you about shipping and invoicing.
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
        label="Street and number"
        value={address.street}
        onChange={(value) => onChange("street", value)}
        autoComplete={`${prefix} address-line1`}
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Field
          id={`${prefix}-postalCode`}
          label="Postal code"
          value={address.postalCode}
          onChange={(value) => onChange("postalCode", value)}
          autoComplete={`${prefix} postal-code`}
          required
        />
        <Field
          id={`${prefix}-city`}
          label="City"
          value={address.city}
          onChange={(value) => onChange("city", value)}
          autoComplete={`${prefix} address-level2`}
          required
        />
      </div>
      <Field
        id={`${prefix}-country`}
        label="Country"
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

"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";

export function OutreachSignInForm() {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const formData = new FormData(event.currentTarget);
    try {
      const result = await signIn("credentials", {
        login: String(formData.get("login") ?? ""),
        password: String(formData.get("password") ?? ""),
        callbackUrl: "/account",
        redirect: false,
      });

      if (result?.error || !result?.url) {
        setError("Those sign-in details didn’t match. Check your username or email and password.");
        return;
      }
      window.location.assign(result.url);
    } catch {
      setError("Sign in failed. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      {error && (
        <div className="form-alert" role="alert">
          {error}
        </div>
      )}
      <div className="field">
        <label htmlFor="login">Username or email</label>
        <input
          id="login"
          name="login"
          type="text"
          autoComplete="username"
          maxLength={254}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          maxLength={128}
          required
        />
      </div>
      <button className="button button-green auth-submit" type="submit" disabled={submitting}>
        {submitting ? "Signing in…" : "Sign in"}
        {!submitting && <span aria-hidden="true">→</span>}
      </button>
    </form>
  );
}

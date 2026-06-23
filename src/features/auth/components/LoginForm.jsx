import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Button from "@/shared/components/ui/Button";

export default function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    login(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Error */}
      {error && (
        <div
          role="alert"
          className="px-4 py-3 bg-red-50 border border-state-error/30 rounded-lg text-sm text-state-error"
        >
          {error}
        </div>
      )}

      {/* Email */}
      <div>
        <label htmlFor="email" className="form-label">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={handleChange}
          placeholder="admin@ipmjabar.or.id"
          className="input-field"
        />
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="form-label">Password</label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPass ? "text" : "password"}
            autoComplete="current-password"
            required
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="input-field pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPass((p) => !p)}
            aria-label={showPass ? "Sembunyikan password" : "Tampilkan password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            {showPass ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Submit */}
      <Button type="submit" loading={isLoading} className="w-full justify-center">
        Masuk
      </Button>
    </form>
  );
}

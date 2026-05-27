import { BatchRegistrationForm } from "@/components/forms/BatchRegistrationForm";

export default function RegisterPage() {
  return (
    <section className="space-y-3">
      <header>
        <h1 className="text-xl font-bold text-slate-900">Item Registration</h1>
        <p className="text-sm text-slate-600">Scan incoming products and log expiration batches.</p>
      </header>
      <BatchRegistrationForm />
    </section>
  );
}


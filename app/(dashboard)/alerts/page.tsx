import { ExpiryTaskList } from "@/components/alerts/ExpiryTaskList";

export default function AlertsPage() {
  return (
    <section className="space-y-3">
      <header>
        <h1 className="text-xl font-bold text-slate-900">Notifications & Alerts</h1>
        <p className="text-sm text-slate-600">Prioritized list of batches nearing expiration.</p>
      </header>
      <ExpiryTaskList />
    </section>
  );
}


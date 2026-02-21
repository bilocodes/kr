"use client";

import { useState } from "react";

interface MetaAdAccount {
  id: string;
  name: string;
  account_status: number;
  currency: string;
}

interface MetaCampaign {
  id: string;
  name: string;
  status: string;
  objective: string;
}

export default function MetaPage() {
  const [activeTab, setActiveTab] = useState<"accounts" | "campaigns" | "send">(
    "accounts"
  );
  const [loading, setLoading] = useState(false);
  const [adAccounts, setAdAccounts] = useState<MetaAdAccount[]>([]);
  const [campaigns, setCampaigns] = useState<MetaCampaign[]>([]);
  const [accountId, setAccountId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function fetchAccounts() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/meta?action=accounts");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setAdAccounts(data.accounts ?? []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCampaigns() {
    if (!accountId) return setError("Enter an ad account ID first.");
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/meta?action=campaigns&accountId=${accountId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setCampaigns(data.campaigns ?? []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      const res = await fetch("/api/meta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_message",
          recipientId: formData.get("recipientId"),
          messageText: formData.get("messageText"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setMessage("Message sent successfully! ID: " + data.messageId);
      form.reset();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Meta API</h1>
        <p className="mt-1 text-slate-500">
          Manage ad accounts, campaigns, and messaging via Meta Business API.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-slate-200">
        {(["accounts", "campaigns", "send"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {tab === "send" ? "Send Message" : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}
      {message && (
        <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {/* Accounts tab */}
      {activeTab === "accounts" && (
        <div>
          <button
            onClick={fetchAccounts}
            disabled={loading}
            className="mb-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Loading…" : "Fetch Ad Accounts"}
          </button>
          {adAccounts.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-slate-700">ID</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-700">Name</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-700">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-700">Currency</th>
                  </tr>
                </thead>
                <tbody>
                  {adAccounts.map((acc) => (
                    <tr key={acc.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">{acc.id}</td>
                      <td className="px-4 py-3 text-slate-900">{acc.name}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${acc.account_status === 1 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                          {acc.account_status === 1 ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{acc.currency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Campaigns tab */}
      {activeTab === "campaigns" && (
        <div>
          <div className="mb-4 flex gap-3">
            <input
              type="text"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              placeholder="Ad Account ID (e.g. act_123456)"
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              onClick={fetchCampaigns}
              disabled={loading}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? "Loading…" : "Fetch Campaigns"}
            </button>
          </div>
          {campaigns.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-slate-700">Name</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-700">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-700">Objective</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((c) => (
                    <tr key={c.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-3 text-slate-900">{c.name}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{c.objective}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Send message tab */}
      {activeTab === "send" && (
        <form onSubmit={sendMessage} className="max-w-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Recipient ID (PSID)
            </label>
            <input
              name="recipientId"
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Page-scoped user ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Message
            </label>
            <textarea
              name="messageText"
              required
              rows={4}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Type your message…"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Sending…" : "Send Message"}
          </button>
        </form>
      )}
    </div>
  );
}

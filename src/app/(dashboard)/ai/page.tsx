"use client";

import { useState } from "react";

type AIProvider = "claude" | "openai";

export default function AIPage() {
  const [provider, setProvider] = useState<AIProvider>("openai");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");
      setResult(data.text);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">AI Tools</h1>
        <p className="mt-1 text-slate-500">
          Generate marketing copy and content with Claude or OpenAI.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Input panel */}
        <form onSubmit={handleGenerate} className="space-y-5">
          {/* Provider selector */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              AI Provider
            </label>
            <div className="flex gap-3">
              {(["openai", "claude"] as AIProvider[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setProvider(p)}
                  className={`flex-1 rounded-lg border-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
                    provider === p
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {p === "openai" ? "🟢 OpenAI" : "🟣 Claude"}
                </button>
              ))}
            </div>
          </div>

          {/* Quick templates */}
          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">
              Quick templates
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "Write a Facebook ad for a new product launch",
                "Create an email subject line for a promotion",
                "Write a 3-sentence Instagram caption",
                "Suggest 5 ad headline variations",
              ].map((tpl) => (
                <button
                  key={tpl}
                  type="button"
                  onClick={() => setPrompt(tpl)}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 hover:bg-slate-200"
                >
                  {tpl}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
              rows={6}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Describe what you want to generate…"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Generating…" : "Generate"}
          </button>
        </form>

        {/* Output panel */}
        <div className="flex flex-col">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-700">Output</p>
            {result && (
              <button
                onClick={() => navigator.clipboard.writeText(result)}
                className="text-xs text-indigo-600 hover:underline"
              >
                Copy
              </button>
            )}
          </div>
          <div className="flex-1 min-h-48 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 whitespace-pre-wrap">
            {loading ? (
              <span className="animate-pulse text-slate-400">
                Generating content…
              </span>
            ) : result ? (
              result
            ) : (
              <span className="text-slate-400">
                Your generated content will appear here.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

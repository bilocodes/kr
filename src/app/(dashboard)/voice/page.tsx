"use client";

import { useState, useEffect, useRef } from "react";

interface Voice {
  voice_id: string;
  name: string;
  category: string;
}

export default function VoicePage() {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingVoices, setFetchingVoices] = useState(false);
  const [error, setError] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    async function loadVoices() {
      setFetchingVoices(true);
      try {
        const res = await fetch("/api/voice?action=voices");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed to load voices");
        setVoices(data.voices ?? []);
        if (data.voices?.length) setSelectedVoice(data.voices[0].voice_id);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setFetchingVoices(false);
      }
    }
    loadVoices();
  }, []);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAudioUrl(null);
    try {
      const res = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voiceId: selectedVoice, text }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Generation failed");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Voice Generation
        </h1>
        <p className="mt-1 text-slate-500">
          Convert marketing copy to professional voice-overs via ElevenLabs.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <form onSubmit={handleGenerate} className="space-y-5">
          {/* Voice selector */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Voice
            </label>
            {fetchingVoices ? (
              <p className="mt-1 text-sm text-slate-400">Loading voices…</p>
            ) : (
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {voices.map((v) => (
                  <option key={v.voice_id} value={v.voice_id}>
                    {v.name} — {v.category}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Text */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Text to convert
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              rows={6}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Enter the text you want to convert to speech…"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !text.trim() || !selectedVoice}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Generating audio…" : "Generate Voice"}
          </button>
        </form>

        {/* Audio player */}
        <div className="flex flex-col justify-center">
          {audioUrl ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <p className="mb-4 text-sm font-medium text-slate-700">
                🎧 Audio ready
              </p>
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <audio
                ref={audioRef}
                controls
                src={audioUrl}
                className="w-full"
              />
              <a
                href={audioUrl}
                download="voiceover.mp3"
                className="mt-4 inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline"
              >
                ⬇ Download MP3
              </a>
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed border-slate-200 p-10 text-center text-sm text-slate-400">
              Generated audio will appear here
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

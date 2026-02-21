import { auth } from "@/lib/auth";
import Link from "next/link";

const tools = [
  {
    href: "/dashboard/meta",
    title: "Meta API",
    description: "Manage and send campaigns via the Meta Business API.",
    icon: "📣",
    color: "bg-blue-50 border-blue-200",
  },
  {
    href: "/dashboard/ai",
    title: "AI Tools",
    description: "Generate copy and content with Claude & OpenAI.",
    icon: "🤖",
    color: "bg-purple-50 border-purple-200",
  },
  {
    href: "/dashboard/voice",
    title: "Voice Generation",
    description: "Create voice-overs and audio clips with ElevenLabs.",
    icon: "🎙️",
    color: "bg-green-50 border-green-200",
  },
];

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {session?.user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="mt-1 text-slate-500">
          Your internal marketing hub — all tools in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className={`rounded-xl border-2 p-6 transition-shadow hover:shadow-md ${tool.color}`}
          >
            <div className="mb-3 text-3xl">{tool.icon}</div>
            <h2 className="text-lg font-semibold text-slate-900">
              {tool.title}
            </h2>
            <p className="mt-1 text-sm text-slate-600">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

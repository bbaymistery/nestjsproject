import Link from "next/link";
import { Sparkles, Code2, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto px-4 sm:px-8 py-20 flex flex-col items-center justify-center text-center">
      
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-semibold mb-6">
        <Sparkles className="h-3.5 w-3.5" />
        Full-Stack Learning Project
      </div>

      {/* Hero Headline */}
      <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-3xl mb-4 leading-tight">
        Welcome to <span className="bg-gradient-to-r from-amber-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">Poster Parlor</span>
      </h1>

      <p className="text-muted-foreground text-base sm:text-lg max-w-xl mb-8">
        NestJS Backend və Next.js Frontend ilə addım-addım hazırladığımız möhtəşəm poster mağazası tətbiqi.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/api-docs"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-black font-bold text-sm shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-all hover:scale-105"
        >
          <Code2 className="h-4 w-4" />
          API Documentation Gör
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

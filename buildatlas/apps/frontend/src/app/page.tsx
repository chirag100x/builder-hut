"use client"
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <div className="h-[calc(100vh-72px)] bg-slate-900 flex flex-col items-center justify-center p-8 text-center text-white -mx-auto rounded-none w-full max-w-none">
      <div className="max-w-3xl">
        <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
          BuildAtlas
        </h1>
        <h2 className="text-2xl sm:text-3xl font-light text-slate-300 mb-8">
          Smart Construction Intelligence Platform
        </h2>
        <p className="text-lg sm:text-xl text-slate-400 mb-12 leading-relaxed">
          AI-powered cost estimation, schedule planning, and resource allocation exclusively built for construction professionals in India.
        </p>
        <button 
          onClick={() => router.push('/estimate')}
          className="px-10 py-4 bg-blue-600 hover:bg-blue-500 transition-all font-semibold text-lg sm:text-xl rounded-xl shadow-lg hover:shadow-blue-500/25 active:scale-95"
        >
          Start Planning
        </button>
      </div>
    </div>
  )
}

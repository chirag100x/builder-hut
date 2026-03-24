import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-slate-900 text-white p-4 shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="font-bold text-2xl tracking-tight">BuildAtlas</div>
        <div className="flex space-x-8 font-medium">
          <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
          <Link href="/estimate" className="hover:text-blue-400 transition-colors">Estimate</Link>
          <Link href="/chat" className="hover:text-blue-400 transition-colors">Chat</Link>
        </div>
      </div>
    </nav>
  )
}

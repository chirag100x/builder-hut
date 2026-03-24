"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { EstimateResponse, ProjectFormData } from '@/lib/api'

export default function ResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<EstimateResponse | null>(null)
  const [form, setForm] = useState<ProjectFormData | null>(null)

  useEffect(() => {
    const resData = localStorage.getItem('buildatlas_result')
    const formData = localStorage.getItem('buildatlas_form')
    
    if (!resData || !formData) {
      router.push('/estimate')
      return
    }
    
    setResult(JSON.parse(resData))
    setForm(JSON.parse(formData))
  }, [router])

  if (!result || !form) return null

  const formatINR = (val: number) => new Intl.NumberFormat('en-IN').format(val)

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 pb-24 relative">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Project Plan & Estimates</h1>
        <button className="text-blue-600 font-medium hover:underline" onClick={() => router.push('/estimate')}>
          ← Back to Edit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* SECTION A — Cost Estimate Card */}
        <div className="bg-teal-50 border border-teal-200 p-8 rounded-2xl shadow-sm">
          <h2 className="text-teal-800 font-bold text-xl mb-4">Estimated Project Cost</h2>
          <div className="text-4xl font-extrabold text-teal-900 mb-2">
            ₹{formatINR(result.cost_low)} — ₹{formatINR(result.cost_high)}
          </div>
          <div className="text-teal-700 font-medium">
            Point estimate: ₹{formatINR(result.cost_predicted)}
          </div>
        </div>

        {/* SECTION B — Duration Card */}
        <div className="bg-blue-50 border border-blue-200 p-8 rounded-2xl shadow-sm">
          <h2 className="text-blue-800 font-bold text-xl mb-4">Estimated Duration</h2>
          <div className="text-4xl font-extrabold text-blue-900 mb-2">
            {result.duration_low} — {result.duration_high} days
          </div>
          <div className="text-blue-700 font-medium">
            Projected timeline based on {form.num_workers} workers
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* SECTION C — Construction Schedule */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Week-by-Week Schedule</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600">
                    <th className="p-3 font-semibold border-b">Week</th>
                    <th className="p-3 font-semibold border-b">Task</th>
                    <th className="p-3 font-semibold border-b w-32">Milestone</th>
                  </tr>
                </thead>
                <tbody>
                  {(result.schedule || []).map((item, idx) => (
                    <tr key={idx} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="p-3 font-medium text-gray-900 w-24">Week {item.week}</td>
                      <td className="p-3 text-gray-700">{item.task}</td>
                      <td className="p-3">
                        {item.milestone && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full uppercase tracking-wider">
                            Milestone
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {(!result.schedule || result.schedule.length === 0) && (
                    <tr><td colSpan={3} className="p-4 text-center text-gray-500">No schedule generated</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* SECTION F — Recommendation */}
          <section>
            <h2 className="text-xl font-bold mb-4">AI Recommendation</h2>
            <blockquote className="bg-slate-50 border-l-4 border-blue-500 p-6 rounded-r-xl italic text-slate-700 text-lg shadow-sm">
              "{result.recommendation || 'No specific recommendations provided.'}"
            </blockquote>
          </section>
        </div>

        <div className="space-y-8">
          {/* SECTION D — Resource Plan */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Resource Requirements</h2>
            
            <h3 className="font-semibold text-gray-800 mb-2">Worker Breakdown</h3>
            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              {Object.entries(result.resources?.workers_breakdown || {}).length > 0 ? (
                Object.entries(result.resources.workers_breakdown).map(([role, count]) => (
                  <div key={role} className="flex justify-between py-1 border-b border-gray-200 last:border-0">
                    <span className="text-gray-600">{role}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))
              ) : <div className="text-gray-500 text-sm">Not specified</div>}
            </div>

            <h3 className="font-semibold text-gray-800 mb-2">Key Materials</h3>
            <ul className="list-disc pl-5 mb-4 text-gray-600 space-y-1">
              {(result.resources?.materials || []).map((m, i) => <li key={i}>{m}</li>)}
            </ul>

            <h3 className="font-semibold text-gray-800 mb-2">Equipment</h3>
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              {(result.resources?.equipment || []).map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          </section>

          {/* SECTION E — Risk Flags */}
          <section>
            <h2 className="text-xl font-bold mb-4">Risk Flags</h2>
            <div className="space-y-3">
              {(result.risk_flags || []).length > 0 ? result.risk_flags.map((risk, idx) => (
                <div key={idx} className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex items-start gap-3">
                  <span className="text-yellow-600">▲</span>
                  <p className="text-yellow-800 font-medium text-sm pt-0.5">{risk}</p>
                </div>
              )) : (
                <div className="text-gray-500 italic p-4 bg-gray-50 border border-gray-100 shadow-sm rounded-lg">No major risks identified.</div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Fixed Chat Button */}
      <Link 
        href="/chat" 
        className="fixed bottom-8 right-8 w-16 h-16 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-2xl flex items-center justify-center text-3xl transition-transform hover:scale-110 z-50 ring-4 ring-white"
        title="Chat with AI"
      >
        💬
      </Link>
    </div>
  )
}

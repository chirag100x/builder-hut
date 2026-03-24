"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getEstimate, ProjectFormData } from '@/lib/api'

export default function EstimatePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<ProjectFormData>({
    project_type: 'Residential',
    location_tier: 'Tier1',
    total_area_sqft: 2000,
    num_floors: 3,
    structure_type: 'RCC',
    material_quality: 'Standard',
    num_workers: 20,
    site_condition: 'Easy'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: e.target.type === 'number' ? Number(value) : value 
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const result = await getEstimate(formData)
      localStorage.setItem('buildatlas_result', JSON.stringify(result))
      localStorage.setItem('buildatlas_form', JSON.stringify(formData))
      router.push('/results')
    } catch (err: any) {
      setError(err.message || "Failed to generate estimate")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8">Project Details</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Project Type</label>
            <select name="project_type" value={formData.project_type} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option>Residential</option>
              <option>Commercial</option>
              <option>Industrial</option>
              <option>Infrastructure</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Location Tier</label>
            <select name="location_tier" value={formData.location_tier} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option>Tier1</option>
              <option>Tier2</option>
              <option>Tier3</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Total Area (sqft)</label>
            <input type="number" name="total_area_sqft" min="500" max="50000" value={formData.total_area_sqft} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Floors</label>
            <input type="number" name="num_floors" min="1" max="20" value={formData.num_floors} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Structure Type</label>
            <select name="structure_type" value={formData.structure_type} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option>RCC</option>
              <option>Steel Frame</option>
              <option>Load Bearing</option>
              <option>Prefabricated</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Material Quality</label>
            <select name="material_quality" value={formData.material_quality} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option>Basic</option>
              <option>Standard</option>
              <option>Premium</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Workers</label>
            <input type="number" name="num_workers" min="5" max="200" value={formData.num_workers} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Site Condition</label>
            <select name="site_condition" value={formData.site_condition} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option>Easy</option>
              <option>Moderate</option>
              <option>Difficult</option>
            </select>
          </div>
        </div>

        {error && <div className="text-red-600 mb-4 p-3 bg-red-50 rounded-lg border border-red-100">{error}</div>}
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-slate-900 text-white p-4 rounded-lg font-bold text-lg hover:bg-slate-800 transition disabled:opacity-75 disabled:cursor-not-allowed flex justify-center items-center"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing project...
            </span>
          ) : "Generate Plan"}
        </button>
      </form>
    </div>
  )
}

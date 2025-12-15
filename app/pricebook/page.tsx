'use client'

import { useState, useEffect } from 'react'
import { Check, Package, Star } from 'lucide-react'
import Image from 'next/image'

interface ServiceComponent {
  id: string
  name: string
  description: string
  price: number
  photoUrl: string | null
}

interface BundleComponent {
  id: string
  componentId: string
  quantity: number
  component: ServiceComponent
}

interface ServiceBundle {
  id: string
  name: string
  description: string
  flatPrice: number
  photoUrl: string | null
  components: BundleComponent[]
}

export default function PricebookPage() {
  const [components, setComponents] = useState<ServiceComponent[]>([])
  const [bundles, setBundles] = useState<ServiceBundle[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'all' | 'services' | 'bundles'>('all')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [componentsRes, bundlesRes] = await Promise.all([
        fetch('/api/components'),
        fetch('/api/bundles'),
      ])

      const componentsData = await componentsRes.json()
      const bundlesData = await bundlesRes.json()

      setComponents(componentsData)
      setBundles(bundlesData)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pricebook...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Professional accounting services tailored to your needs. Choose individual services
            or save with our bundled packages.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 py-4">
            <button
              onClick={() => setView('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Services
            </button>
            <button
              onClick={() => setView('bundles')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                view === 'bundles'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Package size={18} />
              Bundles
            </button>
            <button
              onClick={() => setView('services')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === 'services'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Individual Services
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Bundles Section */}
        {(view === 'all' || view === 'bundles') && bundles.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Package className="text-primary-600" size={28} />
              <h2 className="text-3xl font-bold text-gray-900">Bundle Packages</h2>
              <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                Best Value
              </span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {bundles.map((bundle) => {
                const totalValue = bundle.components.reduce(
                  (sum, bc) => sum + bc.component.price * bc.quantity,
                  0
                )
                const savings = totalValue - bundle.flatPrice
                const savingsPercent = (savings / totalValue) * 100

                return (
                  <div
                    key={bundle.id}
                    className="card hover:shadow-xl transition-all border-2 border-primary-200 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 text-sm font-bold">
                      Save {savingsPercent.toFixed(0)}%
                    </div>

                    {bundle.photoUrl && (
                      <div className="relative h-48 -mx-6 -mt-6 mb-4">
                        <img
                          src={bundle.photoUrl}
                          alt={bundle.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="flex items-start gap-2 mb-3">
                      <Star className="text-primary-600 fill-primary-600 mt-1" size={20} />
                      <h3 className="text-2xl font-bold text-gray-900">{bundle.name}</h3>
                    </div>

                    <p className="text-gray-600 mb-4">{bundle.description}</p>

                    <div className="bg-primary-50 -mx-6 px-6 py-4 mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        Included Services:
                      </p>
                      <ul className="space-y-2">
                        {bundle.components.map((bc) => (
                          <li key={bc.id} className="flex items-start gap-2 text-sm">
                            <Check className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                            <span className="text-gray-700">
                              {bc.component.name}
                              {bc.quantity > 1 && (
                                <span className="text-gray-500"> (×{bc.quantity})</span>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Regular Price:</span>
                        <span className="line-through text-gray-400">
                          ${totalValue.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-lg font-semibold text-gray-900">
                          Bundle Price:
                        </span>
                        <span className="text-3xl font-bold text-primary-600">
                          ${bundle.flatPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Individual Services Section */}
        {(view === 'all' || view === 'services') && components.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Individual Services</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {components.map((component) => (
                <div
                  key={component.id}
                  className="card hover:shadow-lg transition-shadow"
                >
                  {component.photoUrl && (
                    <div className="relative h-40 -mx-6 -mt-6 mb-4">
                      <img
                        src={component.photoUrl}
                        alt={component.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {component.name}
                  </h3>

                  <p className="text-gray-600 mb-4 min-h-[3rem]">{component.description}</p>

                  <div className="flex justify-between items-center pt-4 border-t mt-auto">
                    <span className="text-gray-700 font-medium">Price:</span>
                    <span className="text-2xl font-bold text-gray-900">
                      ${component.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {components.length === 0 && bundles.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Services Available</h3>
            <p className="text-gray-600">
              Our pricebook is being updated. Please check back soon!
            </p>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-primary-600 text-white py-16 mt-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-primary-100 mb-8">
            Contact us today to discuss which services best fit your needs
          </p>
          <button className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  )
}

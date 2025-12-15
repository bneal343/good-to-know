'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, DollarSign, Package } from 'lucide-react'

interface ServiceComponent {
  id: string
  name: string
  description: string
  price: number
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

interface SelectedComponent {
  componentId: string
  quantity: number
}

export default function BundlesAdminPage() {
  const [bundles, setBundles] = useState<ServiceBundle[]>([])
  const [allComponents, setAllComponents] = useState<ServiceComponent[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBundle, setEditingBundle] = useState<ServiceBundle | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    flatPrice: '',
    photoUrl: '',
  })

  const [selectedComponents, setSelectedComponents] = useState<SelectedComponent[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [bundlesRes, componentsRes] = await Promise.all([
        fetch('/api/bundles'),
        fetch('/api/components'),
      ])

      const bundlesData = await bundlesRes.json()
      const componentsData = await componentsRes.json()

      setBundles(bundlesData)
      setAllComponents(componentsData)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedComponents.length === 0) {
      alert('Please select at least one component')
      return
    }

    try {
      const url = editingBundle ? `/api/bundles/${editingBundle.id}` : '/api/bundles'
      const method = editingBundle ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          components: selectedComponents,
        }),
      })

      if (response.ok) {
        await fetchData()
        closeModal()
      }
    } catch (error) {
      console.error('Failed to save bundle:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bundle?')) return

    try {
      const response = await fetch(`/api/bundles/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchData()
      }
    } catch (error) {
      console.error('Failed to delete bundle:', error)
    }
  }

  const openModal = (bundle?: ServiceBundle) => {
    if (bundle) {
      setEditingBundle(bundle)
      setFormData({
        name: bundle.name,
        description: bundle.description,
        flatPrice: bundle.flatPrice.toString(),
        photoUrl: bundle.photoUrl || '',
      })
      setSelectedComponents(
        bundle.components.map((bc) => ({
          componentId: bc.componentId,
          quantity: bc.quantity,
        }))
      )
    } else {
      setEditingBundle(null)
      setFormData({
        name: '',
        description: '',
        flatPrice: '',
        photoUrl: '',
      })
      setSelectedComponents([])
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingBundle(null)
  }

  const toggleComponent = (componentId: string) => {
    const exists = selectedComponents.find((sc) => sc.componentId === componentId)
    if (exists) {
      setSelectedComponents(selectedComponents.filter((sc) => sc.componentId !== componentId))
    } else {
      setSelectedComponents([...selectedComponents, { componentId, quantity: 1 }])
    }
  }

  const updateQuantity = (componentId: string, quantity: number) => {
    setSelectedComponents(
      selectedComponents.map((sc) =>
        sc.componentId === componentId ? { ...sc, quantity: Math.max(1, quantity) } : sc
      )
    )
  }

  const calculateTotalValue = () => {
    return selectedComponents.reduce((total, sc) => {
      const component = allComponents.find((c) => c.id === sc.componentId)
      return total + (component?.price || 0) * sc.quantity
    }, 0)
  }

  const calculateSavings = () => {
    const totalValue = calculateTotalValue()
    const flatPrice = parseFloat(formData.flatPrice) || 0
    return totalValue - flatPrice
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service Bundles</h1>
          <p className="text-gray-600 mt-1">Create bundled services at discounted rates</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Add Bundle
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {bundles.map((bundle) => {
          const totalValue = bundle.components.reduce(
            (sum, bc) => sum + bc.component.price * bc.quantity,
            0
          )
          const savings = totalValue - bundle.flatPrice

          return (
            <div key={bundle.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <Package className="text-primary-600" size={24} />
                  <h3 className="text-xl font-semibold text-gray-900">{bundle.name}</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(bundle)}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(bundle.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4">{bundle.description}</p>

              <div className="bg-gray-50 p-3 rounded mb-3">
                <p className="text-xs text-gray-600 mb-2 font-medium">Included Services:</p>
                <ul className="space-y-1">
                  {bundle.components.map((bc) => (
                    <li key={bc.id} className="text-sm text-gray-700">
                      • {bc.component.name}
                      {bc.quantity > 1 && (
                        <span className="text-gray-500"> (x{bc.quantity})</span>
                      )}
                      <span className="text-gray-500 ml-2">
                        ${(bc.component.price * bc.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Value:</span>
                  <span className="font-medium line-through text-gray-400">
                    ${totalValue.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 font-medium">You Save:</span>
                  <span className="text-green-600 font-bold">${savings.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="font-semibold flex items-center gap-1">
                    <DollarSign size={16} /> Bundle Price:
                  </span>
                  <span className="text-xl font-bold text-primary-600">
                    ${bundle.flatPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {bundles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No bundles yet. Create your first one!</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {editingBundle ? 'Edit Bundle' : 'New Bundle'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bundle Name
                  </label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    className="input-field"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Components
                  </label>
                  <div className="border rounded-lg p-4 max-h-64 overflow-y-auto space-y-2">
                    {allComponents.map((component) => {
                      const selected = selectedComponents.find(
                        (sc) => sc.componentId === component.id
                      )
                      return (
                        <div
                          key={component.id}
                          className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <input
                              type="checkbox"
                              checked={!!selected}
                              onChange={() => toggleComponent(component.id)}
                              className="w-4 h-4"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{component.name}</p>
                              <p className="text-xs text-gray-500">${component.price}</p>
                            </div>
                          </div>
                          {selected && (
                            <div className="flex items-center gap-2">
                              <label className="text-xs text-gray-600">Qty:</label>
                              <input
                                type="number"
                                min="1"
                                value={selected.quantity}
                                onChange={(e) =>
                                  updateQuantity(component.id, parseInt(e.target.value))
                                }
                                className="w-16 px-2 py-1 border rounded text-sm"
                              />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {selectedComponents.length > 0 && (
                  <div className="bg-blue-50 p-4 rounded space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">Total Component Value:</span>
                      <span className="font-semibold">${calculateTotalValue().toFixed(2)}</span>
                    </div>
                    {formData.flatPrice && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700">Bundle Price:</span>
                          <span className="font-semibold">
                            ${parseFloat(formData.flatPrice).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm font-bold border-t pt-2">
                          <span
                            className={
                              calculateSavings() > 0 ? 'text-green-600' : 'text-red-600'
                            }
                          >
                            {calculateSavings() > 0 ? 'Customer Saves:' : 'No Savings:'}
                          </span>
                          <span
                            className={
                              calculateSavings() > 0 ? 'text-green-600' : 'text-red-600'
                            }
                          >
                            ${Math.abs(calculateSavings()).toFixed(2)}
                            {calculateSavings() > 0 &&
                              ` (${((calculateSavings() / calculateTotalValue()) * 100).toFixed(0)}%)`}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bundle Flat Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="input-field"
                    value={formData.flatPrice}
                    onChange={(e) => setFormData({ ...formData, flatPrice: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Set this lower than total value to offer a discount
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Photo URL (optional)
                  </label>
                  <input
                    type="url"
                    className="input-field"
                    placeholder="https://example.com/image.jpg"
                    value={formData.photoUrl}
                    onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    {editingBundle ? 'Update' : 'Create'} Bundle
                  </button>
                  <button type="button" onClick={closeModal} className="btn-secondary flex-1">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

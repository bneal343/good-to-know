'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, DollarSign, Clock } from 'lucide-react'

interface ServiceComponent {
  id: string
  name: string
  description: string
  estimatedHours: number
  billableRate: number
  price: number
  photoUrl: string | null
  isActive: boolean
}

export default function ComponentsAdminPage() {
  const [components, setComponents] = useState<ServiceComponent[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingComponent, setEditingComponent] = useState<ServiceComponent | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    estimatedHours: '',
    billableRate: '',
    price: '',
    photoUrl: '',
  })

  useEffect(() => {
    fetchComponents()
  }, [])

  const fetchComponents = async () => {
    try {
      const response = await fetch('/api/components')
      const data = await response.json()
      setComponents(data)
    } catch (error) {
      console.error('Failed to fetch components:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingComponent
        ? `/api/components/${editingComponent.id}`
        : '/api/components'

      const method = editingComponent ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchComponents()
        closeModal()
      }
    } catch (error) {
      console.error('Failed to save component:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this component?')) return

    try {
      const response = await fetch(`/api/components/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchComponents()
      }
    } catch (error) {
      console.error('Failed to delete component:', error)
    }
  }

  const openModal = (component?: ServiceComponent) => {
    if (component) {
      setEditingComponent(component)
      setFormData({
        name: component.name,
        description: component.description,
        estimatedHours: component.estimatedHours.toString(),
        billableRate: component.billableRate.toString(),
        price: component.price.toString(),
        photoUrl: component.photoUrl || '',
      })
    } else {
      setEditingComponent(null)
      setFormData({
        name: '',
        description: '',
        estimatedHours: '',
        billableRate: '',
        price: '',
        photoUrl: '',
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingComponent(null)
  }

  const calculateCost = () => {
    const hours = parseFloat(formData.estimatedHours) || 0
    const rate = parseFloat(formData.billableRate) || 0
    return hours * rate
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service Components</h1>
          <p className="text-gray-600 mt-1">Manage individual service offerings</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Add Component
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {components.map((component) => (
          <div key={component.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-semibold text-gray-900">{component.name}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(component)}
                  className="text-primary-600 hover:text-primary-700"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(component.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4">{component.description}</p>

            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-1">
                  <Clock size={14} /> Est. Hours:
                </span>
                <span className="font-medium">{component.estimatedHours}h</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Billable Rate:</span>
                <span className="font-medium">${component.billableRate}/hr</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Cost:</span>
                <span className="font-medium">
                  ${(component.estimatedHours * component.billableRate).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="font-semibold flex items-center gap-1">
                  <DollarSign size={16} /> Client Price:
                </span>
                <span className="text-xl font-bold text-primary-600">
                  ${component.price.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {components.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No components yet. Create your first one!</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {editingComponent ? 'Edit Component' : 'New Component'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Name
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

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estimated Hours
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      required
                      className="input-field"
                      value={formData.estimatedHours}
                      onChange={(e) =>
                        setFormData({ ...formData, estimatedHours: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Billable Rate ($/hour)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      className="input-field"
                      value={formData.billableRate}
                      onChange={(e) =>
                        setFormData({ ...formData, billableRate: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">
                    Calculated Cost: <strong>${calculateCost().toFixed(2)}</strong>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="input-field"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This is what the customer sees
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
                    {editingComponent ? 'Update' : 'Create'} Component
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn-secondary flex-1"
                  >
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

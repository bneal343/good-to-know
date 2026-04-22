'use client'

import { useMemo, useState } from 'react'

type MetricsResponse = {
  metrics: {
    revenue: number
    averageTicket: number
    totalJobs: number
    completedJobs: number
  }
  meta: {
    timeframe: {
      startDate: string | null
      endDate: string | null
    }
    sampledRecordCount: number
  }
  error?: string
}

function toCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(amount)
}

function getDefaultStartDate(): string {
  const d = new Date()
  d.setDate(1)
  return d.toISOString().split('T')[0]
}

function getDefaultEndDate(): string {
  return new Date().toISOString().split('T')[0]
}

export default function DashboardPage() {
  const [startDate, setStartDate] = useState(getDefaultStartDate())
  const [endDate, setEndDate] = useState(getDefaultEndDate())
  const [data, setData] = useState<MetricsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const hasData = useMemo(() => Boolean(data && !data.error), [data])
  const metrics = data?.metrics
  const sampleCount = data?.meta.sampledRecordCount

  const fetchMetrics = async () => {
    setLoading(true)
    setError('')

    try {
      const params = new URLSearchParams({ startDate, endDate })
      const response = await fetch(`/api/housecall/metrics?${params.toString()}`)
      const payload: MetricsResponse = await response.json()

      if (!response.ok) {
        throw new Error(payload.error || 'Unable to load metrics')
      }

      setData(payload)
    } catch (err) {
      setData(null)
      setError(err instanceof Error ? err.message : 'Unexpected error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="card">
          <h1 className="text-3xl font-bold text-gray-900">Housecall Pro Revenue Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Start with revenue and average ticket now, and easily add more metrics over time.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="flex items-end">
              <button className="btn-primary w-full" onClick={fetchMetrics} disabled={loading}>
                {loading ? 'Loading...' : 'Refresh Dashboard'}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700">{error}</div>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card">
            <p className="text-sm text-gray-500">Revenue</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {hasData && metrics ? toCurrency(metrics.revenue) : '--'}
            </p>
          </div>

          <div className="card">
            <p className="text-sm text-gray-500">Average Ticket</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {hasData && metrics ? toCurrency(metrics.averageTicket) : '--'}
            </p>
          </div>

          <div className="card">
            <p className="text-sm text-gray-500">Completed Jobs</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {hasData && metrics ? metrics.completedJobs : '--'}
            </p>
          </div>

          <div className="card">
            <p className="text-sm text-gray-500">Jobs (Filtered)</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {hasData && metrics ? metrics.totalJobs : '--'}
            </p>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900">Next metrics to add</h2>
          <ul className="mt-3 list-disc list-inside text-gray-700 space-y-1">
            <li>Revenue by technician</li>
            <li>Revenue by service category</li>
            <li>Close rate by lead source</li>
            <li>Weekly trendlines and month-over-month growth</li>
          </ul>
          {hasData && (
            <p className="text-sm text-gray-500 mt-4">
              Source records sampled: {sampleCount}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

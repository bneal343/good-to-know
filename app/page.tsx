import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Accounting Services Pricebook
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Professional accounting services with flexible pricing and money-saving bundles
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <Link href="/pricebook" className="card hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">📊</div>
              <h2 className="text-2xl font-semibold mb-2">View Pricebook</h2>
              <p className="text-gray-600">
                Browse our complete catalog of services and bundles
              </p>
            </Link>

            <Link href="/admin/components" className="card hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🔧</div>
              <h2 className="text-2xl font-semibold mb-2">Manage Components</h2>
              <p className="text-gray-600">
                Add, edit, and configure individual service components
              </p>
            </Link>

            <Link href="/admin/bundles" className="card hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">📦</div>
              <h2 className="text-2xl font-semibold mb-2">Manage Bundles</h2>
              <p className="text-gray-600">
                Create and manage service bundles with discounted pricing
              </p>
            </Link>

            <Link href="/dashboard" className="card hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">💰</div>
              <h2 className="text-2xl font-semibold mb-2">Revenue Dashboard</h2>
              <p className="text-gray-600">
                Track revenue and average ticket from Housecall Pro
              </p>
            </Link>
          </div>

          <div className="mt-16 card max-w-3xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4">How It Works</h3>
            <div className="text-left space-y-4 text-gray-700">
              <p>
                <strong className="text-primary-600">1. Build Components:</strong> Create individual
                service offerings with estimated time, billable rates, and pricing.
              </p>
              <p>
                <strong className="text-primary-600">2. Create Bundles:</strong> Combine multiple
                components into packages and offer them at discounted flat rates.
              </p>
              <p>
                <strong className="text-primary-600">3. Share with Clients:</strong> Clients see
                only the price, description, and photos - your cost calculations stay private.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

# Accounting Services Pricebook

A professional pricebook application for accounting services that enables you to build service bundles from individual components and offer them at discounted flat rates.

## Features

### Service Components
- Create individual service offerings with detailed pricing
- Track estimated hours and billable rates (backend only)
- Set client-facing prices
- Add optional photos
- Calculate profit margins automatically

### Service Bundles
- Combine multiple components into bundled packages
- Set discounted flat-rate pricing
- Show savings percentage to clients
- Control component quantities in bundles
- Visual display of bundle value vs. price

### Client-Facing Pricebook
- Professional, clean interface showing only relevant information
- Clients see: Price, Description, and Photos
- Hidden from clients: Estimated hours, billable rates, cost calculations
- Filter between bundles and individual services
- Responsive design for all devices

## Technology Stack

- **Frontend**: Next.js 14 with React 18
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Language**: TypeScript
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npm run db:push
```

4. Seed the database with sample data:
```bash
npm run db:seed
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Managing Service Components

1. Navigate to **Manage Components** from the navigation menu
2. Click **Add Component** to create a new service
3. Fill in the required fields:
   - **Service Name**: Name of the service
   - **Description**: Detailed description for clients
   - **Estimated Hours**: Time required (for cost calculation)
   - **Billable Rate**: Your hourly rate (for cost calculation)
   - **Client Price**: What the customer pays
   - **Photo URL**: Optional image URL

The system automatically calculates your cost (hours × rate) so you can see your margin.

### Creating Service Bundles

1. Navigate to **Manage Bundles** from the navigation menu
2. Click **Add Bundle** to create a new package
3. Fill in bundle details:
   - **Bundle Name**: Package name
   - **Description**: What makes this bundle valuable
   - **Select Components**: Choose which services to include
   - **Quantities**: Set how many of each component
   - **Bundle Flat Price**: Discounted price for the package
   - **Photo URL**: Optional image URL

The system shows the total value of components and calculates savings automatically.

### Viewing the Pricebook

1. Navigate to **View Pricebook** from the navigation menu
2. Filter by:
   - **All Services**: Shows both bundles and individual services
   - **Bundles**: Shows only bundled packages
   - **Individual Services**: Shows only single services

Clients see a professional presentation with prices, descriptions, and photos. Cost calculations are hidden.

## Database Schema

### ServiceComponent
- Individual service offerings
- Fields: name, description, estimatedHours, billableRate, price, photoUrl

### ServiceBundle
- Bundled service packages
- Fields: name, description, flatPrice, photoUrl

### BundleComponent
- Junction table for many-to-many relationship
- Links bundles to components with quantities

## API Endpoints

### Components
- `GET /api/components` - Get all active components
- `POST /api/components` - Create new component
- `GET /api/components/[id]` - Get single component
- `PUT /api/components/[id]` - Update component
- `DELETE /api/components/[id]` - Delete component

### Bundles
- `GET /api/bundles` - Get all active bundles with components
- `POST /api/bundles` - Create new bundle
- `GET /api/bundles/[id]` - Get single bundle
- `PUT /api/bundles/[id]` - Update bundle
- `DELETE /api/bundles/[id]` - Delete bundle

## Project Structure

```
├── app/
│   ├── admin/
│   │   ├── components/      # Component management UI
│   │   └── bundles/         # Bundle management UI
│   ├── api/
│   │   ├── components/      # Component API routes
│   │   └── bundles/         # Bundle API routes
│   ├── pricebook/           # Client-facing pricebook
│   ├── layout.tsx           # Root layout with navigation
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── lib/
│   └── prisma.ts            # Prisma client instance
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Sample data seeder
└── package.json
```

## Sample Data

The seed script creates:
- 6 service components (Bookkeeping, Tax Prep, Payroll, etc.)
- 4 service bundles with various discounts (10-15% savings)

Run `npm run db:seed` to populate with sample data.

## Customization

### Styling
- Edit `tailwind.config.ts` to customize colors and theme
- Modify `app/globals.css` for global styles
- Primary color can be changed in the Tailwind config

### Database
- SQLite is used for simplicity
- For production, update `prisma/schema.prisma` to use PostgreSQL or MySQL
- Run `npx prisma migrate dev` after schema changes

## License

MIT

## Support

For issues or questions, please open an issue in the repository.

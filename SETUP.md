# Setup Instructions

## Quick Start

Follow these steps to get the application running:

### 1. Install Dependencies

```bash
npm install
```

### 2. Initialize Database

Generate the Prisma client and create the database:

```bash
npx prisma generate
npx prisma db push
```

This will create a SQLite database file at `prisma/dev.db`.

### 3. Seed Sample Data

Populate the database with sample accounting services:

```bash
npm run db:seed
```

This creates:
- 6 sample service components (Bookkeeping, Tax Preparation, Payroll, etc.)
- 4 sample bundles with discounted pricing

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Application Pages

Once running, you can access:

- **Home**: `http://localhost:3000` - Overview and navigation
- **Pricebook**: `http://localhost:3000/pricebook` - Client-facing catalog
- **Manage Components**: `http://localhost:3000/admin/components` - Add/edit services
- **Manage Bundles**: `http://localhost:3000/admin/bundles` - Create bundles
- **Revenue Dashboard**: `http://localhost:3000/dashboard` - Housecall Pro revenue and average ticket

## Database Management

### View Database
```bash
npx prisma studio
```

This opens a GUI to browse and edit your data at `http://localhost:5555`

### Reset Database
```bash
npx prisma db push --force-reset
npm run db:seed
```

### Migrations (for production)
```bash
npx prisma migrate dev --name init
```

## Environment Variables

For production deployment, create a `.env` file:

```env
DATABASE_URL="file:./dev.db"
NODE_ENV="production"
HOUSECALL_PRO_API_KEY="your-housecall-pro-api-key"
HOUSECALL_PRO_BASE_URL="https://api.housecallpro.com"
HOUSECALL_PRO_JOBS_PATH="/jobs"
```

> Keep your Housecall API key in `.env` only. Never hardcode it in your source files.

## Troubleshooting

### Prisma Issues

If you encounter Prisma errors:

1. Delete `node_modules` and reinstall:
```bash
rm -rf node_modules
npm install
```

2. Regenerate Prisma client:
```bash
npx prisma generate
```

3. Reset database:
```bash
npx prisma db push --force-reset
```

### Port Already in Use

If port 3000 is busy:
```bash
npm run dev -- -p 3001
```

## Production Build

To create a production build:

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables
4. Deploy

Note: For production, consider migrating from SQLite to PostgreSQL:
- Update `prisma/schema.prisma` datasource to PostgreSQL
- Add `DATABASE_URL` to environment variables
- Run migrations: `npx prisma migrate deploy`

## Next Steps

After setup:

1. Customize the sample data or delete it
2. Add your own service components
3. Create custom bundles
4. Customize styling in `tailwind.config.ts`
5. Update branding and contact information

Enjoy your pricebook application!

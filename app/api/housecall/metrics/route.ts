import { NextRequest, NextResponse } from 'next/server'

type GenericRecord = Record<string, unknown>

const HOUSECALL_BASE_URL = process.env.HOUSECALL_PRO_BASE_URL || 'https://api.housecallpro.com'
const HOUSECALL_JOBS_PATH = process.env.HOUSECALL_PRO_JOBS_PATH || '/jobs'

function extractRecords(payload: unknown): GenericRecord[] {
  if (Array.isArray(payload)) {
    return payload.filter((item): item is GenericRecord => typeof item === 'object' && item !== null)
  }

  if (!payload || typeof payload !== 'object') {
    return []
  }

  const objectPayload = payload as GenericRecord
  const directArrayKeys = ['jobs', 'data', 'items', 'results']

  for (const key of directArrayKeys) {
    const value = objectPayload[key]
    if (Array.isArray(value)) {
      return value.filter((item): item is GenericRecord => typeof item === 'object' && item !== null)
    }
  }

  for (const value of Object.values(objectPayload)) {
    if (Array.isArray(value)) {
      return value.filter((item): item is GenericRecord => typeof item === 'object' && item !== null)
    }
  }

  return []
}

function getNumberFromUnknown(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const normalized = value.replace(/[$,]/g, '')
    const parsed = Number(normalized)
    return Number.isFinite(parsed) ? parsed : null
  }

  if (value && typeof value === 'object') {
    const nested = value as GenericRecord
    const cents = nested.cents
    if (typeof cents === 'number' && Number.isFinite(cents)) {
      return cents / 100
    }

    const amount = nested.amount
    if (typeof amount === 'number' && Number.isFinite(amount)) {
      return amount
    }
  }

  return null
}

function getRevenueFromJob(job: GenericRecord): number {
  const candidateFields = [
    'total_amount',
    'total',
    'job_total',
    'amount',
    'invoice_total',
    'invoiceAmount',
    'total_price',
  ]

  for (const field of candidateFields) {
    const parsed = getNumberFromUnknown(job[field])
    if (parsed !== null) {
      return parsed
    }
  }

  return 0
}

function getCompletionStatus(job: GenericRecord): string {
  const statusFields = ['status', 'work_status', 'job_status', 'state']

  for (const field of statusFields) {
    const value = job[field]
    if (typeof value === 'string') {
      return value.toLowerCase()
    }
  }

  return 'unknown'
}

function getJobDate(job: GenericRecord): Date | null {
  const dateFields = [
    'completed_at',
    'finished_at',
    'work_status_changed_at',
    'updated_at',
    'scheduled_start',
    'created_at',
    'start_time',
  ]

  for (const field of dateFields) {
    const raw = job[field]
    if (typeof raw !== 'string') {
      continue
    }

    const parsed = new Date(raw)
    if (!Number.isNaN(parsed.getTime())) {
      return parsed
    }
  }

  return null
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.HOUSECALL_PRO_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      {
        error: 'Missing HOUSECALL_PRO_API_KEY environment variable',
      },
      { status: 500 }
    )
  }

  const searchParams = request.nextUrl.searchParams
  const startDateParam = searchParams.get('startDate')
  const endDateParam = searchParams.get('endDate')

  const upstreamUrl = new URL(HOUSECALL_JOBS_PATH, HOUSECALL_BASE_URL)
  upstreamUrl.searchParams.set('per_page', '200')

  const upstreamResponse = await fetch(upstreamUrl.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  })

  if (!upstreamResponse.ok) {
    const errorBody = await upstreamResponse.text()

    return NextResponse.json(
      {
        error: 'Failed to fetch jobs from Housecall Pro',
        status: upstreamResponse.status,
        details: errorBody.slice(0, 500),
      },
      { status: 502 }
    )
  }

  const payload = await upstreamResponse.json()
  const records = extractRecords(payload)

  const startDate = startDateParam ? new Date(startDateParam) : null
  const endDate = endDateParam ? new Date(endDateParam) : null

  const completedStatuses = new Set(['completed', 'finished', 'closed', 'paid'])

  const filtered = records.filter((job) => {
    const date = getJobDate(job)

    if (startDate && date && date < startDate) {
      return false
    }

    if (endDate && date && date > endDate) {
      return false
    }

    return true
  })

  const completedJobs = filtered.filter((job) => completedStatuses.has(getCompletionStatus(job)))
  const revenue = completedJobs.reduce((sum, job) => sum + getRevenueFromJob(job), 0)
  const averageTicket = completedJobs.length > 0 ? revenue / completedJobs.length : 0

  return NextResponse.json({
    metrics: {
      revenue,
      averageTicket,
      totalJobs: filtered.length,
      completedJobs: completedJobs.length,
    },
    meta: {
      timeframe: {
        startDate: startDateParam,
        endDate: endDateParam,
      },
      sampledRecordCount: records.length,
    },
  })
}

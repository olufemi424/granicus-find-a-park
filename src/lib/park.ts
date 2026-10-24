export type ParkLocation = {
  lat: number
  lng: number
  address?: string
}

export type Park = {
  id: string
  name: string
  description: string | null
  location: ParkLocation
  amenities: Array<string>
  hours: string | null
  images: Array<string>
  acreage?: number
  rating: number | null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

function asNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

function asStringArray(value: unknown): Array<string> {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter((item): item is string => typeof item === 'string')
}

export function parsePark(value: unknown): Park | null {
  if (!isRecord(value)) {
    return null
  }

  const id = asString(value.id)
  const name = asString(value.name)

  if (!id || !name) {
    return null
  }

  if (!isRecord(value.location)) {
    return null
  }

  const lat = asNumber(value.location.lat)
  const lng = asNumber(value.location.lng)

  if (lat === undefined || lng === undefined) {
    return null
  }

  const description =
    value.description === null || value.description === undefined
      ? null
      : (asString(value.description) ?? null)

  const hours =
    value.hours === null || value.hours === undefined
      ? null
      : (asString(value.hours) ?? null)

  const rating =
    value.rating === null || value.rating === undefined
      ? null
      : (asNumber(value.rating) ?? null)

  return {
    id,
    name,
    description,
    location: {
      lat,
      lng,
      address: asString(value.location.address),
    },
    amenities: asStringArray(value.amenities),
    hours,
    images: asStringArray(value.images),
    acreage: asNumber(value.acreage),
    rating,
  }
}

export function parseParks(value: unknown): Array<Park> {
  if (!Array.isArray(value)) {
    return []
  }

  return value.flatMap((item) => {
    const park = parsePark(item)
    return park ? [park] : []
  })
}

export function formatAmenity(amenity: string): string {
  return amenity.replaceAll('-', ' ')
}

export function uniqueAmenities(parks: Array<Park>): Array<string> {
  return [...new Set(parks.flatMap((park) => park.amenities))].sort((a, b) =>
    a.localeCompare(b),
  )
}

export function filterParks(
  parks: Array<Park>,
  options: { query?: string; amenities?: Array<string> },
): Array<Park> {
  const query = options.query?.trim().toLowerCase()
  const amenities = options.amenities ?? []

  return parks.filter((park) => {
    if (
      amenities.length > 0 &&
      !amenities.every((amenity) => park.amenities.includes(amenity))
    ) {
      return false
    }

    if (!query) {
      return true
    }

    const haystack = [
      park.name,
      park.description ?? '',
      park.location.address ?? '',
      park.amenities.join(' '),
    ]
      .join(' ')
      .toLowerCase()

    return haystack.includes(query)
  })
}

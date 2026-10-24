export type ParksSearch = {
  park?: string
  q?: string
  amenity?: Array<string>
}

function asSearchString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

function asAmenityList(value: unknown): Array<string> | undefined {
  if (typeof value === 'string' && value.length > 0) {
    return [value]
  }

  if (Array.isArray(value)) {
    const amenities = value.filter(
      (item): item is string => typeof item === 'string' && item.length > 0,
    )
    return amenities.length > 0 ? amenities : undefined
  }

  return undefined
}

export function validateParksSearch(
  search: Record<string, unknown>,
): ParksSearch {
  return {
    park: asSearchString(search.park),
    q: asSearchString(search.q),
    amenity: asAmenityList(search.amenity),
  }
}

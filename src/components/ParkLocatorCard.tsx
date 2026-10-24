import { formatAmenity } from '#/lib/park'
import type { Park } from '#/lib/park'

type ParkLocatorCardProps = {
  park: Park
}

export function ParkLocatorCard({ park }: ParkLocatorCardProps) {
  const previewAmenities = park.amenities.slice(0, 3)

  return (
    <div className="pointer-events-none absolute inset-x-3 bottom-3 z-[500] max-w-sm rounded-lg border border-stone-200 bg-white/95 p-3 shadow-md backdrop-blur-sm">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-white"
        >
          <ParkGlyph />
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold text-stone-900">{park.name}</p>
          <p className="mt-0.5 truncate text-sm text-stone-600">
            {park.location.address ?? park.hours ?? 'Park location'}
          </p>
          {previewAmenities.length > 0 ? (
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {previewAmenities.map((amenity) => (
                <li
                  key={amenity}
                  className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs capitalize text-emerald-950"
                >
                  {formatAmenity(amenity)}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function ParkGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M12 3c-2.8 0-5 2.1-5 4.7 0 1.2.4 2.2 1.1 3H7l5 8 5-8h-1.1c.7-.8 1.1-1.8 1.1-3C17 5.1 14.8 3 12 3zm-1 16h2v2h-2z" />
    </svg>
  )
}

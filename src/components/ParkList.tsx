import { Link } from '@tanstack/react-router'
import { Panel, PanelTitle } from '#/components/Panel'
import { ParkFilters } from '#/components/ParkFilters'
import type { Park } from '#/lib/park'

type ParkListProps = {
  parks: Array<Park>
  totalCount: number
  selectedId?: string
  query: string
  selectedAmenities: Array<string>
  availableAmenities: Array<string>
  onQueryChange: (query: string) => void
  onToggleAmenity: (amenity: string) => void
  onClearFilters: () => void
  onShowMap?: () => void
  onParkChosen?: () => void
}

export function ParkList({
  parks,
  totalCount,
  selectedId,
  query,
  selectedAmenities,
  availableAmenities,
  onQueryChange,
  onToggleAmenity,
  onClearFilters,
  onShowMap,
  onParkChosen,
}: ParkListProps) {
  return (
    <Panel className="flex h-full min-h-0 flex-col overflow-hidden p-0 max-md:rounded-b-none max-md:rounded-t-3xl max-md:border-x-0 max-md:border-b-0">
      <nav
        id="park-list"
        aria-label="Park list"
        className="flex min-h-0 flex-1 flex-col"
      >
        <ParkFilters
          query={query}
          selectedAmenities={selectedAmenities}
          availableAmenities={availableAmenities}
          onQueryChange={onQueryChange}
          onToggleAmenity={onToggleAmenity}
          onClear={onClearFilters}
        />
        <div className="flex shrink-0 items-end justify-between gap-3 px-4 py-3">
          <div>
            <PanelTitle>Parks</PanelTitle>
            <p className="mt-1 text-sm text-stone-600">
              {parks.length === totalCount
                ? `${totalCount} parks`
                : `${parks.length} of ${totalCount} parks`}
            </p>
          </div>
          {onShowMap ? (
            <button
              type="button"
              onClick={onShowMap}
              className="rounded-full bg-emerald-800 px-4 py-2 text-sm font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 md:hidden"
            >
              Map
            </button>
          ) : null}
        </div>
        {parks.length === 0 ? (
          <p className="px-4 pb-4 text-sm text-stone-600">
            No parks match this search.
          </p>
        ) : (
          <ul className="min-h-0 flex-1 overflow-y-auto border-t border-stone-200">
            {parks.map((park) => {
              const selected = park.id === selectedId

              return (
                <li key={park.id} className="border-b border-stone-200">
                  <Link
                    to="/"
                    search={(prev) => ({ ...prev, park: park.id })}
                    onClick={onParkChosen}
                    aria-current={selected ? 'true' : undefined}
                    className={`block min-h-[4.25rem] px-4 py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 ${
                      selected
                        ? 'bg-emerald-800 text-white focus-visible:outline-white'
                        : 'text-stone-900 hover:bg-stone-50 focus-visible:outline-emerald-800'
                    }`}
                  >
                    <span className="block font-medium leading-snug">
                      {park.name}
                    </span>
                    <span
                      className={`mt-1 block truncate text-sm leading-snug ${
                        selected ? 'text-emerald-100' : 'text-stone-500'
                      }`}
                    >
                      {park.location.address ?? 'Address not listed'}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </nav>
    </Panel>
  )
}

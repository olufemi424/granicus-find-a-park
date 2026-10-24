import { formatAmenity } from '#/lib/park'

type ParkFiltersProps = {
  query: string
  selectedAmenities: Array<string>
  availableAmenities: Array<string>
  onQueryChange: (query: string) => void
  onToggleAmenity: (amenity: string) => void
  onClear: () => void
  showSearch?: boolean
}

export function ParkFilters({
  query,
  selectedAmenities,
  availableAmenities,
  onQueryChange,
  onToggleAmenity,
  onClear,
  showSearch = true,
}: ParkFiltersProps) {
  const hasFilters = query.length > 0 || selectedAmenities.length > 0

  return (
    <div className="shrink-0 space-y-3 border-b border-stone-200 px-4 pb-3 pt-3 md:pt-4">
      {showSearch ? (
        <div className="hidden md:block">
          <div className="flex items-center justify-between gap-2">
            <label
              htmlFor="park-search"
              className="text-sm font-medium text-stone-700"
            >
              Search
            </label>
            {hasFilters ? (
              <button
                type="button"
                onClick={onClear}
                className="text-sm text-emerald-800 underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
              >
                Clear
              </button>
            ) : null}
          </div>
          <input
            id="park-search"
            type="search"
            value={query}
            onChange={(event) => {
              onQueryChange(event.target.value)
            }}
            placeholder="Name, area, or amenity"
            autoComplete="off"
            className="mt-2 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 placeholder:text-stone-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
          />
        </div>
      ) : null}
      <fieldset className="min-w-0 overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <legend className="text-sm font-medium text-stone-700">
            Filters
          </legend>
          {hasFilters ? (
            <button
              type="button"
              onClick={onClear}
              className="text-sm text-emerald-800 underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 md:hidden"
            >
              Clear
            </button>
          ) : null}
        </div>
        <div className="-mx-4 mt-2 flex min-w-0 gap-1.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:px-0">
          {availableAmenities.map((amenity) => {
            const selected = selectedAmenities.includes(amenity)

            return (
              <button
                key={amenity}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  onToggleAmenity(amenity)
                }}
                className={`shrink-0 rounded-full px-3 py-2 text-xs capitalize focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 md:py-1 ${
                  selected
                    ? 'bg-emerald-800 text-white'
                    : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                }`}
              >
                {formatAmenity(amenity)}
              </button>
            )
          })}
        </div>
      </fieldset>
    </div>
  )
}

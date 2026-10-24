import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { ParkDetails } from '#/components/ParkDetails'
import { ParkList } from '#/components/ParkList'
import { ParkMap } from '#/components/ParkMap'
import { ParkSearchBar } from '#/components/ParkSearchBar'
import { getParks } from '#/functions/parks.functions'
import { filterParks, uniqueAmenities } from '#/lib/park'
import { validateParksSearch } from '#/lib/parkSearch'

export const Route = createFileRoute('/')({
  validateSearch: validateParksSearch,
  loader: async () => {
    const parks = await getParks()
    return { parks }
  },
  component: ParksPage,
  errorComponent: ParksError,
})

function ParksPage() {
  const { parks } = Route.useLoaderData()
  const { park: selectedId, q, amenity } = Route.useSearch()
  const navigate = Route.useNavigate()
  const selectedAmenities = amenity ?? []
  const visibleParks = filterParks(parks, {
    query: q,
    amenities: selectedAmenities,
  })
  const selected = parks.find((park) => park.id === selectedId)
  const unknownSelection = Boolean(selectedId) && !selected
  const [mobilePane, setMobilePane] = useState<'map' | 'directory'>('map')
  const showMobileDetails =
    mobilePane === 'map' && (Boolean(selected) || unknownSelection)

  function selectPark(parkId: string) {
    setMobilePane('map')
    void navigate({
      to: '/',
      search: (prev) => ({ ...prev, park: parkId }),
    })
  }

  function updateQuery(query: string) {
    if (query.trim()) {
      setMobilePane('directory')
    }

    void navigate({
      to: '/',
      search: (prev) => ({ ...prev, q: query.trim() ? query : undefined }),
    })
  }

  function toggleAmenity(nextAmenity: string) {
    void navigate({
      to: '/',
      search: (prev) => {
        const current = prev.amenity ?? []
        const next = current.includes(nextAmenity)
          ? current.filter((item) => item !== nextAmenity)
          : [...current, nextAmenity]

        return {
          ...prev,
          amenity: next.length > 0 ? next : undefined,
        }
      },
    })
  }

  function clearFilters() {
    void navigate({
      to: '/',
      search: (prev) => ({ park: prev.park }),
    })
  }

  function clearPark() {
    void navigate({
      to: '/',
      search: (prev) => ({ ...prev, park: undefined }),
    })
  }

  return (
    <div className="relative h-dvh overflow-hidden">
      <div className="absolute inset-0 z-0">
        <ParkMap
          parks={visibleParks}
          selectedId={selectedId}
          onSelect={selectPark}
        />
      </div>

      <div className="absolute inset-x-3 top-[max(0.75rem,env(safe-area-inset-top))] z-10 md:hidden">
        <ParkSearchBar query={q ?? ''} onQueryChange={updateQuery} />
      </div>

      <header className="pointer-events-none absolute inset-x-0 top-4 z-10 hidden justify-center px-4 md:flex md:justify-start md:pl-[22rem]">
        <div className="pointer-events-auto rounded-full border border-stone-200/80 bg-white/95 px-4 py-2 shadow-lg ring-1 ring-black/5 backdrop-blur-sm">
          <h1 className="text-sm font-semibold tracking-tight text-stone-900 sm:text-base">
            Find a Park
          </h1>
        </div>
      </header>

      <aside
        className={`absolute z-10 overflow-hidden md:inset-y-4 md:left-4 md:w-80 ${
          mobilePane === 'directory'
            ? 'inset-x-0 top-[max(4.5rem,env(safe-area-inset-top))] bottom-0 pb-[env(safe-area-inset-bottom)]'
            : 'hidden md:block'
        }`}
      >
        <ParkList
          parks={visibleParks}
          totalCount={parks.length}
          selectedId={selectedId}
          query={q ?? ''}
          selectedAmenities={selectedAmenities}
          availableAmenities={uniqueAmenities(parks)}
          onQueryChange={updateQuery}
          onToggleAmenity={toggleAmenity}
          onClearFilters={clearFilters}
          onShowMap={() => {
            setMobilePane('map')
          }}
          onParkChosen={() => {
            setMobilePane('map')
          }}
        />
      </aside>

      {mobilePane === 'map' ? (
        <button
          type="button"
          onClick={() => {
            setMobilePane('directory')
          }}
          className="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-10 -translate-x-1/2 rounded-full bg-emerald-800 px-5 py-3 text-sm font-semibold text-white shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:hidden"
        >
          Directory
        </button>
      ) : null}

      <div
        className={
          showMobileDetails
            ? 'absolute inset-x-3 bottom-20 z-10 md:inset-y-16 md:right-4 md:left-auto md:bottom-4 md:w-96 md:overflow-y-auto'
            : 'absolute inset-y-16 right-4 z-10 hidden w-96 overflow-y-auto md:block'
        }
      >
        <ParkDetails
          park={selected}
          unknownSelection={unknownSelection}
          onBack={clearPark}
        />
      </div>
    </div>
  )
}

function ParksError({ error }: ErrorComponentProps) {
  const message =
    error instanceof Error ? error.message : 'Something went wrong.'

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-semibold text-stone-900">
        Unable to load parks
      </h1>
      <p className="mt-3 text-stone-700">{message}</p>
    </main>
  )
}

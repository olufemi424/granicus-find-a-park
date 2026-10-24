import { useState } from 'react'
import type { ReactNode } from 'react'
import { Panel, PanelTitle } from '#/components/Panel'
import { formatAmenity } from '#/lib/park'
import type { Park } from '#/lib/park'

type ParkDetailsProps = {
  park?: Park
  unknownSelection: boolean
  onBack?: () => void
}

export function ParkDetails({
  park,
  unknownSelection,
  onBack,
}: ParkDetailsProps) {
  return (
    <Panel className="flex min-h-0 flex-col max-md:h-auto">
      <section
        id="park-details"
        tabIndex={-1}
        aria-labelledby="park-details-heading"
        aria-live="polite"
        className="flex min-h-0 flex-1 flex-col outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
      >
        <div className="flex items-center justify-between gap-3">
          <PanelTitle id="park-details-heading">Park details</PanelTitle>
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="rounded-full px-3 py-2 text-sm font-medium text-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 md:hidden"
            >
              Close
            </button>
          ) : null}
        </div>
        {unknownSelection ? (
          <p className="mt-4 text-stone-600">That park was not found.</p>
        ) : park ? (
          <ParkArticle park={park} />
        ) : (
          <p className="mt-4 text-stone-600">
            Select a park from the list or map to see details.
          </p>
        )}
      </section>
    </Panel>
  )
}

function ParkArticle({ park }: { park: Park }) {
  return (
    <article className="mt-4" aria-labelledby="park-name">
      <h3
        id="park-name"
        className="text-2xl font-semibold leading-tight text-stone-900"
      >
        {park.name}
      </h3>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        <Detail label="Address">
          {park.location.address ?? 'Address not available'}
        </Detail>
        <Detail label="Hours">{park.hours ?? 'Hours not available'}</Detail>
        <Detail label="Size">
          {park.acreage === undefined
            ? 'Size not available'
            : `${park.acreage} acres`}
        </Detail>
        <Detail label="Rating">
          {park.rating === null ? 'Rating not available' : `${park.rating} / 5`}
        </Detail>
        <Detail label="Description" wide>
          <span className="max-md:hidden">
            {park.description ?? 'No description provided'}
          </span>
          <span className="md:hidden">
            {park.description
              ? `${park.description.slice(0, 110)}${park.description.length > 110 ? '…' : ''}`
              : 'No description provided'}
          </span>
        </Detail>
        <Detail label="Amenities" wide>
          {park.amenities.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {park.amenities.map((amenity) => (
                <li
                  key={amenity}
                  className="rounded-full bg-emerald-50 px-3 py-1 text-sm capitalize text-emerald-950"
                >
                  {formatAmenity(amenity)}
                </li>
              ))}
            </ul>
          ) : (
            'No amenities listed'
          )}
        </Detail>
        <div className="hidden sm:col-span-2 sm:block">
          <Detail label="Photos" wide>
            <ParkPhotos
              key={park.id}
              urls={park.images}
              parkName={park.name}
            />
          </Detail>
        </div>
      </dl>
    </article>
  )
}

function Detail({
  label,
  children,
  wide = false,
}: {
  label: string
  children: ReactNode
  wide?: boolean
}) {
  return (
    <div className={wide ? 'sm:col-span-2' : undefined}>
      <dt className="text-sm font-medium text-stone-500">{label}</dt>
      <dd className="mt-1 text-stone-900">{children}</dd>
    </div>
  )
}

function ParkPhotos({
  urls,
  parkName,
}: {
  urls: Array<string>
  parkName: string
}) {
  const [loaded, setLoaded] = useState<Record<string, boolean>>({})
  const [failed, setFailed] = useState<Record<string, boolean>>({})
  const ready = urls.filter((url) => loaded[url] && !failed[url])

  if (urls.length === 0) {
    return <p className="text-stone-600">No photos available</p>
  }

  return (
    <div>
      {urls.map((url) => (
        <img
          key={url}
          src={url}
          alt=""
          aria-hidden="true"
          className="hidden"
          onLoad={() =>
            setLoaded((current) => ({ ...current, [url]: true }))
          }
          onError={() =>
            setFailed((current) => ({ ...current, [url]: true }))
          }
        />
      ))}
      {ready.length > 0 ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {ready.map((url, index) => (
            <li key={url} className="h-40">
              <img
                src={url}
                alt={`${parkName} photo ${index + 1}`}
                className="h-40 w-full rounded-md object-cover"
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-stone-600">No photos available</p>
      )}
    </div>
  )
}

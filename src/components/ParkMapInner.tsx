import { useEffect, useRef } from 'react'
import { latLngBounds } from 'leaflet'
import {
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  ZoomControl,
  useMap,
} from 'react-leaflet'
import { parkLocatorIcon } from '#/lib/parkPin'
import type { Park } from '#/lib/park'

type ParkMapInnerProps = {
  parks: Array<Park>
  selectedId?: string
  onSelect: (parkId: string) => void
}

function InvalidateSize() {
  const map = useMap()

  useEffect(() => {
    const resize = () => {
      map.invalidateSize()
    }
    const id = window.setTimeout(resize, 0)
    window.addEventListener('resize', resize)

    return () => {
      window.clearTimeout(id)
      window.removeEventListener('resize', resize)
    }
  }, [map])

  return null
}

function FitVisibleParks({ parks }: { parks: Array<Park> }) {
  const map = useMap()
  const parkKey = parks.map((park) => park.id).join(',')

  useEffect(() => {
    if (parks.length === 0) {
      return
    }

    const bounds = latLngBounds(
      parks.map((park) => [park.location.lat, park.location.lng]),
    )
    const wide = window.innerWidth >= 768
    map.fitBounds(bounds, {
      paddingTopLeft: wide ? [352, 88] : [16, 88],
      paddingBottomRight: wide
        ? [400, 24]
        : [16, Math.round(window.innerHeight * 0.48)],
      maxZoom: 13,
    })
  }, [map, parkKey, parks])

  return null
}

function FlyToSelected({ park }: { park?: Park }) {
  const map = useMap()
  const previousId = useRef<string | undefined>(undefined)

  useEffect(() => {
    if (!park) {
      previousId.current = undefined
      return
    }

    const isFirst = previousId.current === undefined
    const unchanged = previousId.current === park.id
    previousId.current = park.id

    if (isFirst || unchanged) {
      return
    }

    map.flyTo(
      [park.location.lat, park.location.lng],
      Math.max(map.getZoom(), 13),
      { duration: 0.35 },
    )
  }, [map, park])

  return null
}

export function ParkMapInner({
  parks,
  selectedId,
  onSelect,
}: ParkMapInnerProps) {
  const selected = parks.find((park) => park.id === selectedId)
  const fallbackCenter: [number, number] = parks[0]
    ? [parks[0].location.lat, parks[0].location.lng]
    : [40.73, -73.99]

  return (
    <MapContainer
      center={fallbackCenter}
      zoom={11}
      className="h-full w-full"
      scrollWheelZoom
      attributionControl
      zoomControl={false}
    >
      <ZoomControl position="topright" />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <InvalidateSize />
      <FitVisibleParks parks={parks} />
      <FlyToSelected park={selected} />
      {parks.map((park) => {
        const isSelected = park.id === selectedId

        return (
          <Marker
            key={park.id}
            position={[park.location.lat, park.location.lng]}
            icon={parkLocatorIcon(isSelected)}
            zIndexOffset={isSelected ? 1000 : 0}
            eventHandlers={{
              click: () => {
                onSelect(park.id)
              },
            }}
            title={park.name}
          >
            <Tooltip direction="top" offset={[0, isSelected ? -44 : -36]}>
              {park.name}
            </Tooltip>
          </Marker>
        )
      })}
    </MapContainer>
  )
}

import { useEffect, useState } from 'react'
import type { ComponentType } from 'react'
import type { Park } from '#/lib/park'

type ParkMapProps = {
  parks: Array<Park>
  selectedId?: string
  onSelect: (parkId: string) => void
}

export function ParkMap(props: ParkMapProps) {
  const [Inner, setInner] = useState<ComponentType<ParkMapProps> | null>(null)

  useEffect(() => {
    let cancelled = false

    void import('./ParkMapInner').then((mod) => {
      if (!cancelled) {
        setInner(() => mod.ParkMapInner)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section aria-label="Park map" className="h-full w-full bg-stone-200">
      {Inner ? (
        <Inner {...props} />
      ) : (
        <p className="flex h-full items-center justify-center text-sm text-stone-600">
          Loading map…
        </p>
      )}
    </section>
  )
}

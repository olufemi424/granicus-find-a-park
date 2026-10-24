import { divIcon } from 'leaflet'

function pinSvg(fill: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 48" width="36" height="48" aria-hidden="true">
  <path fill="${fill}" stroke="#fff" stroke-width="2" d="M18 2.5c8.3 0 15 6.6 15 14.7 0 11.2-15 28.3-15 28.3S3 28.4 3 17.2C3 9.1 9.7 2.5 18 2.5z"/>
  <path fill="#fff" d="M18 10c-2.3 0-4.1 1.7-4.1 3.8 0 .9.3 1.7.9 2.3H13l5 7.4 5-7.4h-1.8c.6-.6.9-1.4.9-2.3C22.1 11.7 20.3 10 18 10z"/>
</svg>`
}

export function parkLocatorIcon(selected: boolean) {
  return divIcon({
    className: selected ? 'park-locator park-locator-selected' : 'park-locator',
    iconSize: selected ? [36, 48] : [28, 38],
    iconAnchor: selected ? [18, 46] : [14, 36],
    popupAnchor: [0, -40],
    html: pinSvg(selected ? '#b45309' : '#065f46'),
  })
}

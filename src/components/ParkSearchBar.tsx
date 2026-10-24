type ParkSearchBarProps = {
  query: string
  onQueryChange: (query: string) => void
}

export function ParkSearchBar({ query, onQueryChange }: ParkSearchBarProps) {
  return (
    <form
      role="search"
      className="flex items-center gap-3 rounded-full border border-stone-200/80 bg-white/95 px-4 py-2.5 shadow-lg ring-1 ring-black/5 backdrop-blur-sm"
      onSubmit={(event) => {
        event.preventDefault()
      }}
    >
      <h1 className="shrink-0 text-sm font-semibold text-stone-900">
        Find a Park
      </h1>
      <input
        id="park-search-mobile"
        type="search"
        value={query}
        onChange={(event) => {
          onQueryChange(event.target.value)
        }}
        placeholder="Search parks"
        autoComplete="off"
        enterKeyHint="search"
        className="min-h-11 min-w-0 flex-1 bg-transparent text-base text-stone-900 placeholder:text-stone-400 focus-visible:outline-none"
      />
    </form>
  )
}

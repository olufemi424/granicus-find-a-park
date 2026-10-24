import { createServerFn } from '@tanstack/react-start'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { parseParks } from '#/lib/park'
import type { Park } from '#/lib/park'

export const getParks = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Array<Park>> => {
    const file = join(process.cwd(), 'src/data/parks.sample.json')
    const raw = await readFile(file, 'utf8')
    return parseParks(JSON.parse(raw) as unknown)
  },
)

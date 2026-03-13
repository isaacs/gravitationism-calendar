import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const dir = dirname(dirname(fileURLToPath(import.meta.url)))
export const data = resolve(dir, 'data')
export const ics = resolve(dir, 'ics')

export const dataFile = (filename: string) => resolve(data, filename)

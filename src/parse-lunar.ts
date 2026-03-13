import { readFileSync } from 'fs'
import { dataFile } from './folders.ts'

const start = Date.parse('1949-12-22T04:23:00.000Z')

let year = 0
for (const line of readFileSync(dataFile('lunations.txt'), 'utf8')
  .trim()
  .split('\n')) {
  const my = line.substring(0, 5).trim()
  if (my) year = Number(my)
  if (!year) continue
  const dl = line.substring(5, '        Jan 16  10:52'.length).trim()
  if (!dl) continue
  const dateLine = year + ' ' + dl + ' UTC'
  const nm = Date.parse(dateLine)
  if (!nm) continue
  if (nm >= start && nm !== 0) {
    console.log(new Date(nm).toISOString())
  }
}

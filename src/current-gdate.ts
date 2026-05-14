import { GravitationismDate } from './gravitationism-date.ts'
console.log(new GravitationismDate(process.argv[2] ?? new Date()).toString())

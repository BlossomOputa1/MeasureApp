import Dexie, { type Table } from 'dexie'

export interface StudentMeasurement {
  id?: number
  sessionName: string
  studentName: string
  ageBracket: AgeBracket
  shoulder: number
  chest: number
  halfLength: number
  fullLength: number
  roundSleeve: number
  sleeveShort: number
  sleeveLong: number
  waist: number
  hip: number
  lap: number
  knickerLength: number
  createdAt: Date
}

export const AGE_BRACKETS = ['2-3', '3-4', '4-5', '5-6', '7-8', '9-10', '11-13', '15', '16-19', 'Other'] as const
export type AgeBracket = typeof AGE_BRACKETS[number]

export class MeasureDB extends Dexie {
  students!: Table<StudentMeasurement>

  constructor() {
    super('MummyMeasureDB')
    this.version(1).stores({ students: '++id, sessionName, chst, wst, createdAt' })
    this.version(2).stores({ students: '++id, sessionName, ageBracket, chest, createdAt' }).upgrade(async (transaction) => {
      await transaction.table('students').toCollection().modify((student) => {
        student.ageBracket ??= 'Other'
        student.shoulder ??= student.shld ?? 0
        student.chest ??= student.chst ?? 0
        student.halfLength ??= student.len ?? 0
        student.fullLength ??= student.len ?? 0
        student.roundSleeve ??= 0
        student.sleeveShort ??= 0
        student.sleeveLong ??= 0
        student.waist ??= student.wst ?? 0
        student.hip ??= 0
        student.lap ??= 0
        student.knickerLength ??= 0
        delete student.shld
        delete student.chst
        delete student.wst
        delete student.len
      })
    })
    this.on('populate', async () => {
      await this.students.bulkAdd([
        { sessionName: 'De-Grace International - P4 Term 1', studentName: 'Samuel B.', ageBracket: '7-8', shoulder: 13, chest: 26, halfLength: 16, fullLength: 22, roundSleeve: 10, sleeveShort: 7, sleeveLong: 20, waist: 24, hip: 27, lap: 15, knickerLength: 18, createdAt: new Date() },
        { sessionName: 'De-Grace International - P4 Term 1', studentName: 'Chidinma A.', ageBracket: '7-8', shoulder: 13.5, chest: 26.5, halfLength: 17, fullLength: 23, roundSleeve: 10.5, sleeveShort: 7, sleeveLong: 20.5, waist: 24, hip: 28, lap: 15.5, knickerLength: 18.5, createdAt: new Date() },
        { sessionName: 'De-Grace International - P4 Term 1', studentName: 'Tunde O.', ageBracket: '9-10', shoulder: 14, chest: 28, halfLength: 18, fullLength: 25, roundSleeve: 11, sleeveShort: 8, sleeveLong: 22, waist: 26, hip: 30, lap: 16, knickerLength: 20, createdAt: new Date() },
        { sessionName: 'De-Grace International - P4 Term 1', studentName: 'Amina Y.', ageBracket: '5-6', shoulder: 12.5, chest: 25, halfLength: 15, fullLength: 21, roundSleeve: 9.5, sleeveShort: 6.5, sleeveLong: 18.5, waist: 23, hip: 26, lap: 14.5, knickerLength: 17, createdAt: new Date() },
        { sessionName: 'De-Grace International - P4 Term 1', studentName: 'Blessing E.', ageBracket: '9-10', shoulder: 13, chest: 27, halfLength: 17.5, fullLength: 22.5, roundSleeve: 10.5, sleeveShort: 7.5, sleeveLong: 21, waist: 25, hip: 29, lap: 15.5, knickerLength: 19, createdAt: new Date() },
      ])
    })
  }
}

export const db = new MeasureDB()
import type { StudentMeasurement } from '../db/db'

export type MeasurementKey = Exclude<keyof StudentMeasurement, 'id' | 'sessionName' | 'studentName' | 'ageBracket' | 'createdAt'>

export const MEASUREMENT_FIELDS: Array<{ key: MeasurementKey; label: string; shortLabel: string }> = [
  { key: 'shoulder', label: 'Shoulder', shortLabel: 'SHLD' },
  { key: 'chest', label: 'Chest', shortLabel: 'CHST' },
  { key: 'halfLength', label: 'Half length', shortLabel: 'HALF' },
  { key: 'fullLength', label: 'Full length', shortLabel: 'FULL' },
  { key: 'roundSleeve', label: 'Round sleeve', shortLabel: 'R.SLV' },
  { key: 'sleeveShort', label: 'Sleeve length (Short)', shortLabel: 'S.SHRT' },
  { key: 'sleeveLong', label: 'Sleeve length (Long)', shortLabel: 'S.LONG' },
  { key: 'waist', label: 'Waist', shortLabel: 'WAIST' },
  { key: 'hip', label: 'Hip', shortLabel: 'HIP' },
  { key: 'lap', label: 'Lap (Thigh)', shortLabel: 'LAP' },
  { key: 'knickerLength', label: 'Knicker length', shortLabel: 'KNICK' },
]

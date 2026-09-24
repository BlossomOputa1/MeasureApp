import * as XLSX from 'xlsx'
import { AGE_BRACKETS, type StudentMeasurement } from '../db/db'
import { MEASUREMENT_FIELDS } from './measurementFields'

const exportHeaders = ['Student Name', 'Age Bracket', ...MEASUREMENT_FIELDS.map((field) => field.label)]

export function sortByAgeBracket(students: StudentMeasurement[]) {
  return [...students].sort((a, b) => AGE_BRACKETS.indexOf(a.ageBracket) - AGE_BRACKETS.indexOf(b.ageBracket) || a.studentName.localeCompare(b.studentName))
}

export function downloadMeasurementsWorkbook(students: StudentMeasurement[]) {
  const workbook = XLSX.utils.book_new()
  for (const ageBracket of AGE_BRACKETS) {
    const rows = sortByAgeBracket(students.filter((student) => student.ageBracket === ageBracket)).map((student) => [
      student.studentName,
      student.ageBracket,
      ...MEASUREMENT_FIELDS.map((field) => student[field.key]),
    ])
    const sheet = XLSX.utils.aoa_to_sheet([exportHeaders, ...rows])
    sheet['!cols'] = exportHeaders.map((header) => ({ wch: Math.max(header.length + 2, 13) }))
    XLSX.utils.book_append_sheet(workbook, sheet, ageBracket)
  }
  XLSX.writeFile(workbook, 'mummys-measurements.xlsx')
}

export function measurementSummary(students: StudentMeasurement[]) {
  return sortByAgeBracket(students).map((student, index) => {
    const values = MEASUREMENT_FIELDS.map((field) => `${field.shortLabel} ${student[field.key]}`).join(' | ')
    return `${index + 1}. ${student.studentName} [${student.ageBracket}] | ${values}`
  }).join('\n')
}

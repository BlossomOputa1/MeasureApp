import { useState } from 'react'
import { ChevronDown, ChevronRight, Pencil, Trash2 } from 'lucide-react'
import { AGE_BRACKETS, type StudentMeasurement } from '../db/db'
import { MEASUREMENT_FIELDS } from '../lib/measurementFields'

function formatInches(value: number) { return `${value % 1 ? value.toFixed(1) : value.toFixed(0)}”` }

type Props = {
  students: StudentMeasurement[]
  grouped: boolean
  onEdit: (student: StudentMeasurement) => void
  onDelete: (student: StudentMeasurement) => void
}

export function RegisterTable({ students, grouped, onEdit, onDelete }: Props) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const groups = AGE_BRACKETS.map((ageBracket) => ({ ageBracket, students: students.filter((student) => student.ageBracket === ageBracket) })).filter((group) => group.students.length)
  const header = <tr><th>#</th><th>Student Name</th><th>Age</th>{MEASUREMENT_FIELDS.map((field) => <th key={field.key}>{field.shortLabel}</th>)}<th>ACT</th></tr>
  const row = (student: StudentMeasurement, index: number) => <tr key={student.id}><td className="row-number">{index + 1}</td><td className="student-name">{student.studentName}</td><td className="age-cell">{student.ageBracket}</td>{MEASUREMENT_FIELDS.map((field) => <td key={field.key}>{formatInches(student[field.key])}</td>)}<td className="actions-cell"><button className="table-action" type="button" onClick={() => onEdit(student)} aria-label={`Edit ${student.studentName}`}><Pencil size={13} /> EDIT</button><button className="delete-action" type="button" onClick={() => onDelete(student)} aria-label={`Delete ${student.studentName}`}><Trash2 size={14} /></button></td></tr>

  return <div className="table-wrap"><table><thead>{header}</thead>{grouped ? groups.map((group) => <tbody key={group.ageBracket}><tr className="group-row"><td colSpan={MEASUREMENT_FIELDS.length + 4}><button type="button" onClick={() => setCollapsed((current) => ({ ...current, [group.ageBracket]: !current[group.ageBracket] }))}><span className="group-chevron">{collapsed[group.ageBracket] ? <ChevronRight size={15} /> : <ChevronDown size={15} />}</span><strong>AGE {group.ageBracket}</strong><span>{group.students.length} {group.students.length === 1 ? 'student' : 'students'}</span></button></td></tr>{!collapsed[group.ageBracket] && group.students.map(row)}</tbody>) : <tbody>{students.map(row)}</tbody>}</table>{students.length === 0 && <div className="empty-register">No measurements yet. Start with the rapid entry terminal above.</div>}</div>
}

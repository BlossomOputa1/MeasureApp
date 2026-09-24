import { useEffect, useRef, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { ArrowUpDown, FileDown, FileSpreadsheet, HardDrive, SlidersHorizontal } from 'lucide-react'
import { AGE_BRACKETS, db, type StudentMeasurement } from './db/db'
import { downloadMeasurementsWorkbook, measurementSummary, sortByAgeBracket } from './lib/exportMeasurements'
import { MEASUREMENT_FIELDS } from './lib/measurementFields'
import { ExportSheet } from './components/ExportSheet'
import { RapidEntryTerminal, type EntryFormState } from './components/RapidEntryTerminal'
import { RegisterTable } from './components/RegisterTable'
import './App.css'

const sessionName = 'De-Grace International - P4 Term 1'
const emptyForm = (): EntryFormState => ({ studentName: '', ageBracket: 'Other', ...Object.fromEntries(MEASUREMENT_FIELDS.map((field) => [field.key, ''])) } as EntryFormState)

function App() {
  const students = useLiveQuery(() => db.students.toArray(), []) ?? []
  const [form, setForm] = useState<EntryFormState>(emptyForm)
  const [grouped, setGrouped] = useState(false)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | undefined>()
  const nameInput = useRef<HTMLInputElement>(null)
  const displayStudents = grouped ? sortByAgeBracket(students) : students

  useEffect(() => { nameInput.current?.focus() }, [])

  const updateField = (field: keyof EntryFormState, value: string) => setForm((current) => ({ ...current, [field]: value }))

  const resetEntry = () => {
    setForm(emptyForm())
    setEditingId(undefined)
    nameInput.current?.focus()
  }

  const submitMeasurement = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.studentName.trim() || MEASUREMENT_FIELDS.some((field) => form[field.key] === '')) return
    const measurement: Omit<StudentMeasurement, 'id'> = {
      sessionName,
      studentName: form.studentName.trim(),
      ageBracket: form.ageBracket,
      ...Object.fromEntries(MEASUREMENT_FIELDS.map((field) => [field.key, Number(form[field.key])])),
      createdAt: new Date(),
    } as Omit<StudentMeasurement, 'id'>
    if (editingId) await db.students.update(editingId, measurement)
    else await db.students.add(measurement)
    resetEntry()
  }

  const editStudent = (student: StudentMeasurement) => {
    setEditingId(student.id)
    setForm({ studentName: student.studentName, ageBracket: student.ageBracket, ...Object.fromEntries(MEASUREMENT_FIELDS.map((field) => [field.key, String(student[field.key])])) } as EntryFormState)
    nameInput.current?.focus()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const deleteStudent = async (student: StudentMeasurement) => {
    if (window.confirm(`Delete ${student.studentName}'s measurement?`)) await db.students.delete(student.id!)
  }

  const exportExcel = () => {
    downloadMeasurementsWorkbook(students)
    setIsExportOpen(false)
  }

  const shareSummary = async () => {
    const text = `${sessionName}\n\n${measurementSummary(students)}`
    if (navigator.share) await navigator.share({ title: sessionName, text })
    else if (navigator.clipboard) await navigator.clipboard.writeText(text)
    setIsExportOpen(false)
  }

  return <main className="app-shell">
    <header className="topbar"><div className="brand-lockup"><div className="brand-mark"><FileSpreadsheet size={22} /></div><div><p className="eyebrow">MEASURE STATION</p><h1>Mummy's Measure</h1></div></div><div className="offline-status"><span className="status-dot" /> Offline ready <HardDrive size={15} /></div></header>
    <section className="session-card"><div className="session-heading"><div className="document-icon"><FileSpreadsheet size={19} /></div><div><h2>De-Grace International</h2><p>Primary 4 Uniforms <span>•</span> Term 1</p></div><span className="record-pill">{students.length} Recorded</span></div><div className="session-actions"><button className="button button-primary" onClick={() => setIsExportOpen(true)}><FileDown size={16} /> Save / Export (.xlsx)</button><button className={`button button-secondary ${grouped ? 'is-active' : ''}`} onClick={() => setGrouped((value) => !value)}><SlidersHorizontal size={16} /> {grouped ? 'Group by Age' : 'Default List'} <ArrowUpDown size={14} /></button></div></section>
    <RapidEntryTerminal form={form} nameInput={nameInput} editingId={editingId} onChange={updateField} onSubmit={submitMeasurement} onCancelEdit={resetEntry} />
    <section className="register-section"><div className="section-heading"><div><p className="eyebrow">LIVE REGISTER</p><h2>Active Register</h2></div><div className="register-meta"><span>{grouped ? 'GROUPED BY AGE' : 'DEFAULT LIST'}</span><strong>{students.length} {students.length === 1 ? 'record' : 'records'}</strong></div></div><RegisterTable students={displayStudents} grouped={grouped} onEdit={editStudent} onDelete={deleteStudent} /></section>
    <footer className="app-footer"><span>LOCAL STORAGE ACTIVE</span><span>•</span><span>{AGE_BRACKETS.length} AGE BRACKETS</span><span>•</span><span>READY FOR CUTTING</span></footer>
    {isExportOpen && <ExportSheet onClose={() => setIsExportOpen(false)} onExcel={exportExcel} onPrint={() => window.print()} onShare={shareSummary} />}
  </main>
}

export default App

import type { FormEvent, RefObject } from 'react'
import { Check, Plus } from 'lucide-react'
import { AGE_BRACKETS } from '../db/db'
import { MEASUREMENT_FIELDS, type MeasurementKey } from '../lib/measurementFields'

export type EntryFormState = { studentName: string; ageBracket: typeof AGE_BRACKETS[number] } & Record<MeasurementKey, string>

type Props = {
  form: EntryFormState
  nameInput: RefObject<HTMLInputElement | null>
  editingId?: number
  onChange: (field: keyof EntryFormState, value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancelEdit: () => void
}

export function RapidEntryTerminal({ form, nameInput, editingId, onChange, onSubmit, onCancelEdit }: Props) {
  return <form className="entry-terminal" onSubmit={onSubmit}>
    <div className="terminal-heading"><div><h2><span className="pulse-dot">●</span> Rapid Entry Terminal</h2><p>{editingId ? 'Editing saved measurement' : 'Record a new student measurement'}</p></div><span className="unit-label">UNIT: INCHES (&quot;)</span></div>
    <div className="entry-fields">
      <label className="field name-field">NAME<input ref={nameInput} value={form.studentName} onChange={(event) => onChange('studentName', event.target.value)} placeholder="e.g. Tunde O." autoComplete="off" /></label>
      <label className="field age-field">AGE BRACKET<select value={form.ageBracket} onChange={(event) => onChange('ageBracket', event.target.value)}>{AGE_BRACKETS.map((age) => <option key={age}>{age}</option>)}</select></label>
      {MEASUREMENT_FIELDS.map((field) => <label className="field" key={field.key}>{field.shortLabel}<input type="number" step="0.5" min="0" value={form[field.key]} onChange={(event) => onChange(field.key, event.target.value)} placeholder={'0.0"'} /></label>)}
      <button className="add-button" type="submit" aria-label={editingId ? 'Save changes' : 'Add measurement'}>{editingId ? <Check size={21} /> : <Plus size={22} />}</button>
      {editingId && <button className="cancel-edit" type="button" onClick={onCancelEdit}>CANCEL</button>}
    </div>
  </form>
}

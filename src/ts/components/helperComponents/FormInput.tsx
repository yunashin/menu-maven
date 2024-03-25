import { ReactElement } from "react"

export const FormInput = ({ label, disabled, onChange, value }:
  { label: ReactElement, disabled?: boolean; onChange: (e: { target: { value: string } }) => void, value: string }
) => {
  return (
    <div style={{ marginTop: '20px' }}>
      <div>
        <div><b>{label}</b></div>
      </div>
      <input disabled={disabled} onChange={(e: { target: { value: string } }) => onChange(e)} value={value} />
    </div>
  );
}
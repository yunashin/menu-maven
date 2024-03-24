import { ReactElement } from "react"

export const FormInput = ({ label, onChange, value }:
  { label: ReactElement, onChange: (e: { target: { value: string } }) => void, value: string }
) => {
  return (
    <div style={{ marginTop: '20px' }}>
      <div>
        <div><b>{label}</b></div>
      </div>
      <input onChange={(e: { target: { value: string } }) => onChange(e)} value={value} />
    </div>
  );
}
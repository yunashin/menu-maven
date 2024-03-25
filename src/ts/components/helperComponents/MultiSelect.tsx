import Multiselect from "multiselect-react-dropdown"
import { MultiselectOption } from "../../types/Types"

export const MultiSelect = ({ label, onChange, options, selectedValues, selectionLimit }:
  { label: string; onChange: (selectedList: MultiselectOption[]) => void; options: MultiselectOption[], selectedValues: MultiselectOption[], selectionLimit?: number }
) => {
  return (
    <div style={{ marginTop: '20px' }}>
      <div><b>{label}</b></div>
      <div style={{ justifyContent: 'center', display: 'flex' }}>
        <Multiselect
          displayValue="name"
          hidePlaceholder={true}
          options={options}
          selectedValues={selectedValues}
          selectionLimit={selectionLimit}
          onSelect={onChange}
          onRemove={onChange}
          style={{
            multiselectContainer: {
              width: '300px'
            },
            optionContainer: {
              background: '#bfa9a9'
            },
            chips: {
              background: 'teal'
            }
          }}
        />
      </div>
    </div>
  );
}
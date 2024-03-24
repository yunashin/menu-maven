import { useState } from "react";

import { MultiselectOption, Restaurant } from "../../types/Types";
import { formatSlashList, getCuisineOptionsFromData, getLocationOptionsFromData, getOptionNames } from "../../utils/optionUtils";
import { MultiSelect } from "../helperComponents/MultiSelect";
import { dayOptions } from "../../constants/RecommendationConstants";

export const RecommendationsPage = ({ fetchedData }: { fetchedData: Restaurant[] }) => {
  const [selectedCuisines, setSelectedCuisines] = useState<MultiselectOption[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<MultiselectOption[]>([]);

  const onCuisineChange = (selectedList: MultiselectOption[]) => setSelectedCuisines(selectedList);
  const onLocationChange = (selectedList: MultiselectOption[]) => setSelectedLocations(selectedList);

  const results = fetchedData.filter((restaurant: Restaurant) =>
    restaurant.cuisines.some((cuisine: string) =>
      getOptionNames(selectedCuisines).includes(cuisine)
    ) &&
    getOptionNames(selectedLocations).includes(restaurant.city));

  return (
    <>
      <MultiSelect
        label="Cuisines"
        options={getCuisineOptionsFromData(fetchedData)}
        onChange={onCuisineChange}
        selectedValues={selectedCuisines} />
      <MultiSelect
        label="Locations"
        options={getLocationOptionsFromData(fetchedData)}
        onChange={onLocationChange}
        selectedValues={selectedLocations} />
      {results.length ? <div style={{ marginTop: '60px' }}>
        <h4>Results</h4>
        {results.map((result: Restaurant) =>
          <div key={result.name}>
            <p>
              <span style={{ fontWeight: 'bold' }}>
                <a className={result.website === "" ? 'disabled' : ''} href={result.website}>{result.name}</a>
              </span>
              <span style={{ fontSize: '10pt' }}>
                <span style={{ fontWeight: 'bold', display: 'block' }}>{result.city}</span>
                <span>{formatSlashList(result.cuisines)}</span>
              </span>
              {result.closed.length ? <span style={{ fontSize: '10pt', display: 'block' }}>
                <span style={{ fontWeight: 'bold' }}>Days closed: </span>
                {formatSlashList(result.closed.map((day: string) => `${day[0].toUpperCase()}${day.slice(1, day.length)}`))}
              </span> : null}
              {dayOptions.map((dayOption: MultiselectOption) => {
                if (result.specials[dayOption.value!] && result.specials[dayOption.value!] !== '') {
                  return <span key={`${result.name}-${dayOption.value}`} style={{ fontSize: '10pt', display: 'block' }}>
                    <b>{`${dayOption.name}: `}</b>
                    {result.specials[dayOption.value!]}
                  </span>
                }
                return null;
              })}
            </p>
          </div>)}
      </div> : null}
    </>
  );
}
import { doc, deleteDoc } from 'firebase/firestore';

import { useState } from 'react';

import { dayOptions } from "../../constants/RecommendationConstants";
import { MultiselectOption, Restaurant } from "../../types/Types";
import { formatSlashList } from "../../utils/optionUtils";
import { db } from '../../services/firebase.config';
import { FormInput } from '../helperComponents/FormInput';

export const RestaurantsData = ({ fetchedData, hasFetched, setEditing }: { fetchedData: Restaurant[], hasFetched: boolean; setEditing: (restaurant: Restaurant) => void }) => {
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const onDeleteClick = async (id: string) => {
    try {
      if (window.confirm("Are you sure you want to delete this restaurant?")) {
        const documentRef = doc(db, "restaurants", id);
        await deleteDoc(documentRef);
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  }

  const formattedData = fetchedData
    .filter((restaurant: Restaurant) => restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a: Restaurant, b: Restaurant) => a.name.localeCompare(b.name));

  return (
    <div>
      <FormInput label={<>Search</>} onChange={(e: { target: { value: string } }) => setSearchTerm(e.target.value)} value={searchTerm} />
      {formattedData
        .slice(0, pageSize).map((restaurant: Restaurant, index: number) => {
          return (
            <div key={restaurant.name} style={{ marginTop: '40px' }}>
              <a className={restaurant.website === "" ? 'disabled' : ''} href={restaurant.website} style={{ fontSize: '18pt', fontWeight: 'bold' }}>
                {`${restaurant.name} (${restaurant.city})`}
              </a>
              <div>
                {formatSlashList(restaurant.cuisines)}
              </div>
              {restaurant.canBeDelivered ? <div>
                <span>Can be delivered</span>
              </div> : null}
              {restaurant.closed.length ? <div>
                <span style={{ fontWeight: 'bold' }}>Days closed: </span>
                {formatSlashList(restaurant.closed.map((day: string) => `${day[0].toUpperCase()}${day.slice(1, day.length)}`))}
              </div> : null}
              {dayOptions.map((dayOption: MultiselectOption) => {
                if (restaurant.specials[dayOption.value!] && restaurant.specials[dayOption.value!] !== '') {
                  return <div key={`${restaurant.name}-${dayOption.value}`}>
                    <b>{`${dayOption.name}: `}</b>
                    {restaurant.specials[dayOption.value!]}
                  </div>
                }
                return null;
              })}
              <button style={{ marginBottom: '10px', marginRight: '10px' }} onClick={() => setEditing(restaurant)}>Edit</button>
              {hasFetched ? <button style={{ marginBottom: '10px' }} onClick={() => onDeleteClick(restaurant.id)}>Delete</button> : null}
              {index !== formattedData.length - 1 ? <hr style={{ borderColor: 'gray', marginTop: '25px', width: '300px' }} /> : null}
            </div>
          )
        })}
      {pageSize < formattedData.length - 1 && formattedData.length ? <button onClick={() => setPageSize(pageSize + 5)}>Load more</button> : null}
    </div>
  );
}
import { useMemo, useState } from "react";
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

import { FormInput } from "../helperComponents/FormInput";
import { MultiselectOption, Restaurant } from "../../types/Types";
import { areListsEqual, areSpecialsEqual, getCuisineOptionsFromData, getLocationOptionsFromData, getOptionNames, getOptionsFromNames } from "../../utils/optionUtils";
import { db } from "../../services/firebase.config";
import { MultiSelect } from "../helperComponents/MultiSelect";
import { dayOptions } from "../../constants/RecommendationConstants";

const stateHasChangedFromEditingRestaurant = (editingRestaurant: Restaurant | null, restaurantState: Restaurant) => {
  if (editingRestaurant) {
    if (editingRestaurant.name !== restaurantState.name) {
      // console.log('NAME NOT EQUAL');
      return true;
    }
    else if (editingRestaurant.baseRecommendationScore !== restaurantState.baseRecommendationScore) {
      // console.log('BASE RECOMMENDATION SCORE NOT EQUAL');
      return true;
    }
    else if (editingRestaurant.canBeDelivered !== restaurantState.canBeDelivered) {
      // console.log('CAN BE DELIEVERED NOT EQUAL');
      return true;
    }
    else if (editingRestaurant.city !== restaurantState.city) {
      // console.log('CITY NOT EQUAL');
      return true;
    }
    else if (!areListsEqual(editingRestaurant.closed, restaurantState.closed)) {
      // console.log('DAYS CLOSED NOT EQUAL');
      return true;
    }
    else if (!areListsEqual(editingRestaurant.cuisines, restaurantState.cuisines)) {
      // console.log('CUISINES NOT EQUAL');
      return true;
    }
    else if (editingRestaurant.website !== restaurantState.website) {
      // console.log('WEBSITES NOT EQUAL');
      return true;
    }
    else if (!areSpecialsEqual(editingRestaurant.specials, restaurantState.specials)) {
      // console.log('SPECIALS NOT EQUAL');
      return true;
    }
    return false;
  }
}

export const SubmissionPage = ({ editingRestaurant, fetchedData, hasFetched }:
  { editingRestaurant: Restaurant | null; fetchedData: Restaurant[], hasFetched: boolean }
) => {
  const cuisineOptions = getCuisineOptionsFromData(fetchedData);
  const cityOptions = getLocationOptionsFromData(fetchedData);
  const [error, setError] = useState('');
  const [restaurantName, setRestaurantName] = useState(editingRestaurant ? editingRestaurant.name : '');
  const [website, setWebsite] = useState(editingRestaurant ? editingRestaurant.website : '');
  const [additionalCuisines, setAdditionalCuisines] = useState('');
  const [cities, setCities] = useState<MultiselectOption[]>(editingRestaurant ? [{ name: editingRestaurant.city, id: 1 }] : []);
  const [cuisines, setCuisines] = useState<MultiselectOption[]>(editingRestaurant ? getOptionsFromNames(editingRestaurant.cuisines, cuisineOptions) : []);
  const [daysClosed, setDaysClosed] = useState<MultiselectOption[]>(editingRestaurant ? editingRestaurant.closed.map((day: string) => dayOptions.find((dayOption: MultiselectOption) => dayOption.value === day) || { name: '', id: 1 }) : []);
  const [canBeDelivered, setCanBeDelivered] = useState(editingRestaurant ? editingRestaurant.canBeDelivered : false);
  const [specials, setSpecials] = useState<{ [key: string]: string }>(editingRestaurant ? editingRestaurant.specials : {
    sunday: '',
    monday: '',
    tuesday: '',
    wednesday: '',
    thursday: '',
    friday: '',
    saturday: ''
  });
  const totalCuisines = useMemo(() => [
    ...getOptionNames(cuisines),
    ...additionalCuisines.split(',')
      .map((cuisine: string) => cuisine.trim())
      .filter((cuisine: string) => cuisine !== '')
  ], [additionalCuisines, cuisines]);
  const restauarantState = useMemo(() => ({
    name: restaurantName,
    baseRecommendationScore: editingRestaurant ? editingRestaurant.baseRecommendationScore : 1,
    canBeDelivered: canBeDelivered,
    city: cities.length ? cities[0].name : '',
    closed: daysClosed.map((day: MultiselectOption) => day.name),
    cuisines: totalCuisines,
    website,
    specials,
  }), [canBeDelivered, cities, daysClosed, editingRestaurant, restaurantName, specials, totalCuisines, website]);

  const hasEditingStateChanged = useMemo(() => {
    return stateHasChangedFromEditingRestaurant(editingRestaurant, restauarantState as Restaurant);
  }, [editingRestaurant, restauarantState]);

  const collectionRef = collection(db, 'restaurants');

  const onCitiesChange = (selectedList: MultiselectOption[]) => setCities(selectedList);
  const onCuisineChange = (selectedList: MultiselectOption[]) => setCuisines(selectedList);
  const onDaysClosedChange = (selectedList: MultiselectOption[]) => setDaysClosed(selectedList);
  const onSpecialsChange = (special: string, day: string) => setSpecials({ ...specials, [day]: special });

  const onClick = async () => {
    console.log({ restauarantState });
    if (editingRestaurant) {
      if (editingRestaurant.id && editingRestaurant.id !== '') {
        try {
          const document = doc(db, 'restaurants', editingRestaurant.id)
          await updateDoc(document, restauarantState);
          window.location.reload();
        } catch (error) {
          setError(`${error}`);
          console.log(error);
        }
      }
      return;
    } else {
      try {
        // RESET DB:
        // for (const restaurant of restaurantsData.restaurants) {
        //   if (restaurant.name !== 'Antique Bar & Bakery') {
        //     await addDoc(collectionRef, {
        //       name: restaurant.name,
        //       baseRecommendationScore: restaurant.baseRecommendationScore,
        //       canBeDelivered: restaurant.canBeDelivered,
        //       city: restaurant.city,
        //       closed: restaurant.closed,
        //       cuisines: restaurant.cuisines,
        //       website: restaurant.website,
        //       specials: restaurant.specials,
        //       timestamp: serverTimestamp()
        //     })
        //   }
        // }
        if (restaurantName !== '' && cuisines.length && cities.length) {
          await addDoc(collectionRef, {
            name: restaurantName,
            baseRecommendationScore: 1,
            canBeDelivered,
            city: cities[0].name,
            closed: daysClosed.map((day: MultiselectOption) => day.value),
            cuisines: totalCuisines,
            website,
            specials,
            timestamp: serverTimestamp()
          });
          window.location.reload();
        }
      } catch (error) {
        setError(`${error}`);
        console.log(error);
      }
    }
  }

  return <>
    <FormInput
      label={<>Restaurant Name*</>}
      onChange={(e: { target: { value: string } }) => setRestaurantName(e.target.value)}
      value={restaurantName} />
    <FormInput
      label={<>Website</>}
      onChange={(e: { target: { value: string } }) => setWebsite(e.target.value)}
      value={website} />
    <MultiSelect
      label="Days closed (if applicable)"
      options={dayOptions}
      onChange={onDaysClosedChange}
      selectedValues={daysClosed}
    />
    <MultiSelect
      label="City*"
      options={cityOptions}
      onChange={onCitiesChange}
      selectedValues={cities}
      selectionLimit={1}
    />
    <MultiSelect
      label="Cuisines*"
      options={cuisineOptions}
      onChange={onCuisineChange}
      selectedValues={cuisines}
    />
    <FormInput
      label={<><div>Additional Cuisines</div><div>(Optional, separate by commas)</div></>}
      onChange={(e: { target: { value: string } }) => setAdditionalCuisines(e.target.value)}
      value={additionalCuisines} />
    <div style={{ marginTop: '20px' }}><b>Specials (if any)</b></div>
    <div>i.e. happy hour from 4-6pm</div>
    {dayOptions.map((dayOption: MultiselectOption) =>
      <FormInput
        key={dayOption.value!}
        label={<>{dayOption.name}</>}
        onChange={(e: { target: { value: string } }) => onSpecialsChange(e.target.value, dayOption.value!)}
        value={specials[dayOption.value!] || ''}
      />
    )}
    <div style={{ marginTop: '20px' }}>
      <b>Can be delivered</b>
      <input type="checkbox" onChange={(e: { target: { checked: boolean } }) => setCanBeDelivered(e.target.checked)} checked={canBeDelivered} />
    </div>
    {!hasFetched ? <div>You can't {editingRestaurant ? 'edit' : 'add'} a restauarant because there was an issue connecting with the database.</div> : null}
    {error ? <div>Error detected: {error}</div> : null}
    <button
      style={{ marginTop: '20px' }}
      disabled={
        !hasFetched || (editingRestaurant ? !hasEditingStateChanged : false) || restaurantName === '' || !totalCuisines.length || !cities.length}
      onClick={onClick}>
      {editingRestaurant ? 'Edit restaurant' : 'Add restaurant'}
    </button>
  </>
}
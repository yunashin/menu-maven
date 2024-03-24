import { MultiselectOption, Restaurant } from "../types/Types";

export const getOptionNames = (options: MultiselectOption[]) => {
  return options.map((option: MultiselectOption) => option.name);
}

export const getOptionsFromNames = (names: string[], options: MultiselectOption[]) => {
  return names.map((name: string, index: number) => {
    const foundOption = options.find((option: MultiselectOption) => option.name === name);
    return ({
      name,
      id: foundOption ? foundOption.id : index + 1
    })
  });
}

export const formatSlashList = (list: string[]) => {
  let formattedSlashList = '';
  for (const entry of list) {
    const idx = list.indexOf(entry);
    if (idx < list.length - 1) {
      formattedSlashList = `${formattedSlashList}${entry} / `;
    } else {
      formattedSlashList = `${formattedSlashList}${entry}`;
    }
  }
  return formattedSlashList;
}

export const getCuisineOptionsFromData = (fetchedData: Restaurant[]) => {
  const cuisineNames: string[] = [];
  for (const restaurant of fetchedData) {
    for (const cuisine of restaurant.cuisines) {
      if (!cuisineNames.includes(cuisine)) {
        cuisineNames.push(cuisine);
      }
    }
  }
  return cuisineNames.map((cuisine: string) => ({ name: cuisine, id: cuisineNames.indexOf(cuisine) + 1 }));
}

export const getLocationOptionsFromData = (fetchedData: Restaurant[]) => {
  const locationNames: string[] = [];
  for (const restaurant of fetchedData) {
    if (!locationNames.includes(restaurant.city)) {
      locationNames.push(restaurant.city);
    }
  }
  return locationNames.map((location: string) => ({ name: location, id: locationNames.indexOf(location) + 1 }));
}

export const areListsEqual = (list1: (string | number)[], list2: (string | number)[]) => {
  if (list1.length !== list2.length) {
    return false;
  }
  for (let i = 0; i < list1.length - 1; i++) {
    if (list1[i] !== list2[i]) {
      return false;
    }
  }
  return true;
}

export const areSpecialsEqual = (obj1: { [key: string]: string }, obj2: { [key: string]: string }) => {
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
  }
  for (const key of Object.keys(obj1)) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }
  return true;
}

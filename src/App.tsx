import { useEffect, useRef, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore'

import './App.css'
import { RecommendationsPage } from './ts/components/pages/RecommendationsPage'
import { SubmissionPage } from './ts/components/pages/SubmissionPage';
import { RestaurantsData } from './ts/components/pages/RestaurantsData';
import { Restaurant } from './ts/types/Types';
import { db } from './ts/services/firebase.config';
import { restaurantsData } from './ts/constants/restaurantsData';

function App() {
  const [selectedPage, setSelectedPage] = useState('recommendations');
  const [fetchedData, setFetchedData] = useState<Restaurant[]>([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [editingRestuarant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const collectionRef = collection(db, 'restaurants');
  const fetchCount = useRef(0);
  const isTesting = false;

  useEffect(() => {
    const getTodo = async () => {
      await getDocs(collectionRef).then((todo) => {
        console.log('FETCHING DATA', fetchCount);
        const todoData = todo.docs.map((doc) => {
          return ({
            ...doc.data(), id: doc.id
          })
        });
        fetchCount.current = fetchCount.current + 1;
        setFetchedData((todoData as unknown) as Restaurant[]);
        setHasFetched(true);
      }).catch((err) => {
        setFetchedData(restaurantsData.restaurants as Restaurant[]);
        console.log(err);
      })
    }

    if (!fetchedData.length) {
      if (isTesting) {
        console.log('TESTING MODE');
        setFetchedData(restaurantsData.restaurants as Restaurant[]);
      } else {
        getTodo();
      }
    }
  }, [fetchedData, collectionRef, isTesting]);

  return (
    <>
      <h1>Menu Maven</h1>
      <button disabled={selectedPage === 'recommendations'} style={{ margin: '40px 10px' }} onClick={() => {
        setSelectedPage('recommendations');
        setEditingRestaurant(null);
      }}>
        Recommendations
      </button>
      <button disabled={selectedPage === 'submissions'} style={{ margin: '40px 10px' }} onClick={() => setSelectedPage('submissions')}>
        {editingRestuarant ? 'Edit restaurant' : 'Submit restaurants'}
      </button>
      <button disabled={selectedPage === 'data'} style={{ margin: '40px 10px' }} onClick={() => {
        setSelectedPage('data');
        setEditingRestaurant(null);
      }}>
        Restaurants Data
      </button>
      {selectedPage === 'recommendations' ? <RecommendationsPage fetchedData={fetchedData} /> : null}
      {selectedPage === 'submissions' ? <SubmissionPage editingRestaurant={editingRestuarant} fetchedData={fetchedData} hasFetched={hasFetched} /> : null}
      {selectedPage === 'data' ? <RestaurantsData fetchedData={fetchedData} hasFetched={hasFetched} setEditing={(restaurant: Restaurant) => {
        setEditingRestaurant(restaurant);
        setSelectedPage('submissions');
      }} /> : null}
    </>
  )
}

export default App

import axios from 'axios';
import { useEffect, useState } from 'react';
import RestaurantCard from '../components/RestaurantCard';

interface Restaurant {
  _id?: string;
  name?: string;
  cuisine?: string;
}

const Restaurants = (): JSX.Element => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('/api/restaurants');
        setRestaurants(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        setError('Failed to load restaurants.');
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) return <div>Loading restaurants...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h2>All Restaurants</h2>
      <div className="grid">
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant._id} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
};

export default Restaurants;

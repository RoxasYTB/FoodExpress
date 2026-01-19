import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

interface Restaurant {
  _id?: string;
  name?: string;
  address?: string;
  phone?: string;
  opening_hours?: string;
}

interface Menu {
  _id?: string;
  name?: string;
  description?: string;
  price?: number;
}

const RestaurantDetail = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const restoRes = await axios.get(`/api/restaurants/${id}`);
        setRestaurant(restoRes.data);

        const menusRes = await axios.get(`/api/menus?restaurant_id=${id}`);
        setMenus(menusRes.data);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching details:', err);
        setError('Failed to load restaurant details.');
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) return <div>Loading details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!restaurant) return <div>Restaurant not found.</div>;

  return (
    <div className="container">
      <Link to="/restaurants" className="btn-back">
        &larr; Back to List
      </Link>

      <div className="restaurant-header">
        <div className="restaurant-banner">
          <img
            src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop"
            alt="Restaurant Banner"
          />
        </div>
        <div className="restaurant-info">
          <h1>{restaurant.name}</h1>
          <div className="meta-tags">
            <span>$$</span>
            <span>•</span>
            <span>International</span>
            <span>•</span>
            <span>20-30 min</span>
          </div>
          <p
            className="card-meta"
            style={{ marginTop: '1rem', fontSize: '1rem' }}
          >
            {restaurant.address} • {restaurant.phone} • {restaurant.opening_hours}
          </p>
        </div>
      </div>

      <div className="menu-category">
        <h3>Menu</h3>
        {menus.length === 0 ? (
          <p>No menus available for this restaurant.</p>
        ) : (
          <div>
            {menus.map((menu) => (
              <div key={menu._id} className="menu-item">
                <div className="item-info">
                  <div className="item-name">{menu.name}</div>
                  <div className="item-desc">
                    {menu.description || 'A delicious meal crafted with the finest ingredients.'}
                  </div>
                  <div className="item-price">{menu.price} €</div>
                </div>
                <img
                  className="item-image"
                  src={`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&auto=format&fit=crop&random=${menu._id}`}
                  alt={menu.name}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetail;

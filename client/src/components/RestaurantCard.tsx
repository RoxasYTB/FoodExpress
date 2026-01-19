import React from 'react';
import { Link } from 'react-router-dom';

interface Restaurant {
  _id?: string;
  name?: string;
  cuisine?: string;
}

interface Props {
  restaurant: Restaurant;
}

const RestaurantCard: React.FC<Props> = ({ restaurant }) => {
  const fallbackImage = `https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop`;

  const images = [
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1529042410759-befb1204b468?q=80&w=800&auto=format&fit=crop',
  ];

  const key = (restaurant._id || restaurant.name || '').toString();
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % images.length;
  const displayImage = images[index] || fallbackImage;

  const rating = ((Math.abs(hash) % 20) / 4 + 3).toFixed(1);
  const displayRating = Math.min(5, Number(rating));
  const deliveryFee = (0.5 + (Math.abs(hash) % 300) / 100).toFixed(2);
  const etaMinutes = 15 + (Math.abs(hash) % 30);

  return (
    <Link to={`/restaurants/${restaurant._id}`} className="card">
      <div className="card-image-container">
        <img src={displayImage} alt={restaurant.name} className="card-image" />
        <div className="card-badge">
          {etaMinutes}-{etaMinutes + 10} min
        </div>
      </div>
      <div className="card-info">
        <div className="card-header">
          <h3 className="card-title">{restaurant.name}</h3>
          <div className="card-rating">{displayRating}</div>
        </div>
        <div className="card-subtitle">$$ • {restaurant.cuisine || 'International'}</div>
        <div className="card-meta">
          <span>{deliveryFee} € Delivery Fee</span>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;

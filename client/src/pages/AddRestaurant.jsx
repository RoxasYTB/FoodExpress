import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddRestaurant = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    opening_hours: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      setError('You must be logged in to add a restaurant.');
      return;
    }

    try {
      await axios.post('/api/restaurants', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Restaurant added successfully!');
      navigate('/restaurants');
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 403) {
        setError('Access denied: You must be an admin.');
      } else {
        setError('Failed to add restaurant. Please check your inputs.');
      }
    }
  };

  return (
    <div className="container">
      <div className="form-card">
        <h2>Add New Restaurant</h2>
        <p style={{ color: '#757575', marginBottom: '2rem' }}>
          Create a new partner restaurant.
        </p>
        {error && (
          <div
            className="error"
            style={{
              padding: '1rem',
              background: '#fee',
              color: '#d32f2f',
              marginBottom: '1rem',
              borderRadius: '8px',
            }}
          >
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Restaurant Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Burger King"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              placeholder="123 Main St"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              name="phone"
              placeholder="+33 6 12 34 56 78"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Opening Hours</label>
            <input
              type="text"
              name="opening_hours"
              placeholder="Mon-Sun: 9am - 10pm"
              value={formData.opening_hours}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn">
            Create Restaurant
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRestaurant;

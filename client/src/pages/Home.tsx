import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div>
      {/* New Hero Section */}
      <div className="new-hero">
        <div className="new-hero-bg"></div>
        <div className="new-hero-content">
          <h1>Order food to your door</h1>
          <div className="search-box-large">
            <svg
              className="location-icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <input type="text" placeholder="Enter delivery address" />
            <button>Find Food</button>
          </div>
          <p>
            <Link
              to="/login"
              style={{ color: 'inherit', textDecoration: 'underline' }}
            >
              Sign in
            </Link>{' '}
            for your recent addresses
          </p>
        </div>
      </div>

      <div
        className="container"
        style={{ paddingTop: '4rem', paddingBottom: '4rem' }}
      >
        <div className="categories-section">
          <div className="category-card">
            <img
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=300"
              alt="Burger"
            />
            <span>Burger</span>
          </div>
          <div className="category-card">
            <img
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=300"
              alt="Pizza"
            />
            <span>Pizza</span>
          </div>
          <div className="category-card">
            <img
              src="https://images.unsplash.com/photo-1509722747741-090ed30b7c8e?q=80&w=300"
              alt="Sushi"
            />
            <span>Sushi</span>
          </div>
          <div className="category-card">
            <img
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300"
              alt="Healthy"
            />
            <span>Healthy</span>
          </div>
          <div className="category-card">
            <img
              src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=300"
              alt="Asian"
            />
            <span>Asian</span>
          </div>
          <div className="category-card">
            <img
              src="https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=300"
              alt="Dessert"
            />
            <span>Dessert</span>
          </div>
        </div>

        <h2
          style={{
            fontSize: '2.25rem',
            margin: '3rem 0 1.5rem',
            fontWeight: '700',
          }}
        >
          Wait less. Eat more.
        </h2>
        <div className="grid">
          <Link to="/restaurants" className="feature-card">
            <div
              className="feature-img"
              style={{
                backgroundImage:
                  'url(https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=600)',
              }}
            ></div>
            <h3>Feed your employees</h3>
            <p>Create a business account</p>
          </Link>
          <Link to="/restaurants" className="feature-card">
            <div
              className="feature-img"
              style={{
                backgroundImage:
                  'url(https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=600)',
              }}
            ></div>
            <h3>Your restaurant, delivered</h3>
            <p>Add your restaurant</p>
          </Link>
          <Link to="/restaurants" className="feature-card">
            <div
              className="feature-img"
              style={{
                backgroundImage:
                  'url(https://images.unsplash.com/photo-1616010619946-953eb3c04229?q=80&w=600)',
              }}
            ></div>
            <h3>Deliver with FoodExpress</h3>
            <p>Sign up to deliver</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

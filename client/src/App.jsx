import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Account from './pages/Account';
import AddRestaurant from './pages/AddRestaurant';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RestaurantDetail from './pages/RestaurantDetail';
import Restaurants from './pages/Restaurants';

function App() {
  return (
    <div>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurants/:id" element={<RestaurantDetail />} />
          <Route path="/add-restaurant" element={<AddRestaurant />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

import axios from 'axios';
import { useEffect, useState } from 'react';

const mockOrders = [
  {
    id: 'ord1',
    date: '2026-01-10',
    total: 23.5,
    status: 'delivered',
    items: ['Pizza Margherita', 'Coke'],
  },
  {
    id: 'ord2',
    date: '2026-01-08',
    total: 12.99,
    status: 'completed',
    items: ['Salad'],
  },
  {
    id: 'ord3',
    date: '2025-12-28',
    total: 45.0,
    status: 'cancelled',
    items: ['Sushi Platter'],
  },
];

const Account = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setError('You must be logged in');
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setForm({
          username: res.data.username || '',
          email: res.data.email || '',
          password: '',
        });
      } catch (err) {
        console.error(err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [token]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      await axios.put(`/api/users/${user.id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Profile updated');
      const res = await axios.get('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setForm({
        username: res.data.username || '',
        email: res.data.email || '',
        password: '',
      });
    } catch (err) {
      console.error(err);
      setError('Failed to save profile');
    }
  };

  if (loading) return <div className="container">Loading profile...</div>;
  if (error) return <div className="container error">{error}</div>;

  return (
    <div className="container">
      <h2>My Account</h2>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div className="form-card">
            <h3>Profile</h3>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Username</label>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>New password (leave blank to keep)</label>
                <input
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  type="password"
                />
              </div>
              <button className="btn" type="submit">
                Save profile
              </button>
            </form>
          </div>
        </div>

        <div style={{ width: 360 }}>
          <div className="card" style={{ padding: '1rem' }}>
            <h3>Recent Orders</h3>
            {mockOrders.map((o) => (
              <div
                key={o.id}
                style={{ padding: '0.75rem 0', borderBottom: '1px solid #eee' }}
              >
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <div style={{ fontWeight: 700 }}>{o.date}</div>
                  <div style={{ fontWeight: 700 }}>{o.total} €</div>
                </div>
                <div style={{ color: '#757575', fontSize: '0.95rem' }}>
                  {o.items.join(', ')}
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                  Status: {o.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;

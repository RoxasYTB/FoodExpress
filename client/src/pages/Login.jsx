import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    try {
      const response = await axios.post('/api/users/login', formData);
      localStorage.setItem('token', response.data.token);
      alert('Login successful!');
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Invalid credentials');
    }
  };

  return (
    <div
      className="container"
      style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}
    >
      <div className="form-card">
        <h2>Welcome back</h2>
        <p style={{ color: '#757575', marginBottom: '1.5rem' }}>
          Sign in to access your account.
        </p>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn">
            Login
          </button>
        </form>

        <div
          style={{
            marginTop: '1rem',
            textAlign: 'center',
            fontSize: '0.95rem',
            color: '#757575',
          }}
        >
          Don't have an account?{' '}
          <a
            href="/register"
            style={{ color: 'var(--primary)', fontWeight: 600 }}
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;

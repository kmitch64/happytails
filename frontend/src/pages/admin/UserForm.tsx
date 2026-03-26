
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft, faUser } from '@fortawesome/free-solid-svg-icons';


export default function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserFormData>({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    role: 'PetOwner',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(!!id);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          setIsLoading(true);

          const response = await fetch(`/api/v1/users/${id}`);
          if (!response.ok)
            throw new Error('Failed to fetch user');

          const data = await response.json();
          setUser({ ...data, password: '', confirmPassword: '' });


        }
        catch (err) {
          setError('Failed to load user data');
          //   console.error(err);
        }
        finally {
          setIsLoading(false);
        }
      };

      fetchUser();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (user.password && user.password !== user.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      const userData = {
        ...user,
        password: id ? (user.password || undefined) : user.password
      };

      // In a real app, you would send this to your API
      const url = id ? `/api/v1/users/update/${id}` : '/api/v1/users';
      const method = id ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!response.ok) throw new Error('Failed to save user');

      navigate('/dashboard/admin/users');
    }
    catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save user');
      console.error(err);
    }
    finally {
      setIsSubmitting(false);
    };
  };

  if (isLoading) {
    return (
      <div className="loading-spinner">Loading...</div>
    );
  }

  return (
    <div className="user-form-container">
      <div className="form-header">
        <h2 className="form-title">
          <FontAwesomeIcon icon={faUser} className="form-icon" />
          {id ? 'Edit User' : 'Create New User'}
        </h2>
        <button
          onClick={() => navigate('/dashboard/admin/users')}
          className="back-button"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="button-icon" />
          Back to Users
        </button>
      </div>

      {error && (
        <div className="error-message">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="firstname" className="form-label">First Name*</label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={user.firstname}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastname" className="form-label">Last Name*</label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={user.lastname}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username*</label>
            <input
              type="text"
              id="username"
              name="username"
              value={user.username}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="role" className="form-label">Role*</label>
          <select
            id="role"
            name="role"
            value={user.role}
            onChange={handleChange}
            required
            className="form-input"
          >
            {['PetOwner', 'PetSitter', 'ShelterStaff', 'Admin'].map(role => (
              <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
            ))}
          </select>
        </div>

        {!id && (
          <>
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password*</label>
              <input
                type="password"
                id="password"
                name="password"
                value={user.password}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password*</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={user.confirmPassword}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          </>
        )}

        {id && (
          <div className="form-group">
            <label htmlFor="password" className="form-label">New Password (leave blank to keep current)</label>
            <input
              type="password"
              id="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/dashboard/admin/users')}
            className="cancel-button"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="save-button"
          >
            <FontAwesomeIcon icon={faSave} className="button-icon" />
            {isSubmitting ? 'Saving...' : 'Save User'}
          </button>
        </div>
      </form>
    </div>
  );
}
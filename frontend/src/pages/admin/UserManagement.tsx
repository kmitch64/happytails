
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserPlus, faEdit, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

import Loading from '../../components/loader/Loading';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/v1/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      setUsers(users.filter(user => user._id !== userId));
    }
    catch (err) {
      setError('Failed to delete user');
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/v1/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        };

        const data = await response.json();
        setUsers(data);
      }
      catch (err) {
        setError('Failed to load users');
        console.error(err);
      }
      finally {
        setIsLoading(false);
      };
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <Loading message="Loading users..." />;
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="user-management">
      <div className="user-management-header">
        <h2 className="user-management-title">User Management</h2>
        <Link to="/dashboard/admin/users/create" className="create-user-btn">
          <FontAwesomeIcon icon={faUserPlus} className="button-icon" />
          Create New User
        </Link>
      </div>

      <div className="user-search">
        <FontAwesomeIcon icon={faSearch} className="user-search-icon" />
        <input
          type="text"
          placeholder="Search users by name, email, or username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Pets</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="user-avatar">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                    <div className="username">{user.username}</div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className="role-badge">{user.role}</span>
                </td>
                <td>{user.pets.length} pets</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <Link to={`/dashboard/admin/users/${user._id}/edit`} className="action-button">
                      <FontAwesomeIcon icon={faEdit} />
                    </Link>
                    <button onClick={() => handleDelete(user._id)} className="action-button delete-button">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
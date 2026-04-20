import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Loading from '../../components/loader/Loading';

export default function AdoptionApplications() {
  const [applications, setApplications] = useState<AdoptionApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const handleDelete = async (applicationId: string) => {
    if (!window.confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/v1/adoption-applications/${applicationId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete application');
      }

      setApplications(applications.filter(application => application._id !== applicationId));
    }
    catch (err) {
      setError('Failed to delete application');
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/v1/adoptions/user', {
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('Failed to fetch applications');
        }
        const data = await response.json();
        setApplications(data);
      } 
      catch (err) {
        setError('Failed to fetch applications');
        console.error(err);
      } 
      finally {
        setIsLoading(false);
      };
    };
    fetchApplications();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="adoption-applications">
      <h1>Adoption Applications</h1>
      {error && <div className="error-message">{error}</div>}
      <table>
        <thead>
          <tr>
            <th>Pet</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => (
            <tr key={application._id}>
              <td>{application.petName}</td>
              <td>{application.status}</td>
              <td>
                <Link to={`/adoption-applications/${application._id}`}>
                  <FontAwesomeIcon icon={faEdit} />
                </Link>
                <button onClick={() => handleDelete(application._id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface AdoptionApplication {
  _id: string;
  petName: string;
  status: string;
}
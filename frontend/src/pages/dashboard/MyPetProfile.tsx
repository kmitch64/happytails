
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVenusMars, faBirthdayCake, faRuler, faBolt, faBriefcaseMedical,
  faPaw, faHeart, faArrowLeft, faEdit, faTrash, faCalendarAlt,
  faPlus, faVial, faNotesMedical, faClock, faUserFriends
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../components/auth/AuthContext';
import PetCarousel from '../../components/PetCarousel/PetCarousel';

// Define TypeScript interface for Pet


export default function MyPetProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pet, setPet] = useState<MyPet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'care' | 'medical'>('profile');

  // mocked
  useEffect(() => {
    const fetchPetData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/v1/pets/${id}`);
        const data = await response.json();
        setPet(data);


      }
      catch (err) {
        setError('Failed to load pet profile');
        console.error(err);
      }
      finally {
        setIsLoading(false);
      };
    };

    fetchPetData();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${pet?.name}'s profile?`)) {
      try {
        await fetch(`/api/v1/pets/${id}`, { method: 'DELETE' });
        navigate('/dashboard/my-pets');
      }
      catch (err) {
        setError('Failed to delete pet profile');
        console.error(err);
      };
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard-page">
        <div className="page-header">
          <Link to="/dashboard/my-pets" className="back-button">
            <FontAwesomeIcon icon={faArrowLeft} /> Back to My Pets
          </Link>
          <h1>Loading Pet Profile...</h1>
        </div>
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="page-header">
          <Link to="/dashboard/my-pets" className="back-button">
            <FontAwesomeIcon icon={faArrowLeft} /> Back to My Pets
          </Link>
          <h1>Error Loading Profile</h1>
        </div>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="dashboard-page">
        <div className="page-header">
          <Link to="/dashboard/my-pets" className="back-button">
            <FontAwesomeIcon icon={faArrowLeft} /> Back to My Pets
          </Link>
          <h1>Pet Not Found</h1>
        </div>
        <div className="not-found-message">The requested pet profile was not found.</div>
      </div>
    );
  }

  const infoCards = [
    { label: "Sex", value: pet.sex, icon: faVenusMars },
    { label: "Age", value: pet.age, icon: faBirthdayCake },
    { label: "Size", value: pet.size, icon: faRuler },
    { label: "Energy Level", value: pet.energyLevel, icon: faBolt },
    { label: "Spayed/Neutered", value: pet.spayedNeutered, icon: faBriefcaseMedical },
    { label: "Breed", value: pet.breed, icon: faPaw },
  ];

  return (
    <div className="dashboard-page my-pet-profile">
      <div className="page-header">
        <Link to="/dashboard/my-pets" className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} /> Back to My Pets
        </Link>
        <div className="header-actions">
          <h1>{pet.name}'s Profile</h1>
          <div className="action-buttons">
            <button className="edit-button" onClick={() => navigate(`/dashboard/my-pets/edit/${pet._id}`)}>
              <FontAwesomeIcon icon={faEdit} /> Edit Profile
            </button>
            <button className="delete-button" onClick={handleDelete}>
              <FontAwesomeIcon icon={faTrash} /> Delete Profile
            </button>
          </div>
        </div>
      </div>

      <div className="page-content">
        {/* Tab Navigation */}
        <div className="profile-tabs">
          <button
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <FontAwesomeIcon icon={faPaw} /> Profile
          </button>
          <button
            className={`tab-button ${activeTab === 'care' ? 'active' : ''}`}
            onClick={() => setActiveTab('care')}
          >
            <FontAwesomeIcon icon={faCalendarAlt} /> Care Reminders
          </button>
          <button
            className={`tab-button ${activeTab === 'medical' ? 'active' : ''}`}
            onClick={() => setActiveTab('medical')}
          >
            <FontAwesomeIcon icon={faNotesMedical} /> Medical Records
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'profile' && (
            <>
              {/* Carousel Section */}
              <section className="pet-carousel-section">
                <PetCarousel
                  petId={pet._id}
                  images={pet.images || []}
                  petName={pet.name}
                />
              </section>

              {/* Pet Details Section */}
              <section className="pet-details-section">
                <div className="details-grid">
                  {/* Left Column - Bio and Info */}
                  <div className="pet-bio">
                    <div className="pet-header">
                      <div className="pet-meta">
                        <span className="pet-type-tag">
                          <FontAwesomeIcon icon={faPaw} /> {pet.breed}
                        </span>
                        <span className="pet-status">
                          {pet.status}
                        </span>
                      </div>

                      <div className="pet-basic-info">
                        <p><FontAwesomeIcon icon={faBirthdayCake} /> {pet.age}</p>
                        <p><FontAwesomeIcon icon={faRuler} /> {pet.size}</p>
                        <p><FontAwesomeIcon icon={faUserFriends} /> {pet.compatibility?.join(', ')}</p>
                      </div>
                    </div>

                    <div className="pet-bio-content">
                      <h3>About {pet.name}</h3>
                      <p>{pet.bio}</p>

                      <div className="pet-attributes">
                        <h4>Personality & Care Needs</h4>
                        <div className="attributes-grid">
                          <div className="attribute">
                            <FontAwesomeIcon icon={faBolt} />
                            <span>Energy: {pet.energyLevel}</span>
                          </div>
                          <div className="attribute">
                            <FontAwesomeIcon icon={faVenusMars} />
                            <span>Sex: {pet.sex}</span>
                          </div>
                          <div className="attribute">
                            <FontAwesomeIcon icon={faBriefcaseMedical} />
                            <span>Neutered: {pet.spayedNeutered}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Info Cards */}
                  <div className="pet-info-cards">
                    <h3>Pet Details</h3>
                    <div className="info-cards-grid">
                      {infoCards.map((card, index) => (
                        <div key={index} className="info-card">
                          <div className="card-header">
                            <FontAwesomeIcon icon={card.icon} className="card-icon" />
                            <span className="card-label">{card.label}</span>
                          </div>
                          <div className="card-value">{card.value}</div>
                        </div>
                      ))}
                    </div>

                    <div className="created-info">
                      <p><FontAwesomeIcon icon={faClock} /> Profile created: {new Date(pet.createdAt).toLocaleDateString()}</p>
                      <p><FontAwesomeIcon icon={faClock} /> Last updated: {new Date(pet.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeTab === 'care' && (
            <section className="care-reminders">
              <h2>Care Reminders for {pet.name}</h2>

              {pet.careReminders.length > 0 ? (
                <>
                  <div className="reminders-list">
                    {pet.careReminders.map(reminder => (
                      <div key={reminder._id} className="reminder-card">
                        <div className="reminder-header">
                          <div className="reminder-type">
                            {reminder.type === 'vaccination' && <FontAwesomeIcon icon={faVial} />}
                            {reminder.type === 'medication' && <FontAwesomeIcon icon={faBriefcaseMedical} />}
                            {reminder.type === 'appointment' && <FontAwesomeIcon icon={faCalendarAlt} />}
                            {reminder.type === 'grooming' && <FontAwesomeIcon icon={faPaw} />}
                            <span>{reminder.type.charAt(0).toUpperCase() + reminder.type.slice(1)}</span>
                          </div>
                          <div className="reminder-status">
                            {reminder.completed ? (
                              <span className="completed">Completed</span>
                            ) : (
                              <span className="pending">Pending</span>
                            )}
                          </div>
                        </div>
                        <div className="reminder-body">
                          <p>{reminder.description}</p>
                          <p className="reminder-date">
                            Due: {new Date(reminder.date).toLocaleDateString()}
                            {reminder.frequency !== 'one-time' && (
                              <span> (Every {reminder.frequency})</span>
                            )}
                          </p>
                        </div>
                        <div className="reminder-actions">
                          {!reminder.completed && (
                            <button className="mark-complete">
                              Mark as Complete
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Link to={`/dashboard/my-pets/${pet._id}/add-reminder`}>

                  <button className="add-reminder-button">
                    <FontAwesomeIcon icon={faPlus} /> Add New Reminder
                  </button>
                  </Link>

                </>
              ) : (
                <div className="no-reminders">
                  <FontAwesomeIcon icon={faCalendarAlt} size="3x" color="#ccc" />
                  <p>No care reminders set up for {pet.name}</p>
                  <Link to={`/dashboard/my-pets/${pet._id}/add-reminder`}>

                    <button className="add-reminder-button">
                      <FontAwesomeIcon icon={faPlus} /> Add First Reminder
                    </button>
                  </Link>

                </div>
              )}
            </section>
          )}

          {activeTab === 'medical' && (
            <section className="medical-records">
              <h2>Medical Records for {pet.name}</h2>

              {pet.medicalRecords.length > 0 ? (
                <>
                  <div className="records-list">
                    {pet.medicalRecords.map(record => (
                      <div key={record._id} className="record-card">
                        <div className="record-header">
                          <div className="record-type">
                            {record.type === 'vaccination' && <FontAwesomeIcon icon={faVial} />}
                            {record.type === 'surgery' && <FontAwesomeIcon icon={faBriefcaseMedical} />}
                            {record.type === 'checkup' && <FontAwesomeIcon icon={faUserFriends} />}
                            {record.type === 'medication' && <FontAwesomeIcon icon={faPaw} />}
                            <span>{record.type.charAt(0).toUpperCase() + record.type.slice(1)}</span>
                          </div>
                          <div className="record-date">
                            {new Date(record.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="record-body">
                          <p>{record.description}</p>
                          {record.veterinarian && (
                            <p><strong>Veterinarian:</strong> {record.veterinarian}</p>
                          )}
                          {record.notes && (
                            <p><strong>Notes:</strong> {record.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link to={`/dashboard/my-pets/${pet._id}/add-medical-record`}>
                    <button className="add-record-button">
                      <FontAwesomeIcon icon={faPlus} /> Add Medical Record
                    </button>
                  </Link>
                </>
              ) : (
                <div className="no-records">
                  <FontAwesomeIcon icon={faNotesMedical} size="3x" color="#ccc" />
                  <p>No medical records for {pet.name}</p>
                  <Link to={`/dashboard/my-pets/${pet._id}/add-medical-record`}>

                    <button className="add-record-button">
                      <FontAwesomeIcon icon={faPlus} /> Add First Record
                    </button>
                  </Link>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

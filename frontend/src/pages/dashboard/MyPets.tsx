
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw, faDog, faCat, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../components/auth/AuthContext';


export default function MyPets() {
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // mocked
  useEffect(() => {
    const fetchPets = async () => {
      try {
        setIsLoading(true);
        // const response = await fetch(`/api/users/${user.id}/pets`);
        // const data = await response.json();
        // setPets(data);

        const mockPets: Pet[] = [
          {
            _id: "1",
            id: "PET-001",
            name: "Buddy",
            type: "Dog",
            breed: "Golden Retriever",
            age: "3 years",
            images: ["https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Buddy"],
            status: "Active"
          },
          {
            _id: "2",
            id: "PET-002",
            name: "Whiskers",
            type: "Cat",
            breed: "Siamese",
            age: "2 years",
            images: ["https://via.placeholder.com/300x200/607D8B/FFFFFF?text=Whiskers"],
            status: "Active"
          }
        ];
        setPets(mockPets);
      } catch (err) {
        console.error("Failed to fetch pets:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPets();
  }, [user]);

  const filteredPets = pets.filter(pet =>
    pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-page my-pets-page">
      <div className="page-header">
        <h1><FontAwesomeIcon icon={faPaw} /> My Pets</h1>
        <p>Manage your pets' profiles and care information</p>
      </div>

      <div className="page-content">
        <div className="pets-header">
          <div className="search-container">
            <div className="search-input">
              <FontAwesomeIcon icon={faSearch} />
              <input
                type="text"
                placeholder="Search your pets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
          </div>
          <Link to="/dashboard/my-pets/add" className="add-pet-button">
              <FontAwesomeIcon icon={faPlus} /> Add New Pet
            </Link>
        </div>

        {isLoading ? (
          <div className="loading-spinner">Loading your pets...</div>
        ) : filteredPets.length > 0 ? (
          <div className="pets-grid">
            {filteredPets.map(pet => (
              <Link key={pet._id} to={`/dashboard/my-pets/${pet._id}`} className="pet-card-link">
                <div className="pet-card">
                  <div className="pet-image">
                    {pet.images.length > 0 ? (
                      <img src={pet.images[0]} alt={pet.name} />
                    ) : (
                      <div className="no-image">
                        <FontAwesomeIcon icon={pet.type?.toLowerCase() === 'dog' ? faDog : faCat} size="3x" color="#ccc" />
                      </div>
                    )}
                  </div>
                  <div className="pet-info">
                    <h3>{pet.name}</h3>
                    <p className="pet-breed">{pet.breed}</p>
                    <div className="pet-details">
                      <span className="pet-age">{pet.age}</span>
                      <span className="pet-type">
                        {pet.type?.toLowerCase() === 'dog' ? (
                          <FontAwesomeIcon icon={faDog} />
                        ) : (
                          <FontAwesomeIcon icon={faCat} />
                        )}
                        {pet.type}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="no-pets">
            <FontAwesomeIcon icon={faPaw} size="3x" color="#ccc" />
            <h3>You haven't added any pets yet</h3>
            <p>Add your first pet to start managing their care information</p>
            <Link to="/dashboard/my-pets/add" className="cta-button primary">
              <FontAwesomeIcon icon={faPlus} /> Add My First Pet
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

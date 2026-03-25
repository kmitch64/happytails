import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faDog, faCat, faHeart } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

// Mock data for adoptable pets
const mockPets = [
  { id: 1, name: "Max", type: "Dog", breed: "Labrador", size: "Large", age: "2 years", image: "https://via.placeholder.com/220/4CAF50/FFFFFF?text=Max" },
  { id: 2, name: "Luna", type: "Cat", breed: "Siamese", size: "Small", age: "1 year", image: "https://via.placeholder.com/220/607D8B/FFFFFF?text=Luna" },
  { id: 3, name: "Charlie", type: "Dog", breed: "Beagle", size: "Medium", age: "3 years", image: "https://via.placeholder.com/220/FF9800/FFFFFF?text=Charlie" },
  { id: 4, name: "Bella", type: "Cat", breed: "Persian", size: "Medium", age: "4 years", image: "https://via.placeholder.com/220/795548/FFFFFF?text=Bella" },
  { id: 5, name: "Rocky", type: "Dog", breed: "German Shepherd", size: "Large", age: "5 years", image: "https://via.placeholder.com/220/8BC34A/FFFFFF?text=Rocky" },
  { id: 6, name: "Lucy", type: "Cat", breed: "Maine Coon", size: "Large", age: "2 years", image: "https://via.placeholder.com/220/009688/FFFFFF?text=Lucy" }
];

export default function DashboardBrowse() {
  const [filters, setFilters] = useState({
    type: 'all',
    age: 'all',
    size: 'all'
  });

  const handleFilterChange = (filterType: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const filteredPets = mockPets.filter(pet => {
    if (filters.type !== 'all' && pet.type.toLowerCase() !== filters.type) return false;
    if (filters.age !== 'all') {
      const age = parseInt(pet.age);
      switch (filters.age) {
        case 'puppy':
          if (age >= 1) return false;
          break;
        case 'young':
          if (age < 1 || age > 3) return false;
          break;
        case 'adult':
          if (age < 4 || age > 7) return false;
          break;
        case 'senior':
          if (age < 8) return false;
          break;
      }
    }
    if (filters.size !== 'all') {
      const size = pet.size.toLowerCase();
      switch (filters.size) {
        case 'small':
          if (size !== 'small') return false;
          break;
        case 'medium':
          if (size !== 'medium') return false;
          break;
        case 'large':
          if (size !== 'large') return false;
          break;
      }
    }
    return true;
  });

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1><FontAwesomeIcon icon={faSearch} /> Browse Adoptable Pets</h1>
        <p>Search and filter pets available for adoption</p>
      </div>

      <div className="page-content browse-layout">
        {/* Filter Sidebar */}
        <aside className="filter-sidebar">
          <h3><FontAwesomeIcon icon={faFilter} /> Filters</h3>

          <div className="filter-group">
            <h4>Pet Type</h4>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="dog">Dogs</option>
              <option value="cat">Cats</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="filter-group">
            <h4>Age</h4>
            <select
              value={filters.age}
              onChange={(e) => handleFilterChange('age', e.target.value)}
              className="filter-select"
            >
              <option value="all">All Ages</option>
              <option value="puppy">Puppy/Kitten (&lt;1 year)</option>
              <option value="young">Young (1-3 years)</option>
              <option value="adult">Adult (4-7 years)</option>
              <option value="senior">Senior (8+ years)</option>
            </select>
          </div>

          <div className="filter-group">
            <h4>Size</h4>
            <select
              value={filters.size}
              onChange={(e) => handleFilterChange('size', e.target.value)}
              className="filter-select"
            >
              <option value="all">All Sizes</option>
              <option value="small">Small (&lt;20 lbs)</option>
              <option value="medium">Medium (20-50 lbs)</option>
              <option value="large">Large (50+ lbs)</option>
            </select>
          </div>
        </aside>

        {/* Pet Grid */}
        <div className="adopt-grid-container">
          <div className="adopt-grid">
            {filteredPets.map(pet => (
              <Link key={pet.id} to={`/dashboard/adopt/profile/${pet.id}`} className="card-link">
                <div className="adopt-card">
                  <div className="adopt-image">
                    <img src={pet.image} alt={pet.name} className="pet-image" />
                  </div>
                  <div className="pet-info">
                    <h3>{pet.name}</h3>
                    <p className="pet-breed">{pet.breed}</p>
                    <div className="pet-details">
                      <span className="pet-age">{pet.age}</span>
                      <span className="pet-type">
                        <FontAwesomeIcon icon={pet.type.toLowerCase() === 'dog' ? faDog : faCat} /> {pet.type}
                      </span>
                    </div>
                  </div>
                  <div className="pet-actions">
                    <button className="favorite-btn">
                      <FontAwesomeIcon icon={faHeart} />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* How to Adopt Section */}
      <section className="dashboard-section how-to-adopt">
        <h2>How to Adopt</h2>
        <p>Our adoption process is simple and designed to find the best homes for our pets:</p>
        <ol className="adoption-steps">
          <li>Browse our adoptable pets and find your perfect match</li>
          <li>View the pet's profile to learn more about them</li>
          <li>Submit an adoption application</li>
          <li>Our team will review your application and arrange a meet-and-greet</li>
          <li>Finalize the adoption and welcome your new family member!</li>
        </ol>
        <p>Have questions? <Link to="/dashboard/contact">Contact our adoption team</Link></p>
      </section>
    </div>
  );
};

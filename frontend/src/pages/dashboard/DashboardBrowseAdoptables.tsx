
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faDog, faCat, faHeart } from '@fortawesome/free-solid-svg-icons';

// import dog1 from "../../assets/dog1.jpg";
// import dog2 from "../../assets/dog2.jpg";
// import cat1 from "../../assets/cat1.jpg";
// import cat2 from "../../assets/cat2.jpg";

// const mockPets = [
//   { id: 1, name: "Mocha", type: "Dog", breed: "Mixed Breed", size: "Small", age: "11 months", image: dog1 },
//   { id: 2, name: "Leo", type: "Dog", breed: "Labrador / Hound Mix", size: "Medium", age: "1 year", image: dog2 },
//   { id: 3, name: "Luna", type: "Cat", breed: "Tabby", size: "Small", age: "8 months", image: cat1 },
//   { id: 4, name: "Bella", type: "Cat", breed: "Tabby", size: "Small", age: "2 months", image: cat2 },
// ];

export default function DashboardBrowse() {
  const [searchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    type: searchParams.get("type") || "all",
    age: "all",
    size: "all"
  });

  const handleFilterChange = (filterType: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const [pets, setPets] = useState<any[]>([]);

  useEffect(() => {
    const fetchAdoptables = async () => {
      try {
        const response = await fetch('/api/v1/adoptions', {
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error("Failed to fetch pets");
        }
        const data = await response.json();

        const adoptables = data.filter((pet: any) => pet.adoption_status === "Available");
        setPets(adoptables);
      } 
      catch (err) {
        console.error("Error fetching adoptables:", err);
      };
    };

    fetchAdoptables();
  }, []);

  const filteredPets = pets.filter(pet => {
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
        <p>At Happy Tails, we believe every animal deserves a second chance.
          Each pet has their own story and is ready to find a loving home.
          From playful puppies to calm companions, we're here to help you find the perfect match.</p>
      </div>

      <div className="page-content browse-layout">
        {/* Filter Sidebar */}
        <div className="top-filters">

          <span className="filters-title">
            <FontAwesomeIcon icon={faFilter} /> Filters:
          </span>

          <div className="filter-inline">
            <label htmlFor="petType">Pet Type:</label>
            <select
              id="petType"
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

          <div className="filter-inline">
            <label htmlFor="petAge">Age:</label>
            <select
              id="petAge"
              value={filters.age}
              onChange={(e) => handleFilterChange('age', e.target.value)}
              className="filter-select"
            >
              <option value="all">All Ages</option>
              <option value="puppy">Puppy (&lt;1 year)</option>
              <option value="young">Young (1-3 years)</option>
              <option value="adult">Adult (4-7 years)</option>
              <option value="senior">Senior (8+ years)</option>
            </select>
          </div>

          <div className="filter-inline">
            <label htmlFor="petSize">Size:</label>
            <select
              id="petSize"
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
        </div>

        {/* Pet Grid */}
        <div className="adopt-grid-container">
          <div className="adopt-grid">
            {filteredPets.map((pet) => (
              <div key={pet._id} className="adopt-card">
                <img src={pet.images[0]?.data} alt={pet.name} className="adopt-image" />

                <div className="adopt-card-content">
                  <h3>{pet.name}</h3>

                  <p><strong>Type:</strong> {pet.type}</p>
                  <p><strong>Breed:</strong> {pet.breed}</p>
                  <p><strong>Age:</strong> {pet.age}</p>

                  <div className="adopt-card-buttons">
                    <Link to={`/dashboard/adopt/pet/${pet._id}`} className="profile-btn">
                      View Profile
                    </Link>

                    <Link
                      to={`/dashboard/adopt/${pet._id}`}
                      className="apply-btn"
                    >
                      Apply to Adopt
                    </Link>
                  </div>
                </div>
              </div>
            ))}
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
          <p>Have questions? Contact our adoption team for help.</p>
        </section>
      </div>
    </div>
  );
}

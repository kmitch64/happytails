import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVenusMars, faBirthdayCake, faRuler, faBolt, faBriefcaseMedical, faPaw, faHeart, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

// mocked
const getPetById = (id: string | undefined) => {
  const mockPets: Record<string, any> = {
    "1": {
      id: "1",
      name: "Max",
      type: "Dog",
      breed: "Labrador Retriever",
      bio: "Max is a friendly and energetic Labrador who loves to play fetch. He's great with kids and other dogs. Max was found as a stray but has adapted well to shelter life. He's looking for an active family that can give him the exercise and attention he needs.",
      sex: "Male",
      age: "2 years old",
      size: "Large (60 lbs)",
      energyLevel: "High",
      spayedNeutered: "Yes",
      compatibility: "Good with dogs and children",
      images: [
        "https://via.placeholder.com/600x400/4CAF50/FFFFFF?text=Max+1",
        "https://via.placeholder.com/600x400/4CAF50/FFFFFF?text=Max+2",
        "https://via.placeholder.com/600x400/4CAF50/FFFFFF?text=Max+3"
      ],
      adoptionStatus: "Available",
      location: "Happy Tails Shelter, Toronto"
    }
  };
  return mockPets[id || "1"];
};

export default function DashboardPetProfile() {
  const { id } = useParams();
  const pet = getPetById(id);

  const infoCards = [
    { label: "Sex", value: pet.sex, icon: faVenusMars },
    { label: "Age", value: pet.age, icon: faBirthdayCake },
    { label: "Size", value: pet.size, icon: faRuler },
    { label: "Energy Level", value: pet.energyLevel, icon: faBolt },
    { label: "Spayed/Neutered", value: pet.spayedNeutered, icon: faBriefcaseMedical },
    { label: "Compatibility", value: pet.compatibility, icon: faPaw },
  ];

  return (
    <div className="dashboard-page pet-profile-page">
      <div className="page-header">
        <Link to="/dashboard/adopt/browse" className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Browse
        </Link>
        <h1>{pet.name}'s Profile</h1>
      </div>

      <div className="page-content">
        {/* Carousel Section */}
        <section className="pet-carousel">
          <div className="carousel-container">
            {pet.images.map((image: string, index: number) => (
              <div key={index} className="carousel-slide">
                <img src={image} alt={`${pet.name} - Photo ${index + 1}`} className="pet-photo" />
              </div>
            ))}
          </div>
          <div className="carousel-nav">
            {pet.images.map((_: string, index: number) => (
              <button key={index} className="carousel-dot"></button>
            ))}
          </div>
        </section>

        {/* Pet Details Section */}
        <section className="pet-details-section">
          <div className="details-grid">
            {/* Left Column - Bio and Info */}
            <div className="pet-bio">
              <div className="pet-header">
                <h2>{pet.name} <span className="adoption-status">{pet.adoptionStatus}</span></h2>
                <p className="pet-breed">{pet.breed} • {pet.age} • {pet.sex}</p>
                <p className="pet-location"><FontAwesomeIcon icon={faPaw} /> {pet.location}</p>
              </div>

              <div className="pet-bio-content">
                <h3>About {pet.name}</h3>
                <p>{pet.bio}</p>
              </div>
            </div>

            {/* Right Column - Info Cards */}
            <div className="pet-info-cards">
              <h3>Pet Information</h3>
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
            </div>
          </div>
        </section>

        {/* Adoption Application Section */}
        <section className="adoption-section">
          <h2>Adopt {pet.name}</h2>
          <p>Ready to give {pet.name} a forever home? Start your adoption application today!</p>

          <div className="adoption-steps">
            <h3>Adoption Process</h3>
            <ol>
              <li>Submit an application (5-10 minutes)</li>
              <li>Our team reviews your application (1-3 business days)</li>
              <li>We'll contact you to schedule a meet-and-greet</li>
              <li>Finalize the adoption and welcome your new family member!</li>
            </ol>
          </div>

          <div className="adoption-actions">
            <button className="cta-button primary">
              <FontAwesomeIcon icon={faHeart} /> Start Adoption Application
            </button>
            <button className="cta-button secondary">
              <FontAwesomeIcon icon={faHeart} /> Save to Favorites
            </button>
          </div>
        </section>

        {/* Similar Pets Section */}
        <section className="similar-pets">
          <h2>You Might Also Like</h2>
          <div className="similar-pets-grid">
            {[2, 3, 4].map((id: number) => {
              const similarPet = getPetById(id.toString());
              return (
                <Link key={id} to={`/dashboard/adopt/profile/${id}`} className="pet-card-link">
                  <div className="pet-card">
                    <img src={similarPet.images[0]} alt={similarPet.name} className="pet-card-image" />
                    <div className="pet-card-info">
                      <h3>{similarPet.name}</h3>
                      <p>{similarPet.breed} • {similarPet.age}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

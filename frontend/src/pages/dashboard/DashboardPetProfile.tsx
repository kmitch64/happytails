import { Link, useParams } from "react-router-dom";

import dog1 from "../../assets/dog1.jpg";
import dog2 from "../../assets/dog2.jpg";
import cat1 from "../../assets/cat1.jpg";
import cat2 from "../../assets/cat2.jpg";

export default function DashboardPetProfile() {
  const { id } = useParams();

  const pets = [
    {
      id: "1",
      name: "Mocha",
      type: "Dog",
      breed: "Mixed Breed",
      age: "11 months",
      sex: "Female",
      size: "Medium (35 lbs)",
      energyLevel: "High",
      spayedNeutered: "Yes",
      compatibility: "Good with dogs and children",
      bio: "Mocha is a playful and affectionate puppy who loves attention and short walks. She would do well in a home that can give her time, patience, and lots of love.",
      image: dog1,
      adoptionStatus: "Available",
      location: "Happy Tails Shelter, Toronto"
    },
    {
      id: "2",
      name: "Leo",
      type: "Dog",
      breed: "Labrador / Hound Mix",
      age: "1 year",
      sex: "Male",
      size: "Large (60 lbs)",
      energyLevel: "High",
      spayedNeutered: "Yes",
      compatibility: "Good with active households",
      bio: "Leo is friendly, energetic, and curious. He enjoys outdoor time and would be a great match for an active household looking for a loyal companion.",
      image: dog2,
      adoptionStatus: "Available",
      location: "Happy Tails Shelter, Toronto"
    },
    {
      id: "3",
      name: "Luna",
      type: "Cat",
      breed: "Tabby",
      age: "8 months",
      sex: "Female",
      size: "Small",
      energyLevel: "Medium",
      spayedNeutered: "No",
      compatibility: "Good with calm households",
      bio: "Luna is sweet, calm, and loves cozy spaces by the window. She would be a wonderful fit for someone looking for a gentle and affectionate cat.",
      image: cat1,
      adoptionStatus: "Available",
      location: "Happy Tails Shelter, Toronto"
    },
    {
      id: "4",
      name: "Bella",
      type: "Cat",
      breed: "Tabby",
      age: "2 months",
      sex: "Female",
      size: "Small",
      energyLevel: "High",
      spayedNeutered: "No",
      compatibility: "Good with playful households",
      bio: "Bella is curious, adorable, and full of kitten energy. She loves to explore and would thrive in a home ready for a playful young pet.",
      image: cat2,
      adoptionStatus: "Available",
      location: "Happy Tails Shelter, Toronto"
    }
  ];

  const pet = pets.find((item) => item.id === id);

  if (!pet) {
    return (
      <div className="dashboard-page">
        <div className="page-header">
          <h1>Pet not found</h1>
          <p>We couldn’t find that pet profile.</p>
          <Link to="/dashboard/adopt/browse" className="cta-button primary">
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page pet-profile-page">
      <div className="page-header">
        <Link to="/dashboard/adopt/browse" className="back-button">
          Back to Browse
        </Link>
        <h1>{pet.name}'s Profile</h1>
        <p>Learn more about {pet.name} and start the adoption process.</p>
      </div>

      <div className="page-content">
        <section className="dashboard-section pet-profile-card">
          <div className="pet-profile-layout">
            <div className="pet-image-wrap">
              <img
                src={pet.image}
                alt={pet.name}
                className="pet-main-image"
              />
            </div>

            <div className="pet-details-wrap">
              <h2 className="pet-intro">Hi, I’m {pet.name}</h2>

              <h3 className="about-title">About {pet.name}</h3>
              <p className="pet-bio-text">{pet.bio}</p>

              <div className="status-row">
                <span className="status-label">Status:</span>
                <span className="status-badge">{pet.adoptionStatus}</span>
              </div>

              <p><strong>Type:</strong> {pet.type}</p>
              <p><strong>Breed:</strong> {pet.breed}</p>
              <p><strong>Age:</strong> {pet.age}</p>
              <p><strong>Sex:</strong> {pet.sex}</p>
              <p><strong>Size:</strong> {pet.size}</p>
              <p><strong>Energy Level:</strong> {pet.energyLevel}</p>
              <p><strong>Spayed/Neutered:</strong> {pet.spayedNeutered}</p>
              <p><strong>Compatibility:</strong> {pet.compatibility}</p>
              <p><strong>Location:</strong> {pet.location}</p>

              <div className="profile-actions">
                <Link to="/adopt-form" className="cta-button primary">
                  Apply to Adopt
                </Link>

                <Link to="/dashboard/adopt/browse" className="cta-button secondary">
                  Back to Browse
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";



export default function DashboardPetProfile() {
  const { id } = useParams();
  const [pet, setPet] = useState<Pet | null>(null);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const response = await fetch(`/api/v1/pets/${id}`, {
          headers: {
            "Content-Type": "application/json"  
          }
        });
        const data = await response.json();
        setPet(data);
      } catch (error) {
        console.error("Error fetching pet:", error);
      }
    };

    fetchPet();
  }, [id]);

  if (!pet) {
    return (
      <div className="dashboard-page">
        <div className="page-header">
          <h1>Pet not found</h1>
          <p>We couldn't find that pet profile.</p>
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
                src={pet.images[0]?.data || "/logo.png"}
                alt={pet.name}
                className="pet-main-image"
              />
            </div>

            <div className="pet-details-wrap">
              <h2 className="pet-intro">Hi, I'm {pet.name}</h2>

              <h3 className="about-title">About {pet.name}</h3>
              <p className="pet-bio-text">{pet.bio}</p>

              <div className="status-row">
                <span className="status-label">Status:</span>
                <span className="status-badge">{pet.adoption_status}</span>
              </div>

              <p><strong>Type:</strong> {pet.type}</p>
              <p><strong>Breed:</strong> {pet.breed}</p>
              <p><strong>Age:</strong> {pet.age}</p>
              <p><strong>Sex:</strong> {pet.sex}</p>
              <p><strong>Size:</strong> {pet.size}</p>
              <p><strong>Energy Level:</strong> {pet.energyLevel}</p>
              <p><strong>Spayed/Neutered:</strong> {pet.spayedNeutered}</p>
              <p><strong>Compatibility:</strong> {pet.compatibility}</p>
              {/* <p><strong>Location:</strong> {pet.location}</p> */}

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
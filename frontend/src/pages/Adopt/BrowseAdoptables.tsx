
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./BrowseAdoptables.css";

// import dog1 from "../../assets/dog1.jpg";
// import dog2 from "../../assets/dog2.jpg";
// import cat1 from "../../assets/cat1.jpg";
// import cat2 from "../../assets/cat2.jpg";

export default function BrowseAdoptables() {
  // const pets = [
  //     { id: 1, name: "Mocha", type: "Dog", breed: "Mixed Breed", age: "11 months", image: dog1 },
  //     { id: 2, name: "Leo", type: "Dog", breed: "Labrador / Hound Mix", age: "1 year", image: dog2 },
  //     { id: 3, name: "Luna", type: "Cat", breed: "Tabby", age: "8 months", image: cat1 },
  //     { id: 4, name: "Bella", type: "Cat", breed: "Tabby", age: "2 months", image: cat2 },
  // ];

  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    const fetchAdoptables = async () => {
      try {
        const response = await fetch('/api/v1/adoptions/pets', {
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error("Failed to fetch pets");
        }
        const data = await response.json();

        const adoptables = data.filter((pet: Pet) => pet.adoption_status === "Available");
        console.log("Fetched adoptable pets:", adoptables);
        setPets(adoptables);
      } catch (err) {
        console.error("Error fetching adoptables:", err);
      }
    };

    fetchAdoptables();
  }, []);

  return (
    <div className="browse-adoptables-page">
      <section className="adopt-hero">
        <h1>Adopt a Pet</h1>
        <p>At Happy Tails, we believe every animal deserves a second chance.
          Each pet has their own story and is ready to find a loving home.
          From playful puppies to calm companions, we’re here to help you find the perfect match.</p>
      </section>

      <section className="adopt-grid">
        {pets.map((pet) => (
          <div key={pet._id} className="adopt-card">
            <img src={pet.images[0]?.data} alt={pet.name} className="adopt-image" />

            <div className="adopt-card-content">
              <h3>{pet.name}</h3>

              <p><strong>Type:</strong> {pet.type}</p>
              <p><strong>Breed:</strong> {pet.breed}</p>
              <p><strong>Age:</strong> {pet.age}</p>

              <div className="adopt-card-buttons">
                <Link to={`/adopt/${pet._id}`} className="profile-btn">
                  View Profile
                </Link>

                <Link to={`/adopt-form?pet=${encodeURIComponent(pet.name)}&id=${encodeURIComponent(pet._id)}`} className="apply-btn">
                  Apply to Adopt
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

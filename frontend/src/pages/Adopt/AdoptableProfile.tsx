import { Link, useParams } from "react-router-dom";
import "./AdoptableProfile.css";

import dog1 from "../../assets/dog1.jpg";
import dog2 from "../../assets/dog2.jpg";
import cat1 from "../../assets/cat1.jpg";
import cat2 from "../../assets/cat2.jpg";

export default function AdoptableProfile() {
    const { id } = useParams();

    const pets = [
        {
            id: "1",
            name: "Mocha",
            type: "Dog",
            breed: "Mixed Breed",
            age: "11 months",
            gender: "Female",
            size: "Medium",
            image: dog1,
            description:
                "Mocha is a playful and affectionate puppy who loves attention and short walks. She would do well in a home that can give her time, patience, and lots of love.",
        },
        {
            id: "2",
            name: "Leo",
            type: "Dog",
            breed: "Labrador / Hound Mix",
            age: "1 year",
            gender: "Male",
            size: "Large",
            image: dog2,
            description:
                "Leo is friendly, energetic, and curious. He enjoys outdoor time and would be a great match for an active household looking for a loyal companion.",
        },
        {
            id: "3",
            name: "Luna",
            type: "Cat",
            breed: "Tabby",
            age: "8 months",
            gender: "Female",
            size: "Small",
            image: cat1,
            description:
                "Luna is sweet, calm, and loves cozy spaces by the window. She would be a wonderful fit for someone looking for a gentle and affectionate cat.",
        },
        {
            id: "4",
            name: "Bella",
            type: "Cat",
            breed: "Tabby",
            age: "2 months",
            gender: "Female",
            size: "Small",
            image: cat2,
            description:
                "Bella is curious, adorable, and full of kitten energy. She loves to explore and would thrive in a home ready for a playful young pet.",
        },
    ];

    const pet = pets.find((item) => item.id === id);

    if (!pet) {
        return (
            <div className="adoptable-profile">
                <div className="container">
                    <h2>Pet not found</h2>
                    <Link to="/adopt" className="cta-button">
                        Back to Adopt Page
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="adoptable-profile">
            <div className="container">
                <div className="media-frame">
                    <img src={pet.image} alt={pet.name} className="profile-image" />
                </div>

                <div className="details">
                    <div className="panel">
                        <h2 className="pet-intro"> Hi, I'm {pet.name}👋</h2>
                        <p className="body-text">{pet.description}</p>
                    </div>

                    <div className="panel">
                        <h2 className="panel-title">Pet Details</h2>
                        <div className="meta">
                            <div className="meta-row">
                                <dt>Type</dt>
                                <dd>{pet.type}</dd>
                            </div>
                            <div className="meta-row">
                                <dt>Breed</dt>
                                <dd>{pet.breed}</dd>
                            </div>
                            <div className="meta-row">
                                <dt>Age</dt>
                                <dd>{pet.age}</dd>
                            </div>
                            <div className="meta-row">
                                <dt>Gender</dt>
                                <dd>{pet.gender}</dd>
                            </div>
                            <div className="meta-row">
                                <dt>Size</dt>
                                <dd>{pet.size}</dd>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="how-to-adopt">
                    <h2 className="panel-title">Ready to Apply?</h2>
                    <p className="cta-description">
                        Complete our adoption application form to take the next step.
                    </p>
                    <Link to="/adopt-form" className="cta-button">
                        Apply to Adopt
                    </Link>
                </div>
            </div>
        </div>
    );
}

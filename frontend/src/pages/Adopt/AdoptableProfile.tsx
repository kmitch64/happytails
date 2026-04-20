
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import "./AdoptableProfile.css";


export default function AdoptableProfile() {
    const { id } = useParams();
    const [pet, setPet] = useState<any>(null);

    useEffect(() => {
        const fetchPet = async () => {
            try {
                const response = await fetch(`/api/v1/adoptions/pets/${id}`, {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include"
                });

                if (!response.ok) throw new Error("Failed to fetch pet details");
                
                const data = await response.json();
                setPet(data);
            } 
            catch (err) {
                console.error("Error fetching pet details:", err);
            };
        };

        fetchPet();
    }, [id]);

    
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
                    <img src={pet.images[0]?.data || "/logo.png"} alt={pet.name} className="profile-image" />
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
                    <Link to={`/adopt-form?pet=${encodeURIComponent(pet.name)}&id=${encodeURIComponent(pet.id)}`} className="cta-button">
                        Apply to Adopt
                    </Link>
                </div>
            </div>
        </div>
    );
}

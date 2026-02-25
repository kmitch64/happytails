import type { JSX } from 'react'; 
import "./AdoptableProfile.css";
import { FaVenusMars, FaBirthdayCake, FaRuler, FaBolt, FaBriefcaseMedical, FaPaw } from "react-icons/fa";
{/*insert Header component here*/}

{/*placeholder adoptable pet*/}
const mockPet = {
    id: "A-1023",
    name: "TBD Name",
    bio: "Add a short story here (background, fun facts).",
    sex: "F",
    age: "2 years old",
    size: "XL",
    energyLevel: "High",
    spayedNeutered: "Y",
    compatibility: "Dogs",
};

export default function AdoptableProfile(): JSX.Element {
    const pet = mockPet;
    const infoCards = [
        { label: "Sex", value: pet.sex, icon: FaVenusMars },
        { label: "Age", value: pet.age, icon: FaBirthdayCake },
        { label: "Size", value: pet.size, icon: FaRuler },
        { label: "Energy Level", value: pet.energyLevel, icon: FaBolt },
        { label: "Spayed / Neutered", value: pet.spayedNeutered, icon: FaBriefcaseMedical },
        { label: "Compatibility", value: pet.compatibility, icon: FaPaw },
    ];
    return (
        <main className="adoptable-profile">
            <div className="container">
                {/*Pet Images Carousel PLACEHOLDER*/}
                <section className="carousel" aria-label="Pet photos">
                    <button className="icon-btn" type="button" aria-label="Previous photo">
                        ‹
                    </button>

                    <div className="media-frame" role="img" aria-label="Pet photo placeholder">
                        <div className="media-placeholder">Photo carousel placeholder</div>
                    </div>

                    <button className="icon-btn" type="button" aria-label="Next photo">
                        ›
                    </button>
                </section>

                {/*Two-column info section*/}
                <section className="details">
                {/* Left: history + brief bio */}
                    <article className="panel">
                        <h2 className="panel-title">Pet Bio</h2>

                        <dl className="meta">
                        <div className="meta-row">
                            <dt>Name</dt>
                            <dd>{pet.name}</dd>
                        </div>
                        <div className="meta-row">
                            <dt>ID</dt>
                            <dd>{pet.id}</dd>
                        </div>
                        </dl>

                        <div className="bio">
                        <h3 className="subheading">Bio / History</h3>
                        <p className="body-text">{pet.bio}</p>
                        </div>
                    </article>

                {/* Right: pet details as cards */}
                    <article className="panel">
                        <h2 className="panel-title">Pet Info</h2>

                        <ul className="card-grid">
                            {infoCards.map((card) => {
                                const Icon = card.icon;

                                return (
                                <li className="info-card" key={card.label}>
                                    <div className="card-header">
                                        <Icon className="card-icon" />
                                        <span className="card-label">{card.label}</span>
                                    </div>

                                    <span className="card-value">{card.value}</span>
                                </li>
                                );
                            })}
                        </ul>
                    </article>
                        {/* Adoption Application - Bottom section */}
                        <section className="how-to-adopt">
                            <h2 className="panel-title">Apply to Adopt {pet.name}!</h2>

                            <p className="cta-description">
                                Interested in giving {pet.name} a forever home? Start your adoption application below.
                            </p>

                            <div className="cta-container">
                                <a href="#" className="cta-button">
                                Start Adoption Application
                                </a>
                            </div>
                        </section>
                </section>
            </div>
        </main>

    );

}
import type { JSX } from 'react'; 
{/*insert Header component here*/}

export default function AdoptableProfile(): JSX.Element {
    return (
        <main className="main-content">
            {/*Pet Images Carousel*/}
            <section className="profile-carousel">


            </section>

            {/*Two-column info section*/}
            <section className="adoptable-profile-details">
                {/* Left: description + history */}
                <article className="profile-panel">
                    <h2>Pet History Description</h2>
                    <p>

                    </p>
                </article>
                {/* Right: pet details */}
                <article className="info-list">
                    <h2>Pet Info</h2>
                        <ul className="info-list">
                            <li><strong>Age:</strong> </li>
                            <li><strong>Breed:</strong> </li>
                            <li><strong>Physical Traits:</strong> </li>
                            <li><strong>Behaviour:</strong> </li>
                            <li><strong>Compatibility:</strong> </li>
                        </ul>
                </article>

            </section>
            {/*Adoption Application - Bottom section*/}
            <section className="how-to-adopt">
                <h2>Apply to Adopt!</h2>
                {/*Button / Link here*/}
            </section>

        </main>

    );

}
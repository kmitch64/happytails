import type { JSX } from 'react'; 

export default function Adopt(): JSX.Element {
    return (
        <div className="Adopt">
            <header className="header">
                <h1>Adopt a Pet with Happy Tails</h1>
                    <p>Be a forever home for a pet in need!</p>
            </header>
            <main className="main-content">
                <section className="hero">
                    <h2>Browse pets available for adoption.</h2>
                    <p>Pet types include: Dogs, Cats, Other (Gerbils, Reptiles, Birds, etc.)</p>
                    <button className="cta-button">See All Adoptables!</button>
                </section>
                <section className="features">
                    <div className="feature-card">
                        <h3>Dogs</h3>
                    </div>
                    <div className="feature-card">
                        <h3>Cats</h3>
                    </div>
                    <div className="feature-card">
                        <h3>Other</h3>
                    </div>
                    </section>
                {/* Adoption Application FAQ Section */}
                <section className="hero">
                    <h2>How to Apply to Adopt a Pet</h2>
                    <p>
                        Ready to adopt? 1. Browse adoptables → 2. View a profile → 3. Submit an application → 4. Meet & finalize adoption.
                    </p>
                    <button className="cta-button">Start Application</button>
                </section>
            </main>
        </div>
    );
}
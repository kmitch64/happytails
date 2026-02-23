import type { JSX } from 'react'; 
import '../App.css';

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
                {/* Submit Application Section */}
                <section className="hero">
                    <h2>Submit an Adoption Application</h2>
                    <p>
                        Ready to adopt? Fill out an application to begin the adoption process
                        and give a pet a loving home.
                    </p>
                    <button className="cta-button">Start Application</button>
                </section>
            </main>
        </div>
    );
}
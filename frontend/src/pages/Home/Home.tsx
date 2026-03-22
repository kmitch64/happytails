import type { JSX } from 'react'; 
import { Link } from "react-router-dom";



export default function Home(): JSX.Element {
    
    return (
        
        <>
            

            <main className="main-content">

                <section className="hero">
                    <h2>Find Your Perfect Pet</h2>
                        <p>Browse adoptable pets, connect with sitters, and get AI-powered care advice—all in one place.</p>
                    <button className="cta-button">Register / Log in</button>
                </section>

            <section className="features">

                <Link to="/adopt" className="card-link">
                    <div className="feature-card">
                        <h3>Adopt a Pet</h3>
                        <p>Browse pets available for adoption and submit applications.</p>
                    </div>
                </Link>

                <div className="feature-card">
                    <h3>Find a Sitter</h3>
                    <p>Book trusted pet sitters for walking, boarding, or daycare.</p>
                </div>
                <div className="feature-card">
                    <h3>AI Care Assistant</h3>
                    <p>Get personalized reminders and advice for your pet's health.</p>
                </div>
            </section>
        </main>
       
    </>
    
    )
};

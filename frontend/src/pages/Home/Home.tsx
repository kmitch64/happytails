import type { JSX } from 'react'; 
import { Link } from "react-router-dom";



export default function Home(): JSX.Element {
    // this page isn't a great example for typescript so I did this simple one.
    const title: string = "Happy Tails";
    
    return (
        
        <div className="App">
            {/*Header and header styling to go into components/header*/}
            <header className="header">
                <h1>Welcome to {title}</h1>
                <p>A unified platform for pet care and adoption</p>
            </header>

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
        {/*footer and footer styling to go into components/footer*/}
        <footer className="footer">
            <p>© 2026 {title}. All rights reserved.</p>
        </footer>
    </div>
    
    )
}
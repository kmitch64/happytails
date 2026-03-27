
import { Link } from "react-router-dom";
import { useAuth } from '../../components/auth/AuthContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw, faUser, faRobot } from '@fortawesome/free-solid-svg-icons';

import './home.css'

export default function Home() {
    const { isLoggedIn } = useAuth();

    return (
        <div className="landing-page">
            
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Find Your Perfect Pet Companion</h1>
                    <p className="hero-subtitle">
                        Browse adoptable pets, connect with trusted sitters, and get AI-powered care advice—all in one place.
                    </p>
                    {!isLoggedIn && (
                        <div className="hero-cta">
                            <Link to="/register" className="cta-button primary">Get Started</Link>
                            <Link to="/login" className="cta-button secondary">Log In</Link>
                        </div>
                    )}
                </div>
                <div className="hero-image">
                    <img
                        src="/images/hero.jpg"
                        alt="Happy Pets"
                        className="hero-img"
                    />
                </div>
            </section>

            <section className="features-section">
                <h2>Why Choose Happy Tails?</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <FontAwesomeIcon icon={faPaw} size="3x" color="#4CAF50" />
                        </div>
                        <h3>Adopt a Pet</h3>
                        <p>Browse pets available for adoption and submit applications with ease.</p>
                        <Link to="/adopt" className="feature-link">Learn More</Link>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <FontAwesomeIcon icon={faUser} size="3x" color="#4CAF50" />
                        </div>
                        <h3>Find a Sitter</h3>
                        <p>Book trusted pet sitters for walking, boarding, or daycare.</p>
                        <Link to="/sitters" className="feature-link">Learn More</Link>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <FontAwesomeIcon icon={faRobot} size="3x" color="#4CAF50" />
                        </div>
                        <h3>AI Care Assistant</h3>
                        <p>Get personalized reminders and advice for your pet's health.</p>
                        <Link to="/ai-assistant" className="feature-link">Learn More</Link>
                    </div>
                </div>
            </section>

            <section className="testimonials-section">
                <h2>What Our Users Say</h2>
                <div className="testimonials-grid">
                    <div className="testimonial-card">
                        <p className="testimonial-text">
                            "Happy Tails made it so easy to find and adopt our new dog, Max. The process was seamless!"
                        </p>
                        <div className="testimonial-author">
                            <p>- Sarah & Family</p>
                        </div>
                    </div>
                    <div className="testimonial-card">
                        <p className="testimonial-text">
                            "The AI care reminders have been a lifesaver for keeping track of my cat's vaccinations."
                        </p>
                        <div className="testimonial-author">
                            <p>- Mark, Cat Owner</p>
                        </div>
                    </div>
                    <div className="testimonial-card">
                        <p className="testimonial-text">
                            "As a pet sitter, Happy Tails helped me grow my client base and manage bookings effortlessly."
                        </p>
                        <div className="testimonial-author">
                            <p>- Lisa, Pet Sitter</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="cta-section">

                {!isLoggedIn ? (
                    <>
                        <h2>Ready to Get Started?</h2>
                        <p>Join thousands of happy pets and owners today.</p>
                        <Link to="/register" className="cta-button primary large">Sign Up Now</Link>
                    </>
                ) : (
                    <Link to="/dashboard" className="cta-button primary large">Go to Dashboard</Link>
                )}
            </section>
        </div>
    );
}
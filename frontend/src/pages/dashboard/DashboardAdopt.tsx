import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw, faDog, faCat, faSearch } from '@fortawesome/free-solid-svg-icons';

export default function DashboardAdopt() {
  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1><FontAwesomeIcon icon={faPaw} /> Adopt a Pet</h1>
        <p>Be a forever home for a pet in need!</p>
      </div>

      <div className="page-content">
        {/* Hero Section */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Browse Pets Available for Adoption</h2>
            <p>Pet types include: Dogs, Cats, and Other (Gerbils, Reptiles, Birds, etc.)</p>
          </div>
          <Link to="/dashboard/adopt/browse" className="cta-button primary">
            <FontAwesomeIcon icon={faSearch} /> See All Adoptables
          </Link>
        </section>

        {/* Pet Type Cards */}
        <section className="dashboard-section">
          <h2>Browse by Pet Type</h2>
          <div className="card-grid">
            <div className="feature-card">
              <div className="card-icon" style={{ backgroundColor: '#FF9800' }}>
                <FontAwesomeIcon icon={faDog} size="2x" />
              </div>
              <h3>Dogs</h3>
              <p>Find your loyal canine companion</p>
              <Link to="/dashboard/adopt/browse?type=dog" className="card-link">Browse Dogs</Link>
            </div>

            <div className="feature-card">
              <div className="card-icon" style={{ backgroundColor: '#607D8B' }}>
                <FontAwesomeIcon icon={faCat} size="2x" />
              </div>
              <h3>Cats</h3>
              <p>Discover your purring friend</p>
              <Link to="/dashboard/adopt/browse?type=cat" className="card-link">Browse Cats</Link>
            </div>

            <div className="feature-card">
              <div className="card-icon" style={{ backgroundColor: '#795548' }}>
                <FontAwesomeIcon icon={faPaw} size="2x" />
              </div>
              <h3>Other Pets</h3>
              <p>Birds, reptiles, and small animals</p>
              <Link to="/dashboard/adopt/browse?type=other" className="card-link">Browse Others</Link>
            </div>
          </div>
        </section>

        {/* Adoption Process */}
        <section className="dashboard-section process-section">
          <h2>How to Adopt a Pet</h2>
          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">1</div>
              <p>Browse adoptable pets</p>
            </div>
            <div className="process-step">
              <div className="step-number">2</div>
              <p>View pet profiles</p>
            </div>
            <div className="process-step">
              <div className="step-number">3</div>
              <p>Submit application</p>
            </div>
            <div className="process-step">
              <div className="step-number">4</div>
              <p>Meet and finalize adoption</p>
            </div>
          </div>
          <Link to="/dashboard/adopt/browse" className="cta-button primary">
            Start Your Adoption Journey
          </Link>
        </section>
      </div>
    </div>
  );
};

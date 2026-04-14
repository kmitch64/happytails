import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "./AdoptionApplication.css";

export default function AdoptionApplication() {
    const [searchParams] = useSearchParams();

    const petNameFromUrl = useMemo(() => {
        return searchParams.get("pet") || "";
    }, [searchParams]);

    const [formData, setFormData] = useState({
        petName: petNameFromUrl,
        reason: "",
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
        homeType: "",
        fencedYard: "",
        householdCount: "",
        childrenInHome: "",
        ownedPetBefore: "",
        aloneHours: "",
        typicalDay: "",
        expenseReady: "",
        finalNotes: "",
    });

    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (petNameFromUrl) {
            setFormData((prev) => ({
                ...prev,
                petName: decodeURIComponent(petNameFromUrl),
            }));
        }

    }, [petNameFromUrl]);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log(formData)
        setShowSuccess(true);
    }

    return (
        <div className="adoption-form-page">
            <div className="adoption-form-container">
                <div className="form-hero">
                    <h1>Adoption Application</h1>
                    <p>
                        Please complete the form below to apply for adoption. This helps us
                        make the best match for you and your future furry companion.
                    </p>
                </div>

                <form className="adoption-form" onSubmit={handleSubmit}>
                    <section className="form-card">
                        <h2>Pet Information</h2>
                        <div className="pet-info-grid">
                            <div className="form-group">
                                <label htmlFor="petName">Pet you are applying for</label>
                                <select
                                    id="petName"
                                    name="petName"
                                    value={formData.petName}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select one</option>
                                    <option value="Mocha">Mocha</option>
                                    <option value="Leo">Leo</option>
                                    <option value="Luna">Luna</option>
                                    <option value="Bella">Bella</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="reason">Why are you interested in adopting this pet?</label>
                                <textarea
                                    id="reason"
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleChange}
                                    placeholder="Tell us a little more..."
                                    rows={4}
                                    required
                                />
                            </div>
                        </div>
                    </section>

                    <section className="form-card">
                        <h2>Applicant Information</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="fullName">Full Name</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="123-456-7890"
                                    pattern="\d{3}-\d{3}-\d{4}"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="address">Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="city">City</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="postalCode">Postal Code</label>
                                <input
                                    type="text"
                                    id="postalCode"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    placeholder="A1A 1A1"
                                    required
                                />
                            </div>
                        </div>
                    </section>

                    <section className="form-card">
                        <h2>Household Information</h2>
                        <div className="single-column-grid">
                            <div className="form-group">
                                <label htmlFor="homeType">Type of Home</label>
                                <select
                                    id="homeType"
                                    name="homeType"
                                    value={formData.homeType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select one</option>
                                    <option value="House">House</option>
                                    <option value="Townhouse">Townhouse</option>
                                    <option value="Apartment">Apartment / Condo</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="fencedYard">Do you have a fenced yard?</label>
                                <select
                                    id="fencedYard"
                                    name="fencedYard"
                                    value={formData.fencedYard}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select one</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                    <option value="No yard">No yard</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="householdCount">How many people live in your household?</label>
                                <input
                                    type="number"
                                    id="householdCount"
                                    name="householdCount"
                                    value={formData.householdCount}
                                    onChange={handleChange}
                                    min="0"
                                    placeholder="Enter number"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="childrenInHome">Are there children in the home?</label>
                                <select
                                    id="childrenInHome"
                                    name="childrenInHome"
                                    value={formData.childrenInHome}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select one</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <section className="form-card">
                        <h2>Lifestyle &amp; Experience</h2>
                        <div className="single-column-grid">
                            <div className="form-group">
                                <label htmlFor="ownedPetBefore">Have you owned a pet before?</label>
                                <select
                                    id="ownedPetBefore"
                                    name="ownedPetBefore"
                                    value={formData.ownedPetBefore}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select one</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="aloneHours">How many hours would the pet be alone each day?</label>
                                <input
                                    type="number"
                                    id="aloneHours"
                                    name="aloneHours"
                                    value={formData.aloneHours}
                                    onChange={handleChange}
                                    min="0"
                                    placeholder="Enter number"
                                    required
                                />
                            </div>

                            <div className="form-group form-group-full">
                                <label htmlFor="typicalDay">Describe a typical day for your pet</label>
                                <textarea
                                    id="typicalDay"
                                    name="typicalDay"
                                    value={formData.typicalDay}
                                    onChange={handleChange}
                                    rows={4}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="expenseReady">Are you prepared for food, vet, and care expenses?</label>
                                <select
                                    id="expenseReady"
                                    name="expenseReady"
                                    value={formData.expenseReady}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select one</option>
                                    <option value="Yes">Yes</option>
                                    <option value="Still planning">Still planning</option>
                                    <option value="Not sure">Not sure</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <section className="form-card">
                        <h2>Final Notes</h2>
                        <div className="single-column-grid">
                            <div className="form-group form-group-full">
                                <label htmlFor="finalNotes">Anything else you would like us to know?</label>
                                <textarea
                                    id="finalNotes"
                                    name="finalNotes"
                                    value={formData.finalNotes}
                                    onChange={handleChange}
                                    rows={4}
                                />
                            </div>
                        </div>
                    </section>

                    <div className="submit-wrap">
                        <button type="submit" className="submit-btn">
                            Submit Application
                        </button>
                    </div>
                </form>

                {showSuccess && (
                    <div className="adoption-success-overlay">
                        <div className="adoption-success-modal">
                            <div className="success-icon">✓</div>
                            <h2>Application Received.</h2>
                            <p>
                                Your adoption application has been submitted successfully. We’ll
                                review it and get back to you soon. Thank you!
                            </p>
                            <button
                                type="button"
                                className="success-button"
                                onClick={() => setShowSuccess(false)}
                            >
                                Okay
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

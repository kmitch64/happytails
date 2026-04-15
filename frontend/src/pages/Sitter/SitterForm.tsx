import React, { useState } from "react";
import "./Sitter.css";
import sitterImg from "../../assets/sitter.jpg";

export default function SitterForm() {
    const [formData, setFormData] = useState({
        petName: "",
        serviceType: "",
        date: "",
        time: "",
        notes: ""
    });

    const [showSuccess, setShowSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData);

        setShowSuccess(true);

        setFormData({
            petName: "",
            serviceType: "",
            date: "",
            time: "",
            notes: ""
        })
    };

    return (
        <div className="form-container">
            {showSuccess && (
                <div className="success-overlay">
                    <div className="success-modal">
                        <div className="success-icon">✓</div>
                        <h3>Request Submitted!</h3>
                        <p>
                            Your pet sitter request has been sent successfully. We’ll match you
                            with the right sitter shortly.
                        </p>
                        <button
                            className="success-btn"
                            onClick={() => setShowSuccess(false)}
                        >
                            Okay
                        </button>
                    </div>
                </div>
            )}

            <div className="form-card">
                <div className="form-image-wrap">
                    <img src={sitterImg}
                        alt="Pet sitting"
                        className="form-image"
                    />
                </div>

                <div className="form-header">
                    <h1 className="form-title">Book a Pet Sitter</h1>
                    <p className="form-subtitle">
                        Tell us about your pet and we’ll match you with the right sitter.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Pet Name</label>
                        <input
                            type="text"
                            name="petName"
                            placeholder="Enter pet name"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Service Type</label>
                        <select
                            name="serviceType"
                            value={formData.serviceType}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a service</option>
                            <option value="walking">Walking</option>
                            <option value="house-sitting">House-Sitting</option>
                            <option value="overnight">Overnight Stay</option>
                            <option value="drop-in">Drop-in Visit</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Date</label>
                        <input
                            type="date"
                            name="date"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Time</label>
                        <select
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a time</option>

                            <option value="06:00 AM">6:00 AM</option>
                            <option value="07:00 AM">7:00 AM</option>
                            <option value="08:00 AM">8:00 AM</option>
                            <option value="09:00 AM">9:00 AM</option>
                            <option value="10:00 AM">10:00 AM</option>
                            <option value="11:00 AM">11:00 AM</option>
                            <option value="12:00 PM">12:00 PM</option>

                            <option value="01:00 PM">1:00 PM</option>
                            <option value="02:00 PM">2:00 PM</option>
                            <option value="03:00 PM">3:00 PM</option>
                            <option value="04:00 PM">4:00 PM</option>
                            <option value="05:00 PM">5:00 PM</option>

                            <option value="06:00 PM">6:00 PM</option>
                            <option value="07:00 PM">7:00 PM</option>
                            <option value="08:00 PM">8:00 PM</option>
                            <option value="09:00 PM">9:00 PM</option>
                            <option value="10:00 PM">10:00 PM</option>
                            <option value="11:00 PM">11:00 PM</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Notes</label>
                        <textarea
                            name="notes"
                            placeholder="Any special instructions..."
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="btn-primary">
                        Submit Request
                    </button>
                </form>
            </div>
        </div>
    );
}
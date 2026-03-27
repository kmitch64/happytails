import { useParams, useNavigate } from "react-router-dom";
import { useState, FormEvent } from "react";



export default function AddMedicalRecord() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [type, useType] = useState("");
  const [notes, useDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // goes back to pets page for now
    navigate(`/dashboard/my-pets/${id}`);
  };

  return (
    <div className="add-medical-container">
      <h1>Add Medical Record for Pet</h1>


        {/*Very simple form for now*/}        
      <form onSubmit={handleSubmit}>


        <label>Record Type</label>
        <select value={type} onChange={(e) => useType(e.target.value)}>
          <option value="">Select Type</option>
          <option value="vaccination">Vaccination</option>
          <option value="surgery">Surgery</option>
          <option value="checkup">Check-Up</option>
          <option value="Medication">Medication</option>
        </select>

        <label>Description</label>
        <textarea
          value={notes}
          onChange={(e) => useDescription(e.target.value)}
        />


        {/*txt for now can add more later*/}
        <label>Upload File (TXT Only)</label> 
        <input
          type="file"
          accept=".txt"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button type="submit">Save Record</button>
      </form>
    </div>
  );
}

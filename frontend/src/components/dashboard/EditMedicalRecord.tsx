import { useParams, useNavigate } from "react-router-dom";
import { useState, FormEvent } from "react";
import ApiMedical from "../Api/ApiMedRecord";

export default function EditMedicalRecord() {
  const { id, recordId } = useParams();
  const navigate = useNavigate();

  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    await ApiMedical.updateMedRecord(id!, recordId!, {
      type,
      date,
      description
    });

    navigate(`/dashboard/my-pets/${id}`);
  };

  return (
    <div className="add-medical-container">
      <h1>Edit Medical Record</h1>

      <form onSubmit={handleSubmit}>
        <label>Record Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="vaccination">Vaccination</option>
          <option value="surgery">Surgery</option>
          <option value="checkup">Check-Up</option>
          <option value="medication">Medication</option>
        </select>

        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">Update Record</button>
      </form>
    </div>
  );
}
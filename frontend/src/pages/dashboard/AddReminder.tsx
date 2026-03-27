import { useParams, useNavigate } from "react-router-dom";
import { useState, FormEvent } from "react";



export default function AddReminder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [type, useType] = useState<string>("");
  const [date, useDate] = useState<string>("");
  const [description, useDescription] = useState<string>("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // backend not ready
    navigate(`/dashboard/my-pets/${id}`);
  };

  return (
    <div>
      <h1>Add Reminder for Pet</h1>

      {/*Very simple form for now*/}   

      <form onSubmit={handleSubmit}>

        <label>Type</label>

        <select value={type} onChange={(e) => useType(e.target.value)}>

          <option value="">Type of Reminder</option>
          <option value="vaccineshot">Vaccine Shot</option>
          <option value="checkup">Check-Up</option>

        </select>

        <label>Date</label>
        <input type="date" value={date} onChange={(e) => useDate(e.target.value)} />

        <label>Description</label>
        <textarea value={description} onChange={(e) => useDescription(e.target.value)} />

        <button type="submit">Save Reminder</button>
      </form>
    </div>
  );
}


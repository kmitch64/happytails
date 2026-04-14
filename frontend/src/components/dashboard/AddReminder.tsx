import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";


import ApiReminder from "../Api/ApiReminder";


export default function AddReminder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [type, useType] = useState<string>("");
  const [date, useDate] = useState<string>("");
  const [description, useDescription] = useState<string>("");

  const handleSubmit = async (e: React.SubmitEvent) => {


    e.preventDefault();

    const reminderData = {
      type,
      description,
      date,
      frequency: "one-time" // can add dropdown later
    };


    if (!id) return;
    await ApiReminder.createReminder(id, reminderData);




    // backend ready 
    navigate(`/dashboard/my-pets/${id}`);
  };

  return (
    <div className="reminder-form-container">
      <h1>Add Reminder for Pet</h1>

      <form className="reminder-form" onSubmit={handleSubmit} >

        <label>Type</label>

        <select value={type} onChange={(e) => useType(e.target.value)}>

          <option value="">Type of Reminder</option>
          <option value="vaccination">Vaccine Shot</option>
          <option value="medication">Medication</option>
          <option value="appointment">Check-Up / Appointment</option>
          <option value="grooming">Grooming</option>
        </select>

        <label>Date</label>
        <input type="date" value={date} onChange={(e) => useDate(e.target.value)} />

        <label>Description</label>
        <textarea value={description} onChange={(e) => useDescription(e.target.value)} />

        <button type="submit" className="save-btn">Save Reminder</button>
      </form>
    </div>

  );
}


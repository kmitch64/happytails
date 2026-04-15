import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface MedicalRecord {
  _id: string;
  type: string;
  date: string;
  description: string;
}

interface Pet {
  _id: string;
  name: string;
  medicalRecords: MedicalRecord[];
}

interface MedicalRecordWithPet {
  _id: string;
  type: string;
  date: string;
  description: string;
  petName: string;
  petId: string;
}

export default function MedicalRecords() {
  const [records, setRecords] = useState<MedicalRecordWithPet[]>([]);

  useEffect(() => {
    const fetchPets = async () => {
      const res = await fetch('/api/v1/pets/user', { credentials: 'include' });
      const pets: Pet[] = await res.json();

      const all: MedicalRecordWithPet[] = pets.flatMap((pet: Pet) =>
        pet.medicalRecords.map((rec: MedicalRecord) => ({
          _id: rec._id,
          type: rec.type,
          date: rec.date,
          description: rec.description,
          petName: pet.name,
          petId: pet._id
        }))
      );

      setRecords(all);
    };

    fetchPets();
  }, []);

  return (
    <div>
      <h1>Medical Records For All Pets</h1>

      {records.length === 0 ? (
        <p>No medical records found</p>
      ) : (
        <div className="records-grid">
          {records.map(rec => (
            <div key={rec._id} className="record-card">
              <h3>{rec.type.charAt(0).toUpperCase() + rec.type.slice(1)}</h3>

              <p>{rec.description}</p>
              <p><strong>Pet:</strong> {rec.petName}</p>
              <p><strong>Date:</strong> {new Date(rec.date).toLocaleDateString()}</p>

              <Link to={`/dashboard/my-pets/${rec.petId}`} className="view-link">
                View Pet Profile
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
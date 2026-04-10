import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVenusMars, faBirthdayCake, faRuler, faBolt, faBriefcaseMedical,
  faPaw, faHeart, faArrowLeft, faEdit, faTrash, faCalendarAlt,
  faPlus, faVial, faNotesMedical, faClock, faUserFriends
} from '@fortawesome/free-solid-svg-icons';

interface CareReminder {
  _id: string;
  type: string;
  description: string;
  date: string;
  frequency: string;
  completed: boolean;
}

interface Pet {
  _id: string;
  name: string;
  careReminders: CareReminder[];
}

interface ReminderWithPet {
  _id: string;
  type: string;
  description: string;
  date: string;
  frequency: string;
  completed: boolean;
  petName: string;
  petId: string;
}

export default function CareReminders() {
  const [reminders, setReminders] = useState<ReminderWithPet[]>([]);

  useEffect(() => {
    const fetchPets = async () => {
      const res = await fetch('/api/v1/pets', { credentials: 'include' });
      const pets: Pet[] = await res.json();

      const all: ReminderWithPet[] = pets.flatMap((pet: Pet) =>
        pet.careReminders.map((page: CareReminder) => ({
          _id: page._id,
          type: page.type,
          description: page.description,
          date: page.date,
          frequency: page.frequency,
          completed: page.completed,
          petName: pet.name,
          petId: pet._id
        }))
      );

      setReminders(all);
    };

    fetchPets();
  }, []);

  return (
    <div>
      <h1>Care Reminders For All Pets</h1>

      {reminders.length === 0 ? (
        <p>No reminders found</p>
      ) : (
        <div className="reminders-grid">
          {reminders.map(page => (
            <div key={page._id} className="reminder-card">
              <h3>{page.type.charAt(0).toUpperCase() + page.type.slice(1)}</h3>

              <p>{page.description}</p>
              <p><strong>Pet:</strong> {page.petName}</p>
              <p><strong>Due Date:</strong> {new Date(page.date).toLocaleDateString()}</p>

              <Link to={`/dashboard/my-pets/${page.petId}`}>
                View Pet Profile
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



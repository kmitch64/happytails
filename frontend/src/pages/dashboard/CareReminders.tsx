import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVenusMars, faBirthdayCake, faRuler, faBolt, faBriefcaseMedical,
  faPaw, faHeart, faArrowLeft, faEdit, faTrash, faCalendarAlt,
  faPlus, faVial, faNotesMedical, faClock, faUserFriends
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../components/auth/AuthContext';
import PetCarousel from '../../components/PetCarousel/PetCarousel';


export default function CareReminders() {
  return (
    <div>
      <h1>Case Reminders</h1>
      <p>Here you can manage reminders for your pet.</p>
    </div>
  );
}
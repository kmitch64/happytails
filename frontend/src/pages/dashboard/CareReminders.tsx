import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVenusMars, faBirthdayCake, faRuler, faBolt, faBriefcaseMedical,
  faPaw, faHeart, faArrowLeft, faEdit, faTrash, faCalendarAlt,
  faPlus, faVial, faNotesMedical, faClock, faUserFriends
} from '@fortawesome/free-solid-svg-icons';


export default function careReminders() {
  return (
    <div>
      <h1>Care Reminders</h1>
      <p>All reminders go here</p>
      
    </div>
  );
}
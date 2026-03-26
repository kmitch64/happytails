
// components/admin/AdminMenu.tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faPaw, faCalendarAlt, faHome, faUsers, faDog, faCat } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

export default function AdminMenu() {
  const adminMenuItems = [
    {
      icon: faUsers,
      title: 'User Management',
      description: 'View, edit, and create users',
      path: '/dashboard/admin/users',
      color: 'bg-blue-100'
    },
    {
      icon: faPaw,
      title: 'Pet Management',
      description: 'Manage all pets in the system',
      path: '/dashboard/admin/pets',
      color: 'bg-green-100'
    },
    {
      icon: faCalendarAlt,
      title: 'Bookings',
      description: 'View and manage bookings',
      path: '/dashboard/admin/bookings',
      color: 'bg-purple-100'
    },
    {
      icon: faHome,
      title: 'Sitters',
      description: 'Manage pet sitters',
      path: '/dashboard/admin/sitters',
      color: 'bg-yellow-100'
    }
  ];

  return (
    <div className="admin-menu grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {adminMenuItems.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          className={`quick-access-card ${item.color} hover:shadow-lg transition-shadow duration-200`}
        >
          <div className="icon-container">
            <FontAwesomeIcon icon={item.icon} size="2x" />
          </div>
          <div className="card-content">
            <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
            <p className="text-gray-600 text-sm">{item.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
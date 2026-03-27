
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPaw, faCalendarAlt, faHome } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';


export default function AdminMenu() {
  const location = useLocation();

  const adminMenuItems = [
    {
      icon: faUser,
      title: 'User Management',
      description: 'View, edit, and create users',
      path: '/dashboard/admin/users',
    },
    {
      icon: faPaw,
      title: 'Pet Management',
      description: 'Manage all pets in the system',
      path: '/dashboard/admin/pets',
    },
    {
      icon: faCalendarAlt,
      title: 'Bookings',
      description: 'View and manage bookings',
      path: '/dashboard/admin/bookings',
    },
    {
      icon: faHome,
      title: 'Sitters',
      description: 'Manage pet sitters',
      path: '/dashboard/admin/sitters',
    }
  ];

  return (
    <div className="admin-sidebar">
      <div className="admin-menu">
        {adminMenuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`admin-menu-item ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
          >
            <div className="admin-menu-icon">
              <FontAwesomeIcon icon={item.icon} />
            </div>
            <div>
              <h3 className="admin-menu-title">{item.title}</h3>
              <p className="admin-menu-description">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};



import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPaw, faCalendarAlt, faEnvelope, faBell,
  faRobot, faDog, faCat, faHeart, faSearch, faUser, faHome
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

export default function DashboardOverview() {


  // mock datas
  const stats = {
    pets: 2,
    applications: 3,
    reminders: 5,
    messages: 2,
    notifications: 5,
    favorites: 4
  };

  const recentActivity = [
    { id: 1, type: 'application', title: 'Applied to adopt Max', date: '2 days ago', icon: faPaw },
    { id: 2, type: 'reminder', title: 'Fluffy\'s vaccination due in 3 days', date: '1 day ago', icon: faCalendarAlt },
    { id: 3, type: 'message', title: 'New message from Sarah about pet sitting', date: '5 hours ago', icon: faEnvelope },
    { id: 4, type: 'favorite', title: 'Saved Buddy to favorites', date: '1 week ago', icon: faHeart }
  ];

  const quickActions = [
    { id: 1, title: 'Browse Pets', icon: faSearch, link: '/dashboard/adopt' },
    { id: 2, title: 'AI Care Advice', icon: faRobot, link: '/dashboard/ai-assistant' },
    { id: 3, title: 'Find a Sitter', icon: faUser, link: '/dashboard/sitters' },
    { id: 4, title: 'My Pets', icon: faHome, link: '/dashboard/my-pets' }
  ];

  //////////////////////////////////////////////////

  return (
    <div className="dashboard-overview">
      <div className="overview-header">
        <h1>Welcome to Your Dashboard</h1>
        <p>Here's an overview of your activity and quick access to features</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#4CAF50' }}>
            <FontAwesomeIcon icon={faPaw} />
          </div>
          <div className="stat-info">
            <h3>My Pets</h3>
            <p>{stats.pets} pets registered</p>
          </div>
          <Link to="/dashboard/my-pets" className="stat-link">View All</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#2196F3' }}>
            <FontAwesomeIcon icon={faPaw} />
          </div>
          <div className="stat-info">
            <h3>Applications</h3>
            <p>{stats.applications} active applications</p>
          </div>
          <Link to="/dashboard/my-applications" className="stat-link">View All</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#FF9800' }}>
            <FontAwesomeIcon icon={faCalendarAlt} />
          </div>
          <div className="stat-info">
            <h3>Reminders</h3>
            <p>{stats.reminders} upcoming reminders</p>
          </div>
          <Link to="/dashboard/reminders" className="stat-link">View All</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#E91E63' }}>
            <FontAwesomeIcon icon={faEnvelope} />
          </div>
          <div className="stat-info">
            <h3>Messages</h3>
            <p>{stats.messages} unread messages</p>
          </div>
          <Link to="/dashboard/messages" className="stat-link">View All</Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          {quickActions.map(action => (
            <Link key={action.id} to={action.link} className="action-card">
              <div className="action-icon" style={{ backgroundColor: '#4CAF50' }}>
                <FontAwesomeIcon icon={action.icon} />
              </div>
              <h3>{action.title}</h3>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <div className="activity-header">
          <h2>Recent Activity</h2>
          <Link to="/dashboard/activity" className="view-all">View All</Link>
        </div>
        <div className="activity-list">
          {recentActivity.map(activity => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">
                <FontAwesomeIcon icon={activity.icon} />
              </div>
              <div className="activity-info">
                <h4>{activity.title}</h4>
                <p className="activity-date">{activity.date}</p>
              </div>
              {activity.type === 'message' && (
                <div className="activity-status unread"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* AI Assistant Preview */}
      <div className="ai-assistant-preview">
        <div className="preview-header">
          <h2>
            <FontAwesomeIcon icon={faRobot} /> AI Care Assistant
          </h2>
          <Link to="/dashboard/ai-assistant" className="view-all">View All</Link>
        </div>
        <div className="preview-content">
          <p>Your AI Care Assistant is ready to help with:</p>
          <ul>
            <li>Personalized care reminders for your pets</li>
            <li>Health and nutrition advice</li>
            <li>Behavioral tips and training suggestions</li>
            <li>Emergency preparedness guidance</li>
          </ul>
          <Link to="/dashboard/ai-assistant" className="cta-button">Ask the AI</Link>
        </div>
      </div>
    </div>
  );
};

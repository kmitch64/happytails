
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './login.jsx';
import { useAuth } from '../../components/auth/AuthContext';
import { useNavigate } from 'react-router-dom';


jest.mock('../../components/auth/AuthContext');
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('Login Component', () => {
  const mockLogin = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({ login: mockLogin });
    useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login form', () => {
    render(<Login />);
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('updates form data on input change', () => {
    render(<Login />);
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(emailInput, { target: { name: 'email', value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { name: 'password', value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('calls login and navigates to dashboard on successful login', async () => {
    mockLogin.mockResolvedValue({ success: true, requires2FA: false });
    render(<Login />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { name: 'email', value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { name: 'password', value: 'password123' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('shows error message on failed login', async () => {
    mockLogin.mockResolvedValue({ success: false, message: 'Invalid credentials' });
    render(<Login />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { name: 'email', value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { name: 'password', value: 'wrongpassword' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('navigates to 2FA page if requires2FA is true', async () => {
    mockLogin.mockResolvedValue({ success: true, requires2FA: true, userEmail: 'test@example.com' });
    render(<Login />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { name: 'email', value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { name: 'password', value: 'password123' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/2fa', { state: { email: 'test@example.com', from: '/login' } });
    });
  });

  it('disables the submit button while loading', async () => {
    mockLogin.mockImplementation(() => new Promise(() => { }));
    render(<Login />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { name: 'email', value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { name: 'password', value: 'password123' } });
    fireEvent.submit(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });
});

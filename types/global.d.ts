
declare global {


  /*********************************
   * User interface
   *********************************/

  /**
   * Defines a type 
   */
  type userRole = 'PetOwner' | 'PetSitter' | 'ShelterStaff' | 'Admin';

  /**
   * The User interface defines the structure of a user object in the authentication context. It includes properties such as email (string) to store the user's email address, an optional is2FAEnabled (boolean) to indicate whether the user has two-factor authentication enabled, and an index signature [key: string]: any to allow for additional properties that may be added to the user object without causing TypeScript errors. This interface can be extended in the future to include more specific user-related properties as needed.
   */
  interface User {
    username: string;
    firstName?: string;
    lastName?: string;
    email: string;
    is2FAEnabled?: boolean;
    [key: string]: any;
  }

  interface UserFormData {
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    role: userRole;
    password?: string;
    confirmPassword?: string;
  }


  /*********************************
   * Pet interface
   *********************************/
  interface Pet {
    _id: string;
    id: string;
    name: string;
    type?: string;
    breed: string;
    age: string;
    images: { data: string; contentType: string }[];
    status: 'Active' | 'Available' | 'Adopted' | 'Pending' | 'Reserved';
  }

  interface MyPet extends Pet {
    _id: string;
    // id: string;
    // name: string;
    bio: string;
    sex: 'M' | 'F' | 'Unknown';
    // age: string;
    size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
    energyLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
    spayedNeutered: 'Y' | 'N' | 'Unknown';
    compatibility: string[];
    // breed: string;
    // images: string[];
    // status: 'Available' | 'Adopted' | 'Pending' | 'Reserved';
    createdAt: Date;
    updatedAt: Date;
    careReminders: CareReminder[];
    medicalRecords: MedicalRecord[];
  }

  interface PetCarouselProps {
    petId: string;
    images: { data: string; contentType: string }[];
    petName: string;
  }


  interface CareReminder {
    _id: string;
    type: 'vaccination' | 'medication' | 'appointment' | 'grooming';
    description: string;
    date: Date;
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'one-time';
    completed: boolean;
  }

  interface MedicalRecord {
    _id: string;
    type: 'vaccination' | 'surgery' | 'checkup' | 'medication';
    description: string;
    date: Date;
    veterinarian: string;
    notes: string;
  }


  /*********************************
   * Authentication related types
   *********************************/

  /** shortcut type--why not */
  type ReactNode = React.ReactNode;

  /**
   * Defines the shape of the properties expected by the AuthProvider component, which includes a single property 'children' that represents the nested components that will have access to the authentication context provided by AuthProvider.
   */
  interface AuthProviderProps {
    children: ReactNode;
  }

  /**
   * Defines the shape of the response object returned by authentication-related operations, such as login, logout, registration, and 2FA verification. It includes a success property (boolean) to indicate whether the operation was successful and an optional message property (string) to provide additional information about the result of the operation. This interface can be extended for specific operations, such as login, to include additional properties like requires2FA and userEmail when necessary.
   */
  interface AuthResponse {
    success: boolean;
    message: string;
  }

  /**
   * Defines the shape of the response object specifically for the login operation, which extends the general AuthResponse interface. In addition to the success and message properties, it includes an optional requires2FA property (boolean) to indicate whether the user needs to complete two-factor authentication as part of the login process, and an optional userEmail property (string) to provide the email of the user attempting to log in. This allows the frontend to handle login responses more effectively, especially when 2FA is involved.
   */
  interface LoginResponse extends AuthResponse {
    requires2FA?: boolean;
    userEmail?: string;
  }

  /**
   * Defines the shape of the authentication context, including user information, authentication status, loading state, and methods for login, logout, registration, 2FA verification, and 2FA disabling.
   * This context will be used by the AuthProvider to manage authentication state and provide it to the rest of the application.
   */
  interface AuthContextType {
    /**
     * Indicates whether the user is currently logged in. This is a boolean value that can be used to conditionally render components based on the user's authentication status.
     */
    isLoggedIn: boolean;

    /**
     * Contains the authenticated user's information. This can include properties such as email, username, and whether 2FA is enabled. It is null when no user is authenticated.
     */
    user: User | null;

    /**
     * Indicates whether the authentication state is currently being loaded or validated. This can be used to show loading indicators while the app checks the user's session or performs authentication-related operations.
     */
    isLoading: boolean;

    /**
     * Logs in a user with the provided email and password. Returns a promise that resolves to an object indicating success, an optional message, and whether 2FA is required.
     */
    login: (email: string, password: string) => Promise<LoginResponse>;

    /**
     * Logs out the current user by clearing the session on the backend and updating the authentication state. Returns a promise that resolves to an object indicating success and an optional message.
     */
    logout: () => Promise<AuthResponse>;

    /**
     * Registers a new user with the provided username, email, and password. Returns a promise that resolves to an object indicating success and an optional message.
     */
    register: (username: string, email: string, password: string) => Promise<AuthResponse>;

    /**
     * Verifies the 2FA token for a user with the provided email and token. Returns a promise that resolves to an object indicating success and an optional message. This is used during the login process when 2FA is enabled for a user.
     */
    verify2FA: (email: string, token: string) => Promise<AuthResponse>;

    /**
     * Disables 2FA for the currently authenticated user. Returns a promise that resolves to an object indicating success and an optional message. This can be used in the user's account settings to turn off 2FA if they choose to do so.
     */
    disable2FA: () => Promise<AuthResponse>;

  }

}

export { };
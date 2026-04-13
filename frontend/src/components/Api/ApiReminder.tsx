const BASE_URL = import.meta.env.VITE_API_URL;

const createReminder = async (petId: string, reminderData: ReminderData) => {
  return fetch(`${BASE_URL}/api/v1/pets/${petId}/reminders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(reminderData),
  });
};

const FinishReminder = async (petId: string, reminderId: string) => {
  return fetch(`${BASE_URL}/api/v1/pets/${petId}/reminders/${reminderId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ completed: true }),
  });
};

export default {
  createReminder,
  FinishReminder,
};
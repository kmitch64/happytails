const BASE_URL = import.meta.env.VITE_API_URL;

const createMedRecord = async (petId: string, recordData: MedicalRecordData) => {
  return fetch(`${BASE_URL}/api/v1/pets/${petId}/medical-records`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(recordData),
  });
};

const getMedRecord = async (petId: string, recordId: string) => {
  return fetch(`${BASE_URL}/api/v1/pets/${petId}/medical-records/${recordId}`, {
    method: "GET",
    credentials: "include",
  });
};

const updateMedRecord = async (
  petId: string,
  recordId: string,
  recordData: MedicalRecordData
) => {
  return fetch(`${BASE_URL}/api/v1/pets/${petId}/medical-records/${recordId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(recordData),
  });
};

const deleteMedRecord = async (petId: string, recordId: string) => {
  return fetch(`${BASE_URL}/api/v1/pets/${petId}/medical-records/${recordId}`, {
    method: "DELETE",
    credentials: "include",
  });
};

export default {
  createMedRecord,
  getMedRecord,
  updateMedRecord,
  deleteMedRecord,
};
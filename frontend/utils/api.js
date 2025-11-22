// API configuration utility
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = {
  // Scholarships
  getScholarships: () => fetch(`${API_URL}/scholarships`).then(res => res.json()),
  getScholarship: (id) => fetch(`${API_URL}/scholarships/${id}`).then(res => res.json()),
  
  // Resume processing
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetch(`${API_URL}/upload-resume`, {
      method: 'POST',
      body: formData
    }).then(res => res.json());
  },
  
  matchScholarships: (profileJson) => {
    const formData = new FormData();
    formData.append('profile_json', JSON.stringify(profileJson));
    return fetch(`${API_URL}/match-scholarships`, {
      method: 'POST',
      body: formData
    }).then(res => res.json());
  },
  
  // Favorites
  getFavorites: (userId) => fetch(`${API_URL}/favourites/${userId}`).then(res => res.json()),
  saveFavorite: (userId, scholarshipId) => {
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('scholarship_id', scholarshipId);
    return fetch(`${API_URL}/favourites`, {
      method: 'POST',
      body: formData
    }).then(res => res.json());
  },
  removeFavorite: (userId, scholarshipId) => 
    fetch(`${API_URL}/favourites/${userId}/${scholarshipId}`, {
      method: 'DELETE'
    }).then(res => res.json()),
  
  // Deadlines
  getDeadlines: (userId) => fetch(`${API_URL}/deadlines/${userId}`).then(res => res.json())
};

export default api;



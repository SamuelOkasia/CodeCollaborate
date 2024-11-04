// src/utils/api.ts

export const fetchProtectedData = async (): Promise<any> => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('No auth token found');
    }
  
    const response = await fetch('/api/review-sessions', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch protected data');
    }
  
    return response.json();
  };
  
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface FetchOptions extends RequestInit {
  token?: string;
  isFormData?: boolean;
}

export const apiFetch = async (endpoint: string, options: FetchOptions = {}) => {
  const { token, isFormData, headers: customHeaders, ...rest } = options;

  const headers = new Headers(customHeaders);
  
  const resolvedToken = token || (typeof window !== 'undefined' ? localStorage.getItem('access_token') : null);
  
  if (resolvedToken) {
    headers.set('Authorization', `Bearer ${resolvedToken}`);
  }

  // If it's FormData, don't set Content-Type (browser will automatically set it with the correct boundary)
  if (!isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers,
    ...rest,
  });

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    let errorMessage = data?.error?.message || data?.message || 'API Request Failed';
    if (data?.error?.details) {
      errorMessage += ': ' + JSON.stringify(data.error.details);
    }
    throw new Error(errorMessage);
  }

  return data;
};

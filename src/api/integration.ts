/**
 * API Integration Template
 * 
 * This file provides a template for integrating a backend API.
 * Uncomment and customize as needed for your deployment.
 */

const API_BASE: string = (import.meta as unknown as Record<string, Record<string, string>>).env?.VITE_API_URL || 'https://api.rebase.local';

interface SyncPayload {
  userId: string;
  data: Record<string, unknown>;
  timestamp: number;
}

interface SyncResponse {
  success: boolean;
  synced: boolean;
  timestamp: number;
  message?: string;
}

/**
 * Example: Sync local data to backend
 */
export const syncDataToBackend = async (
  userId: string,
  data: Record<string, unknown>
): Promise<SyncResponse> => {
  try {
    const payload: SyncPayload = {
      userId,
      data,
      timestamp: Date.now(),
    };

    const response = await fetch(`${API_BASE}/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Sync error:', error);
    return {
      success: false,
      synced: false,
      timestamp: Date.now(),
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Example: Fetch data from backend
 */
export const fetchDataFromBackend = async (userId: string) => {
  try {
    const response = await fetch(`${API_BASE}/data/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Fetch failed: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
};

/**
 * Example: User authentication
 */
export const authenticate = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const { token, userId } = await response.json();
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_id', userId);

    return { token, userId };
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
};

/**
 * Example: Export data in multiple formats
 */
export const exportData = async (
  userId: string,
  format: 'json' | 'csv' | 'pdf'
) => {
  try {
    const response = await fetch(
      `${API_BASE}/export/${userId}?format=${format}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      }
    );

    if (!response.ok) throw new Error('Export failed');

    return response.blob();
  } catch (error) {
    console.error('Export error:', error);
    return null;
  }
};

/**
 * Integration Points in Your App
 * 
 * 1. After weight input saved:
 *    await syncDataToBackend(userId, { weight, date });
 * 
 * 2. On app startup:
 *    const data = await fetchDataFromBackend(userId);
 * 
 * 3. On login page:
 *    const auth = await authenticate(email, password);
 * 
 * 4. On export button click:
 *    const blob = await exportData(userId, 'csv');
 */

// To enable API integration:
// 1. Create authentication context
// 2. Add API endpoints to your backend
// 3. Implement conflict resolution (local vs remote)
// 4. Add offline queue for failed syncs
// 5. Test thoroughly before production

export const API_INTEGRATION = {
  syncDataToBackend,
  fetchDataFromBackend,
  authenticate,
  exportData,
};

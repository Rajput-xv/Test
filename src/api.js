import { createDirectus, rest, staticToken, readItems, createItem, updateItem, deleteItem } from '@directus/sdk';

// Get environment variables
const TOKEN = process.env.REACT_APP_TOKEN;
const TABLE_NAME = process.env.REACT_APP_TABLE_NAME || 'todo';

// using the Directus server URL for the SDK
const DIRECTUS_URL = process.env.REACT_APP_BASE_URL || 'https://lccia.directus.app';

// Determine if we should use the proxy
const USE_PROXY = process.env.NODE_ENV === 'development';

// Define actual API URL based on environment
const actualApiUrl = USE_PROXY ? '/api' : DIRECTUS_URL;

// Custom transport factory that routes requests through our proxy in development
const customTransport = () => {
  return ({ url, options }) => {
    // In development, rewrite the URL to use our proxy
    if (USE_PROXY) {
      // Extract the path from the full URL
      const originalUrl = new URL(url);
      const path = originalUrl.pathname + originalUrl.search;
      
      // Rewrite to use our proxy
      url = `/api${path}`;
    }
    
    // Make the request
    return fetch(url, options);
  };
};

// Create Directus client with the full URL and custom transport
const client = createDirectus(DIRECTUS_URL)
  .with(staticToken(TOKEN))
  .with(rest({ transport: customTransport() }));

// Get all todos
export const fetchTodos = async () => {
  try {
    // Use the readItems method to fetch data from the Directus API
    const response = await client.request(readItems(TABLE_NAME));
    
    // Validate that response is an array to prevent the rawData.some error
    if (!Array.isArray(response)) {
      console.error('API Response is not an array');
      throw new Error('API response is not in the expected format. Expected an array.');
    }
    
    return response;
  } catch (error) {
    console.error('Error fetching todos:', error);
    
    // Provide more detailed error information
    if (error.message?.includes('Failed to fetch')) {
      console.error('Network error: This could be due to CORS, network connectivity, or server issues');
    } else if (error.message?.includes('not in the expected format')) {
      console.error('Format error: The API responded but not with the expected data format');
      console.error('Please check if the API URL is correct and points to the API endpoint, not the admin interface');
    }
    
    // Fallback to mock data for development
    console.warn('Using fallback mock data');
    return [
      { id: 1, title: 'Mock Todo 1', description: 'This is a mock todo item', status: 'Not Started' },
      { id: 2, title: 'Mock Todo 2', description: 'This is another mock todo item', status: 'In Progress' },
      { id: 3, title: 'Mock Todo 3', description: 'This is a completed mock todo', status: 'Completed' }
    ];
  }
};

// Add a new todo
export const addTodo = async (todo) => {
  try {
    // console.log('Adding todo:', todo);
    const response = await client.request(
      createItem(TABLE_NAME, todo)
    );
    // console.log('Add response:', response);
    return response;
  } catch (error) {
    console.error('Error adding todo:', error);
    // Return mock response for development
    return { ...todo, id: Date.now() };
  }
};

// Update an existing todo
export const updateTodo = async (id, todo) => {
  try {
    // console.log('Updating todo:', id, todo);
    const response = await client.request(
      updateItem(TABLE_NAME, id, todo)
    );
    // console.log('Update response:', response);
    return response;
  } catch (error) {
    console.error(`Error updating todo ${id}:`, error);
    // Return mock response for development
    return { ...todo, id };
  }
};

// Delete a todo
export const deleteTodo = async (id) => {
  try {
    // console.log('Deleting todo:', id);
    const response = await client.request(
      deleteItem(TABLE_NAME, id)
    );
    // console.log('Delete response:', response);
    return response;
  } catch (error) {
    console.error(`Error deleting todo ${id}:`, error);
    // Return mock success for development
    return { success: true };
  }
};
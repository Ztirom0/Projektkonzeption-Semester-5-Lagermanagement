const BASE_URL = "/api";

export const getInventoryStatus = async (itemId) => {
  try {
    const response = await fetch(`${BASE_URL}/inventory/status/${itemId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching inventory status for item ${itemId}:`, error);
    throw error;
  }
};

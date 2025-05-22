
/**
 * Google Services Utility
 * Provides functions for interacting with Google Sheets and Google Drive APIs
 */

// Helper to get configuration from localStorage
const getConfig = () => {
  return {
    dbType: localStorage.getItem('db_type') || 'google_sheets',
    oauthToken: localStorage.getItem('google_oauth_token') || null,
    sheets: {
      apiKey: localStorage.getItem('sheets_api_key') || '',
      spreadsheetId: localStorage.getItem('sheets_spreadsheet_id') || '',
    },
    drive: {
      apiKey: localStorage.getItem('drive_api_key') || '',
      folderId: localStorage.getItem('drive_folder_id') || '',
    }
  };
};

// Check if Google Sheets is configured
export const isSheetsConfigured = (): boolean => {
  const config = getConfig();
  return !!(
    (config.sheets.apiKey && config.sheets.spreadsheetId) || 
    config.oauthToken
  );
};

// Check if Google Drive is configured
export const isDriveConfigured = (): boolean => {
  const config = getConfig();
  return !!(
    (config.drive.apiKey && config.drive.folderId) || 
    config.oauthToken
  );
};

// Check if authenticated with Google OAuth
export const isGoogleAuthenticated = (): boolean => {
  return !!localStorage.getItem('google_oauth_token');
};

// Check if using Supabase as database
export const isUsingSupabase = (): boolean => {
  return localStorage.getItem('db_type') === 'supabase';
};

// Sheet names for different data
export const SHEETS = {
  PRODUCTS: 'Produtos',
  STAMP_TYPES: 'TiposEstampa',
  FAILURE_TYPES: 'TiposFalha',
  EMPLOYEES: 'Funcionarios',
  PRINTS: 'Impressoes',
  FAILURES: 'Falhas',
  SEWING: 'Costuras',
  SALES: 'Vendas',
  SHIPPING: 'Envios',
  ORDERS: 'OrdensProducao',
};

// Generic function to fetch data from a Google Sheet
export const fetchSheetData = async (sheetName: string): Promise<any[]> => {
  const config = getConfig();
  
  if (!isSheetsConfigured()) {
    throw new Error('Google Sheets não configurado. Por favor, configure nas Configurações.');
  }

  try {
    let url = '';
    let headers: HeadersInit = {};
    
    if (config.oauthToken) {
      // Use OAuth token if available
      url = `https://sheets.googleapis.com/v4/spreadsheets/${config.sheets.spreadsheetId}/values/${sheetName}`;
      headers = {
        'Authorization': `Bearer ${config.oauthToken}`
      };
    } else {
      // Fall back to API key
      url = `https://sheets.googleapis.com/v4/spreadsheets/${config.sheets.spreadsheetId}/values/${sheetName}?key=${config.sheets.apiKey}`;
    }
    
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar dados da planilha: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Convert sheet data to array of objects with header row as keys
    if (data.values && data.values.length >= 2) {
      const headers = data.values[0];
      return data.values.slice(1).map((row: any[]) => {
        const obj: Record<string, any> = {};
        headers.forEach((header: string, index: number) => {
          obj[header] = row[index] || '';
        });
        return obj;
      });
    }
    
    return [];
  } catch (error) {
    console.error('Erro ao buscar dados do Google Sheets:', error);
    throw error;
  }
};

// Generic function to append data to a Google Sheet
export const appendToSheet = async (sheetName: string, values: any[]): Promise<any> => {
  const config = getConfig();
  
  if (!isSheetsConfigured()) {
    throw new Error('Google Sheets não configurado. Por favor, configure nas Configurações.');
  }

  try {
    let url = '';
    let headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (config.oauthToken) {
      // Use OAuth token if available
      url = `https://sheets.googleapis.com/v4/spreadsheets/${config.sheets.spreadsheetId}/values/${sheetName}:append?valueInputOption=USER_ENTERED`;
      headers['Authorization'] = `Bearer ${config.oauthToken}`;
    } else {
      // Fall back to API key
      url = `https://sheets.googleapis.com/v4/spreadsheets/${config.sheets.spreadsheetId}/values/${sheetName}:append?valueInputOption=USER_ENTERED&key=${config.sheets.apiKey}`;
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        values: [values],
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao adicionar dados à planilha: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao adicionar dados ao Google Sheets:', error);
    throw error;
  }
};

// Function to upload an image to Google Drive
export const uploadImageToDrive = async (file: File): Promise<string> => {
  const config = getConfig();
  
  if (!isDriveConfigured()) {
    throw new Error('Google Drive não configurado. Por favor, configure nas Configurações.');
  }

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('parents', config.drive.folderId);
    
    let url = '';
    let headers: HeadersInit = {};
    
    if (config.oauthToken) {
      // Use OAuth token if available
      url = `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`;
      headers = {
        'Authorization': `Bearer ${config.oauthToken}`
      };
    } else {
      // Fall back to API key
      url = `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&key=${config.drive.apiKey}`;
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao fazer upload da imagem: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.id; // Return the file ID
  } catch (error) {
    console.error('Erro ao fazer upload para o Google Drive:', error);
    throw error;
  }
};

// Helper to get image URL from Google Drive file ID
export const getImageUrl = (fileId: string): string => {
  const config = getConfig();
  if (config.oauthToken) {
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  } else {
    return `https://drive.google.com/uc?export=view&id=${fileId}&key=${config.drive.apiKey}`;
  }
};

// Add Supabase related functionality here when needed
export const initializeSupabaseClient = () => {
  // This would be implemented when Supabase integration is added
  console.log("Supabase client would be initialized here");
};

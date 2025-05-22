
import { gapi } from 'gapi-script';

// This would come from environment variables in a real app
const API_KEY = 'YOUR_API_KEY';
const DISCOVERY_DOCS = ['https://sheets.googleapis.com/$discovery/rest?version=v4'];
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';

// Sheet names for different data
const SHEETS = {
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

export const initializeGoogleApi = async () => {
  return new Promise((resolve, reject) => {
    gapi.load('client', async () => {
      try {
        await gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: DISCOVERY_DOCS,
        });
        resolve(true);
      } catch (error) {
        console.error('Error initializing Google API', error);
        reject(error);
      }
    });
  });
};

// Generic function to get data from a specific sheet
export const getSheetData = async (sheetName: string) => {
  await initializeGoogleApi();
  
  try {
    const response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A2:Z`,
    });
    
    return response.result.values || [];
  } catch (error) {
    console.error(`Error fetching ${sheetName} data:`, error);
    throw error;
  }
};

// Generic function to append data to a specific sheet
export const appendToSheet = async (sheetName: string, values: any[]) => {
  await initializeGoogleApi();
  
  try {
    const response = await gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A2:Z`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [values],
      },
    });
    
    return response.result;
  } catch (error) {
    console.error(`Error appending to ${sheetName}:`, error);
    throw error;
  }
};

// Generic function to update data in a specific sheet
export const updateSheetData = async (sheetName: string, range: string, values: any[][]) => {
  await initializeGoogleApi();
  
  try {
    const response = await gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!${range}`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: values,
      },
    });
    
    return response.result;
  } catch (error) {
    console.error(`Error updating ${sheetName}:`, error);
    throw error;
  }
};

// Specific product functions
export const getProducts = async () => {
  return getSheetData(SHEETS.PRODUCTS);
};

export const addProduct = async (product: any[]) => {
  return appendToSheet(SHEETS.PRODUCTS, product);
};

// Specific stamp type functions
export const getStampTypes = async () => {
  return getSheetData(SHEETS.STAMP_TYPES);
};

export const addStampType = async (stampType: any[]) => {
  return appendToSheet(SHEETS.STAMP_TYPES, stampType);
};

// Specific failure type functions
export const getFailureTypes = async () => {
  return getSheetData(SHEETS.FAILURE_TYPES);
};

export const addFailureType = async (failureType: any[]) => {
  return appendToSheet(SHEETS.FAILURE_TYPES, failureType);
};

// Specific employee functions
export const getEmployees = async () => {
  return getSheetData(SHEETS.EMPLOYEES);
};

export const addEmployee = async (employee: any[]) => {
  return appendToSheet(SHEETS.EMPLOYEES, employee);
};

// Specific prints functions
export const getPrintEntries = async () => {
  return getSheetData(SHEETS.PRINTS);
};

export const addPrintEntry = async (printEntry: any[]) => {
  return appendToSheet(SHEETS.PRINTS, printEntry);
};

// Specific failures functions
export const getFailureEntries = async () => {
  return getSheetData(SHEETS.FAILURES);
};

export const addFailureEntry = async (failureEntry: any[]) => {
  return appendToSheet(SHEETS.FAILURES, failureEntry);
};

// Specific sewing functions
export const getSewingEntries = async () => {
  return getSheetData(SHEETS.SEWING);
};

export const addSewingEntry = async (sewingEntry: any[]) => {
  return appendToSheet(SHEETS.SEWING, sewingEntry);
};

// Specific sales functions
export const getSaleEntries = async () => {
  return getSheetData(SHEETS.SALES);
};

export const addSaleEntry = async (saleEntry: any[]) => {
  return appendToSheet(SHEETS.SALES, saleEntry);
};

// Specific shipping functions
export const getShippingEntries = async () => {
  return getSheetData(SHEETS.SHIPPING);
};

export const addShippingEntry = async (shippingEntry: any[]) => {
  return appendToSheet(SHEETS.SHIPPING, shippingEntry);
};

// Specific order functions
export const getProductionOrders = async () => {
  return getSheetData(SHEETS.ORDERS);
};

export const addProductionOrder = async (productionOrder: any[]) => {
  return appendToSheet(SHEETS.ORDERS, productionOrder);
};

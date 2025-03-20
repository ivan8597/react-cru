export interface Document {
  id: string;
  companySigDate: string;
  companySignatureName: string;
  documentName: string;
  documentStatus: string;
  documentType: string;
  employeeNumber: string;
  employeeSigDate: string;
  employeeSignatureName: string;
}

export interface DocumentsState {
  items: Document[];
  loading: boolean;
  error: string | null;
  currentOperation: 'fetch' | 'create' | 'update' | 'delete' | null;
}

export type DocumentFormData = Omit<Document, 'id'>; 
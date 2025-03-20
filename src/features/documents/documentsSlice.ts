import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDocuments, createDocument, updateDocument, deleteDocument } from '../../api';
import { Document, DocumentsState, DocumentFormData } from '../../types/documents';

export type DocumentItem = Document;

const initialState: DocumentsState = {
  items: [],
  loading: false,
  error: null,
  currentOperation: null,
};

// Получение списка документов
export const fetchDocuments = createAsyncThunk(
  'documents/fetch',
  async () => {
    const response = await getDocuments();
    return response.data.data as DocumentItem[];
  }
);

// Создание нового документа
export const createNewDocument = createAsyncThunk(
  'documents/create',
  async (documentData: DocumentFormData) => {
    const response = await createDocument(documentData);
    return response.data.data as DocumentItem;
  }
);

// Обновление документа
export const updateExistingDocument = createAsyncThunk(
  'documents/update',
  async ({ id, data }: { id: string; data: DocumentFormData }) => {
    const response = await updateDocument(id, data);
    return response.data.data as DocumentItem;
  }
);

// Удаление документа
export const removeDocument = createAsyncThunk(
  'documents/delete',
  async (id: string) => {
    await deleteDocument(id);
    return id;
  }
);

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Обработчики для получения документов
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentOperation = 'fetch';
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
        state.error = null;
        state.currentOperation = null;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.items = [];
        state.error = action.error.message || 'Не удалось получить документы';
        state.currentOperation = null;
      })
      
      // Обработчики для создания документа
      .addCase(createNewDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentOperation = 'create';
      })
      .addCase(createNewDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.items = [...state.items, action.payload];
        state.error = null;
        state.currentOperation = null;
      })
      .addCase(createNewDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Не удалось создать документ';
        state.currentOperation = null;
      })
      
      // Обработчики для обновления документа
      .addCase(updateExistingDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentOperation = 'update';
      })
      .addCase(updateExistingDocument.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items = [
            ...state.items.slice(0, index),
            action.payload,
            ...state.items.slice(index + 1)
          ];
        }
        state.error = null;
        state.currentOperation = null;
      })
      .addCase(updateExistingDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Не удалось обновить документ';
        state.currentOperation = null;
      })
      
      // Обработчики для удаления документа
      .addCase(removeDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentOperation = 'delete';
      })
      .addCase(removeDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        state.error = null;
        state.currentOperation = null;
      })
      .addCase(removeDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Не удалось удалить документ';
        state.currentOperation = null;
      });
  },
});

export default documentsSlice.reducer;
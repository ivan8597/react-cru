import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDocuments } from '../../api';


export interface DocumentItem {
  id: string;
  documentName: string;
  documentStatus: string;
  documentType: string;
 
}

export interface DocumentsState {
  items: DocumentItem[];
  loading: boolean;
  error: string | null;
}

const initialState: DocumentsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchDocuments = createAsyncThunk(
  'documents/fetch',
  async () => {
    const response = await getDocuments();
    return response.data.data as DocumentItem[];
  }
);



const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
        state.error = null;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.items = [];
        state.error = action.error.message || 'Не удалось получить документы';
      });
   
  },
});

export default documentsSlice.reducer;
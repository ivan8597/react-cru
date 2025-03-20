import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { login } from '../../api';


export interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
}


const savedToken = localStorage.getItem('auth_token');

const initialState: AuthState = {
  token: savedToken,
  loading: false,
  error: null,
};


export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ username, password }: { username: string; password: string }) => {
    try {
    
      const cleanUsername = username.trim();
      
      const response = await login(cleanUsername, password);
      console.log('Логин:', response);
      
      const data = response.data;
      
      if (data.error_code) {
        throw new Error(data.error_text || 'Ошибка авторизации');
      }
      
      const token = data.data?.token;
      
      if (!token) {
        throw new Error('Токен не найден в ответе сервера');
      }

      localStorage.setItem('auth_token', token);
      
      return token;
    } catch (error) {
      console.error('Ошибка авторизации:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Произошла ошибка входа');
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.error = null;
      localStorage.removeItem('auth_token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.token = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.token = null;
        state.error = action.error.message || 'Не удалось войти';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
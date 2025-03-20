import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  TextField, 
  Button, 
  CircularProgress, 
  Alert, 
  Container, 
  Paper, 
  Typography,
  Box
} from '@mui/material';
import { loginUser, AuthState } from '../features/auth/authSlice';
import { RootState } from '../store';
import { UnknownAction, ThunkDispatch } from '@reduxjs/toolkit';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, UnknownAction>>();
  const auth = useSelector<RootState, AuthState>((state) => state.auth);
  
  const validateForm = (): boolean => {
    const usernameRegex = /^user\d+$/;
    if (!usernameRegex.test(username.trim())) {
      setValidationError('Логин должен быть в формате user1, user2, user3...');
      return false;
    }
    if (password !== 'password') {
      setValidationError('Неверный пароль');
      return false;
    }
    setValidationError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(loginUser({ username, password }));
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Вход в систему
          </Typography>
          
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            {(validationError || auth.error) && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {validationError || auth.error}
              </Alert>
            )}
            
            <TextField
              label="Имя пользователя"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setValidationError('');
              }}
              fullWidth
              margin="normal"
              required
              error={!!validationError && validationError.includes('Логин')}
              helperText="Формат: user1, user2, user3... (например: user1)"
            />
            
            <TextField
              label="Пароль"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setValidationError('');
              }}
              fullWidth
              margin="normal"
              required
              error={!!validationError && validationError.includes('пароль')}
              helperText="Используйте: password"
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={auth.loading}
              endIcon={auth.loading ? <CircularProgress size={20} /> : null}
            >
              {auth.loading ? 'Вход...' : 'Войти'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
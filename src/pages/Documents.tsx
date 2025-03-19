import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, CircularProgress } from '@mui/material';
import { fetchDocuments, DocumentItem, DocumentsState } from '../features/documents/documentsSlice';
import { RootState } from '../store';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { AuthState } from '../features/auth/authSlice';

const Documents: React.FC = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  
  const auth = useSelector<RootState, AuthState>((state) => state.auth);
  const documents = useSelector<RootState, DocumentsState>((state) => state.documents);

  useEffect(() => {
    if (auth.token) {
      console.log('Запрос документов с токеном в localStorage');
      dispatch(fetchDocuments());
    } else {
      console.log('Токен не доступен');
    }
  }, [dispatch, auth.token]);

  if (documents.loading) {
    return <CircularProgress />;
  }

  if (documents.error) {
    return <div>Ошибка: {documents.error}</div>;
  }

  const items = documents.items || [];

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Название документа</TableCell>
          <TableCell>Статус</TableCell>
          <TableCell>Тип</TableCell>
          <TableCell>Действия</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((doc: DocumentItem) => (
          <TableRow key={doc.id}>
            <TableCell>{doc.documentName}</TableCell>
            <TableCell>{doc.documentStatus}</TableCell>
            <TableCell>{doc.documentType}</TableCell>
            <TableCell>
              <Button>Редактировать</Button>
              <Button>Удалить</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Documents;
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  Button, 
  CircularProgress,
  Alert,
  Box,
  Container,
  Typography,
  Snackbar,
  TablePagination,
  TableSortLabel
} from '@mui/material';
import { 
  fetchDocuments, 
  createNewDocument,
  updateExistingDocument,
  removeDocument
} from '../features/documents/documentsSlice';
import { Document, DocumentsState} from '../types/documents';
import { RootState } from '../store';
import { UnknownAction, ThunkDispatch } from '@reduxjs/toolkit';
import { AuthState } from '../features/auth/authSlice';
import { formatDate } from '../utils/dateUtils';
import { DeleteConfirmationDialog } from '../components/DeleteConfirmationDialog';
import { DocumentFormDialog } from '../components/DocumentFormDialog';

const Documents = () => {
 
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [documentData, setDocumentData] = useState({
    documentName: '',
    documentStatus: '',
    documentType: '',
    employeeNumber: '',
    employeeSigDate: '',
    employeeSignatureName: '',
    companySigDate: '',
    companySignatureName: ''
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState<keyof Document>('documentName');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, UnknownAction>>();
  const auth = useSelector<RootState, AuthState>((state) => state.auth);
  const documents = useSelector<RootState, DocumentsState>((state) => state.documents);

  useEffect(() => {
    if (auth.token) {
      dispatch(fetchDocuments());
    }
  }, [dispatch, auth.token]);

  const validateForm = () => {
    if (!documentData.documentName.trim()) {
      setValidationError('Название документа обязательно');
      return false;
    }
    if (!documentData.documentType.trim()) {
      setValidationError('Тип документа обязателен');
      return false;
    }
    if (!documentData.documentStatus.trim()) {
      setValidationError('Статус документа обязателен');
      return false;
    }
    if (!documentData.employeeSigDate) {
      setValidationError('Дата подписи сотрудника обязательна');
      return false;
    }
    if (!documentData.companySigDate) {
      setValidationError('Дата подписи компании обязательна');
      return false;
    }
    return true;
  };

  const handleEdit = (doc: Document) => {
    setSelectedDocument(doc);
    setDocumentData({
      documentName: doc.documentName,
      documentStatus: doc.documentStatus,
      documentType: doc.documentType,
      employeeNumber: doc.employeeNumber,
      employeeSigDate: formatDate(doc.employeeSigDate),
      employeeSignatureName: doc.employeeSignatureName,
      companySigDate: formatDate(doc.companySigDate),
      companySignatureName: doc.companySignatureName
    });
    setValidationError('');
    setIsEditDialogOpen(true);
  };

  const handleDelete = (doc: Document) => {
    setSelectedDocument(doc);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      if (selectedDocument) {
        await dispatch(updateExistingDocument({ 
          id: selectedDocument.id, 
          data: documentData 
        }));
        setSuccessMessage('Документ успешно обновлен');
      } else {
        await dispatch(createNewDocument(documentData));
        setSuccessMessage('Документ успешно создан');
      }
      setIsEditDialogOpen(false);
      setSelectedDocument(null);
      setDocumentData({
        documentName: '',
        documentStatus: '',
        documentType: '',
        employeeNumber: '',
        employeeSigDate: '',
        employeeSignatureName: '',
        companySigDate: '',
        companySignatureName: ''
      });
    } catch (error) {
      setValidationError('Произошла ошибка при сохранении документа');
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedDocument) {
      try {
        await dispatch(removeDocument(selectedDocument.id));
        setSuccessMessage('Документ успешно удален');
        setIsDeleteDialogOpen(false);
        setSelectedDocument(null);
      } catch (error) {
        setValidationError('Произошла ошибка при удалении документа');
      }
    }
  };

  const handleChangePage = (e: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleSort = (property: keyof Document) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedItems = useMemo(() => {
    const validItems = (documents.items || []).filter(Boolean);
    const comparator = (a: Document, b: Document) => {
      if (!a || !b) return 0;
      if (order === 'asc') {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return b[orderBy] < a[orderBy] ? -1 : 1;
      }
    };
    return [...validItems].sort(comparator);
  }, [documents.items, order, orderBy]);

  if (documents.loading && documents.currentOperation === 'fetch') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      {documents.error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          action={
            <Button 
              color="inherit" 
              size="small"
              onClick={() => dispatch(fetchDocuments())}
            >
              Повторить загрузку
            </Button>
          }
        >
          {documents.error}
        </Alert>
      )}

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Документы</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => {
            setSelectedDocument(null);
            setDocumentData({
              documentName: '',
              documentStatus: '',
              documentType: '',
              employeeNumber: '',
              employeeSigDate: '',
              employeeSignatureName: '',
              companySigDate: '',
              companySignatureName: ''
            });
            setValidationError('');
            setIsEditDialogOpen(true);
          }}
        >
          Создать документ
        </Button>
      </Box>

      <Box position="relative">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'documentName'}
                  direction={orderBy === 'documentName' ? order : 'asc'}
                  onClick={() => handleSort('documentName')}
                >
                  Название документа
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'documentStatus'}
                  direction={orderBy === 'documentStatus' ? order : 'asc'}
                  onClick={() => handleSort('documentStatus')}
                >
                  Статус
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'documentType'}
                  direction={orderBy === 'documentType' ? order : 'asc'}
                  onClick={() => handleSort('documentType')}
                >
                  Тип
                </TableSortLabel>
              </TableCell>
              <TableCell>Номер сотрудника</TableCell>
              <TableCell>Подпись сотрудника</TableCell>
              <TableCell>Подпись компании</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedItems
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((doc: Document) => (
              <TableRow key={doc.id}>
                <TableCell>{doc.documentName}</TableCell>
                <TableCell>{doc.documentStatus}</TableCell>
                <TableCell>{doc.documentType}</TableCell>
                <TableCell>{doc.employeeNumber}</TableCell>
                <TableCell>
                  {doc.employeeSignatureName}<br />
                  {formatDate(doc.employeeSigDate)}
                </TableCell>
                <TableCell>
                  {doc.companySignatureName}<br />
                  {formatDate(doc.companySigDate)}
                </TableCell>
                <TableCell>
                  <Button 
                    onClick={() => handleEdit(doc)} 
                    color="primary"
                    disabled={documents.loading}
                  >
                    Редактировать
                  </Button>
                  <Button 
                    onClick={() => handleDelete(doc)} 
                    color="error"
                    disabled={documents.loading}
                  >
                    Удалить
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {documents.loading && (
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
            bgcolor="rgba(255, 255, 255, 0.7)"
            zIndex={1}
          >
            <CircularProgress />
          </Box>
        )}
      </Box>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={sortedItems.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Строк на странице:"
        labelDisplayedRows={({ from, to, count }) => 
          `${from}-${to} из ${count}`
        }
      />

      <DocumentFormDialog
        open={isEditDialogOpen}
        loading={documents.loading}
        selectedDocument={selectedDocument}
        documentData={documentData}
        validationError={validationError}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleSave}
        onDataChange={setDocumentData}
        onValidationErrorChange={setValidationError}
      />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        loading={documents.loading}
        documentName={selectedDocument?.documentName || ''}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccessMessage('')} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Documents;
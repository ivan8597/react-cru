import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  CircularProgress,
  TextField,
  Alert
} from '@mui/material';
import { Document, DocumentFormData } from '../types/documents';

interface DocumentFormDialogProps {
  open: boolean;
  loading: boolean;
  selectedDocument: Document | null;
  documentData: DocumentFormData;
  validationError: string;
  onClose: () => void;
  onSave: () => void;
  onDataChange: (data: DocumentFormData) => void;
  onValidationErrorChange: (error: string) => void;
}

export const DocumentFormDialog: React.FC<DocumentFormDialogProps> = ({
  open,
  loading,
  selectedDocument,
  documentData,
  validationError,
  onClose,
  onSave,
  onDataChange,
  onValidationErrorChange
}) => {
  const handleFieldChange = (field: keyof DocumentFormData, value: string) => {
    onDataChange({ ...documentData, [field]: value });
    onValidationErrorChange('');
  };

  return (
    <Dialog 
      open={open} 
      onClose={() => {
        if (!loading) {
          onClose();
          onValidationErrorChange('');
        }
      }}
      maxWidth="sm"
      fullWidth
      disableRestoreFocus
    >
      <DialogTitle>
        {selectedDocument ? 'Редактировать документ' : 'Создать документ'}
      </DialogTitle>
      <DialogContent>
        {validationError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {validationError}
          </Alert>
        )}
        
        <TextField
          fullWidth
          margin="normal"
          label="Название документа"
          value={documentData.documentName}
          onChange={(e) => handleFieldChange('documentName', e.target.value)}
          required
          error={validationError.includes('Название документа')}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Статус"
          value={documentData.documentStatus}
          onChange={(e) => handleFieldChange('documentStatus', e.target.value)}
          required
          error={validationError.includes('Статус документа')}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Тип"
          value={documentData.documentType}
          onChange={(e) => handleFieldChange('documentType', e.target.value)}
          required
          error={validationError.includes('Тип документа')}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Номер сотрудника"
          value={documentData.employeeNumber}
          onChange={(e) => handleFieldChange('employeeNumber', e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Дата подписи сотрудника"
          type="date"
          value={documentData.employeeSigDate}
          onChange={(e) => handleFieldChange('employeeSigDate', e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          required
          error={validationError.includes('Дата подписи сотрудника')}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Имя подписавшего сотрудника"
          value={documentData.employeeSignatureName}
          onChange={(e) => handleFieldChange('employeeSignatureName', e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Дата подписи компании"
          type="date"
          value={documentData.companySigDate}
          onChange={(e) => handleFieldChange('companySigDate', e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          required
          error={validationError.includes('Дата подписи компании')}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Имя подписавшего от компании"
          value={documentData.companySignatureName}
          onChange={(e) => handleFieldChange('companySignatureName', e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={() => {
            onClose();
            onValidationErrorChange('');
          }}
          disabled={loading}
        >
          Отмена
        </Button>
        <Button 
          onClick={onSave} 
          color="primary"
          disabled={loading}
        >
          {loading ? (
            <Box display="flex" alignItems="center">
              Сохранение... <CircularProgress size={20} sx={{ ml: 1 }} />
            </Box>
          ) : 'Сохранить'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 
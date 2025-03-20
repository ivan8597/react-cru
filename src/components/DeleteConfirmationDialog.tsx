import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  CircularProgress
} from '@mui/material';

interface DeleteConfirmationDialogProps {
  open: boolean;
  loading: boolean;
  documentName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  loading,
  documentName,
  onClose,
  onConfirm
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={() => !loading && onClose()}
      disableRestoreFocus
    >
      <DialogTitle>Подтвердите удаление</DialogTitle>
      <DialogContent>
        Вы действительно хотите удалить документ "{documentName}"?
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose}
          disabled={loading}
        >
          Отмена
        </Button>
        <Button 
          onClick={onConfirm} 
          color="error"
          disabled={loading}
        >
          {loading ? (
            <Box display="flex" alignItems="center">
              Удаление... <CircularProgress size={20} sx={{ ml: 1 }} />
            </Box>
          ) : 'Удалить'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 
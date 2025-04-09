import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import { format } from 'date-fns';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

enum DocumentType {
  DELIVERY = 'delivery',
  TRANSFER = 'transfer',
  WRITE_OFF = 'write_off',
  REVISION = 'revision',
  SALE = 'sale',
  RETURN = 'return',
}

enum DocumentStatus {
  DRAFT = 'draft',
  CONFIRMED = 'confirmed',
  CANCELED = 'canceled',
}

interface Document {
  id: string;
  number: string;
  date: string;
  type: DocumentType;
  status: DocumentStatus;
  location: {
    id: string;
    name: string;
  };
  targetLocation?: {
    id: string;
    name: string;
  };
  totalAmount: number;
}

interface DocumentsListProps {
  items: Document[];
}

const DocumentsList: React.FC<DocumentsListProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body1" color="textSecondary">
          Няма документи за показване
        </Typography>
      </Box>
    );
  }

  const getDocumentTypeLabel = (type: DocumentType): string => {
    switch (type) {
      case DocumentType.DELIVERY:
        return 'Доставка';
      case DocumentType.TRANSFER:
        return 'Трансфер';
      case DocumentType.WRITE_OFF:
        return 'Отписване';
      case DocumentType.REVISION:
        return 'Ревизия';
      case DocumentType.SALE:
        return 'Продажба';
      case DocumentType.RETURN:
        return 'Връщане';
      default:
        return type;
    }
  };

  const getStatusChip = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.DRAFT:
        return <Chip size="small" label="Чернова" color="default" />;
      case DocumentStatus.CONFIRMED:
        return <Chip size="small" label="Потвърден" color="success" />;
      case DocumentStatus.CANCELED:
        return <Chip size="small" label="Анулиран" color="error" />;
      default:
        return null;
    }
  };

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Номер</TableCell>
            <TableCell>Дата</TableCell>
            <TableCell>Тип</TableCell>
            <TableCell>Обект</TableCell>
            <TableCell>Сума</TableCell>
            <TableCell>Статус</TableCell>
            <TableCell align="right">Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell>{doc.number}</TableCell>
              <TableCell>{format(new Date(doc.date), 'dd.MM.yyyy')}</TableCell>
              <TableCell>{getDocumentTypeLabel(doc.type)}</TableCell>
              <TableCell>
                {doc.location.name}
                {doc.targetLocation && ` → ${doc.targetLocation.name}`}
              </TableCell>
              <TableCell align="right">{doc.totalAmount.toFixed(2)} лв.</TableCell>
              <TableCell>{getStatusChip(doc.status)}</TableCell>
              <TableCell align="right">
                <IconButton size="small" title="Преглед">
                  <VisibilityIcon fontSize="small" />
                </IconButton>
                
                {doc.status === DocumentStatus.DRAFT && (
                  <>
                    <IconButton size="small" color="success" title="Потвърди">
                      <CheckCircleIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" title="Анулирай">
                      <CancelIcon fontSize="small" />
                    </IconButton>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DocumentsList; 
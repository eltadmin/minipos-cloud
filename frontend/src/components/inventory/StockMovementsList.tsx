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
} from '@mui/material';
import { format } from 'date-fns';

enum MovementType {
  IN = 'in',
  OUT = 'out',
  ADJUSTMENT = 'adjustment',
}

interface StockMovement {
  id: string;
  type: MovementType;
  quantity: number;
  unitPrice?: number;
  createdAt: string;
  product: {
    id: string;
    name: string;
  };
  location: {
    id: string;
    name: string;
  };
  document?: {
    id: string;
    number: string;
  };
  notes?: string;
}

interface StockMovementsListProps {
  items: StockMovement[];
}

const StockMovementsList: React.FC<StockMovementsListProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body1" color="textSecondary">
          Няма движения за показване
        </Typography>
      </Box>
    );
  }

  const getMovementTypeChip = (type: MovementType) => {
    switch (type) {
      case MovementType.IN:
        return <Chip size="small" label="Вход" color="success" />;
      case MovementType.OUT:
        return <Chip size="small" label="Изход" color="error" />;
      case MovementType.ADJUSTMENT:
        return <Chip size="small" label="Корекция" color="warning" />;
      default:
        return null;
    }
  };

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Дата</TableCell>
            <TableCell>Артикул</TableCell>
            <TableCell>Обект</TableCell>
            <TableCell>Тип</TableCell>
            <TableCell align="right">Количество</TableCell>
            <TableCell align="right">Ед. цена</TableCell>
            <TableCell>Документ</TableCell>
            <TableCell>Бележки</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((movement) => (
            <TableRow key={movement.id}>
              <TableCell>{format(new Date(movement.createdAt), 'dd.MM.yyyy HH:mm')}</TableCell>
              <TableCell>{movement.product.name}</TableCell>
              <TableCell>{movement.location.name}</TableCell>
              <TableCell>{getMovementTypeChip(movement.type)}</TableCell>
              <TableCell align="right">{movement.quantity.toFixed(3)}</TableCell>
              <TableCell align="right">
                {movement.unitPrice ? `${movement.unitPrice.toFixed(2)} лв.` : '-'}
              </TableCell>
              <TableCell>{movement.document?.number || '-'}</TableCell>
              <TableCell>{movement.notes || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StockMovementsList; 
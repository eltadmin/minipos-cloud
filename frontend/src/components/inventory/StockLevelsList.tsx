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
} from '@mui/material';

interface StockLevel {
  id: string;
  product: {
    id: string;
    name: string;
  };
  location: {
    id: string;
    name: string;
  };
  quantity: number;
  costPrice: number;
}

interface StockLevelsListProps {
  items: StockLevel[];
}

const StockLevelsList: React.FC<StockLevelsListProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body1" color="textSecondary">
          Няма налични стоки за показване
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Артикул</TableCell>
            <TableCell>Обект</TableCell>
            <TableCell align="right">Количество</TableCell>
            <TableCell align="right">Доставна цена</TableCell>
            <TableCell align="right">Стойност</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.product.name}</TableCell>
              <TableCell>{item.location.name}</TableCell>
              <TableCell align="right">{item.quantity.toFixed(3)}</TableCell>
              <TableCell align="right">{item.costPrice.toFixed(2)} лв.</TableCell>
              <TableCell align="right">
                {(item.quantity * item.costPrice).toFixed(2)} лв.
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StockLevelsList; 
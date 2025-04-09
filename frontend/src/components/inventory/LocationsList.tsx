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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Location {
  id: string;
  name: string;
  address?: string;
  description?: string;
  isActive: boolean;
}

interface LocationsListProps {
  items: Location[];
}

const LocationsList: React.FC<LocationsListProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body1" color="textSecondary">
          Няма обекти за показване
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Име</TableCell>
            <TableCell>Адрес</TableCell>
            <TableCell>Описание</TableCell>
            <TableCell>Статус</TableCell>
            <TableCell align="right">Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((location) => (
            <TableRow key={location.id}>
              <TableCell>{location.name}</TableCell>
              <TableCell>{location.address || '-'}</TableCell>
              <TableCell>{location.description || '-'}</TableCell>
              <TableCell>
                {location.isActive ? (
                  <Chip size="small" label="Активен" color="success" />
                ) : (
                  <Chip size="small" label="Неактивен" color="default" />
                )}
              </TableCell>
              <TableCell align="right">
                <IconButton size="small" title="Редактирай">
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" color="error" title="Изтрий">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LocationsList;

import React, { useState } from 'react';
import { Modal, Box, Button, TextField } from '@mui/material';

interface MilePointModalProps {
  milePointSearch: string;
  setMilePointSearch: (value: string) => void;
  handleSearch: () => void;
}

const MilePointModal: React.FC<MilePointModalProps> = ({
  milePointSearch,
  setMilePointSearch,
  handleSearch,
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSearchAndClose = () => {
    handleSearch();
    handleClose();
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Open Modal
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2>Enter Mile Point</h2>
          <TextField
            label="Mile Point"
            value={milePointSearch}
            onChange={(e) => setMilePointSearch(e.target.value)}
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={handleSearchAndClose}>
            Search
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default MilePointModal;
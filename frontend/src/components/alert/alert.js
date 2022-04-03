import React from "react";
import Alert from '@mui/material/Alert';

export default function MuiAlert(props) {
  return (
    <>
      <Alert elevation={6} variant="filled" {...props} />
    </>
  );
}
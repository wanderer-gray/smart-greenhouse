import React, { useState, useContext } from "react";
import {
  Button,
  Input,
  InputLabel,
  FormControl,
  Typography,
  Snackbar
} from "@mui/material";
import MuiAlert from '../../components/alert/alert';
import { NavLink } from "react-router-dom";
import { useHttp } from "../../hooks/httpHook";
import { AuthContext } from "../../context/AuthContext";

import "./authorization.scss";

const navLinkStyle = {
  color: "white",
  textDecoration: "none"
}

export default function Authorization(props) {
  const auth = useContext(AuthContext);
  const { loading, request, error, clearError } = useHttp();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
    clearError();
  };

  const changeHandler = (e) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    })
  }

  const authorizationHandler = async () => {
    try {
      const data = await request('/api/user/authorization', 'POST', { ...form });
      auth.email(data.token, data.email);
    }
    catch {
      setOpen(true);
    }
  }

  return (
    <div className="centeryForm">
      <div className="blackShadow auth_div">

        <Typography variant="h5" color="primary" >
          Вход в систему
        </Typography>

        <FormControl fullWidth={true} margin="dense">
          <InputLabel htmlFor="email">Email</InputLabel>
          <Input
            className="form_control"
            type="text"
            id="email"
            name="email"
            placeholder="Ваш логин"
            onChange={changeHandler}
          />
        </FormControl>

        <FormControl fullWidth={true} margin="dense">
          <InputLabel htmlFor="password">Пароль</InputLabel>
          <Input
            className="form_control"
            type="password"
            id="password"
            name="password"
            placeholder="Ваш пароль"
            onChange={changeHandler}
          />
        </FormControl>

        <div className="buttons">
          <Button variant="contained"
            color="primary"
            fullWidth={true}
            onClick={authorizationHandler}
            disabled={loading}
          >
            Войти
          </Button>
        </div>

        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <MuiAlert onClose={handleClose} severity="error">
            {error}
          </MuiAlert>
        </Snackbar>

        <div className="buttons">
          <NavLink to='/registration' style={navLinkStyle}>
            <Button fullWidth={true}
              disabled={loading}
            >
              Регистрация
            </Button>
          </NavLink>
        </div>

      </div>
    </div>
  );
}
import React, { useState } from "react";
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
import validateEmail from '../../validators/email';
import validatePassword from '../../validators/password';
import AdditionalInfo from "../../additionalInfo/additionalInfo";
import { useHttp } from "../../hooks/httpHook";


import "./registration.scss";

const navLinkStyle = {
  color: "white",
  textDecoration: "none"
}

export default function Register(props) {
  const { request, error, clearError } = useHttp();
  const [state, setState] = useState({
    name: "",
    surname: "",
    middle_name: "",
    email: "",
    password: "",
    passwordConf: "",
  });
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSuccess(false);
    setOpenError(false);
    clearError();
  };

  const ifEmptyOrValid = [
    !validateEmail(state.email) && !!state.email,//ЭТО НЕ РАБОТАЕТ!!
    !validatePassword(state.password) && !!state.password,
    state.password !== state.passwordConf && !!state.passwordConf,
    !state.name,
    !state.surname,
    !state.email,
    !state.password,
    !state.passwordConf
  ];

  const changeHandler = (e) => {
    setState({
      ...state,
      [e.target.id]: e.target.value,
    })
  }

  const registrationHandler = async () => {
    try {
      const data = await request('/api/user/registration', 'POST', { ...state });
      setMessage(data.message);
      setOpenSuccess(true);
    }
    catch {
      setMessage(error);
      setOpenError(true);
    }
  }

  return (
    <div className="centeryForm">
      <div className="blackShadow auth_div">

        <Typography className="auth_title" variant="h5" color="primary">
          Регистрация
        </Typography>

        <FormControl fullWidth={true} margin="dense">
          <InputLabel htmlFor="surname">Фамилия</InputLabel>
          <Input
            className="form_control"
            type="text"
            name="surname"
            id="surname"
            placeholder="Ваша фамилия"
            onChange={changeHandler}
          />
        </FormControl>

        <FormControl fullWidth={true} margin="dense">
          <InputLabel htmlFor="name">Имя</InputLabel>
          <Input
            className="form_control"
            type="text"
            name="name"
            id="name"
            placeholder="Ваше имя"
            onChange={changeHandler}
          />
        </FormControl>

        <FormControl fullWidth={true} margin="dense">
          <InputLabel htmlFor="middle_name">Отчество (необязательно)</InputLabel>
          <Input
            className="form_control"
            type="text"
            name="middle_name"
            id="middle_name"
            placeholder="Ваше отчество"
            onChange={changeHandler}
          />
        </FormControl>

        <FormControl fullWidth={true} margin="dense">
          <InputLabel htmlFor="email">Email</InputLabel>
          <Input
            className="form_control"
            type="text"
            name="email"
            id="email"
            placeholder="Ваш логин"
            onChange={changeHandler}
          />
        </FormControl>

        {ifEmptyOrValid[0] ?
          <AdditionalInfo type="hidden" text="Длина от 4 до 32 символов. Использовать только англ. буквы, цифры и '-' '_'." />
          : ''
        }

        <FormControl fullWidth={true} margin="dense">
          <InputLabel htmlFor="password">Пароль</InputLabel>
          <Input
            className="form_control"
            type="password"
            name="password"
            id="password"
            placeholder="Ваш пароль"
            onChange={changeHandler}
          />
        </FormControl>

        {ifEmptyOrValid[1] ?
          <AdditionalInfo type="hidden" text="Длина от 4 до 32 символов. Должен включать как нижний, так и верхний регистр. Должен включать буквы и цифры. Использовать только англ. буквы." />
          : ''
        }

        <FormControl fullWidth={true} margin="dense">
          <InputLabel htmlFor="passwordConf">Повторный пароль</InputLabel>
          <Input
            className="form_control"
            type="password"
            name="passwordConf"
            id="passwordConf"
            placeholder="Повторите пароль"
            onChange={changeHandler}
          />
        </FormControl>

        {ifEmptyOrValid[2] ?
          <AdditionalInfo type="hidden" text="Пароли не совпадают" />
          : ''
        }

        <div className="buttons">
          <Button
            variant="contained"
            color="primary"
            fullWidth={true}
            onClick={registrationHandler}
            disabled={ifEmptyOrValid.includes(true)}
          >
            Зарегистрироваться
          </Button>

          <Snackbar open={openError} autoHideDuration={6000} onClose={handleClose}>
            <MuiAlert onClose={handleClose} severity="error">
              {message}
            </MuiAlert>
          </Snackbar>

          <Snackbar open={openSuccess} autoHideDuration={6000} onClose={handleClose}>
            <MuiAlert onClose={handleClose} severity="success">
              {message}
            </MuiAlert>
          </Snackbar>
        </div>

        <div className="buttons">
          <NavLink to='/authorize' style={navLinkStyle}>
            <Button fullWidth={true}>
              Войти
            </Button>
          </NavLink>
        </div>

      </div>
    </div>
  );
}
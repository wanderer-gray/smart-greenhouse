import React, { useContext, useState, useEffect } from "react";
import {
  Button,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { AccountCircle } from '@mui/icons-material';
import { useHttp } from "../../hooks/httpHook";
import { AuthContext } from '../../context/AuthContext'

import "./dashboard.scss";
import LineChart from "../../components/lineChart/LineChart";

const navLinkStyle = {
  color: "white",
  textDecoration: "none"
}

export default function Dashboard(props) {
  const [stateData, setStateData] = useState(null);
  const [userInfo, setUserInfo] = useState({});

  const { request } = useHttp();
  const { token } = useContext(AuthContext);

  useEffect(() => {
    try {
      const getInfo = async () => {
        const dataTask = await request('/api/task/getalltask', 'GET', null,
          { authorization: `Bearer ${token}` });
        setStateData(dataTask.tasksList ? [...dataTask.tasksList] : null);
        const dataUser = await request('/api/user/getuserinfo', 'POST', null,
          { authorization: `Bearer ${token}` });
        setUserInfo({ ...dataUser.candidate });
      };
      getInfo();
    }
    catch { }
  }, []);

  return (
    <div>
      <AppBar position="static">
        <Toolbar>

          <Typography variant="h6" className="titlePage">
            Мониторинг
          </Typography>

          <NavLink to='/lk' style={navLinkStyle}>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </NavLink>

        </Toolbar>
      </AppBar>

      <div className="cards">
      <LineChart />
      <LineChart />
      <LineChart />
      <LineChart />
      <LineChart />
      <LineChart />

      </div>
    </div>
  );
}
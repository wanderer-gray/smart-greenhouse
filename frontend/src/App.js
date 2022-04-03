import { BrowserRouter as Router } from 'react-router-dom';
import { UserRoutes } from './routes';
import { useAuth } from './hooks/authHook';
import { AuthContext } from './context/AuthContext';
import { Loader } from './components/loader/loader';

import './App.scss';

function App() {
  const { token, login, logout, userLogin, ready } = useAuth();
  const isAuthenticated = !!token;

  if (!ready) {
    <Loader />
  }
  return (
    <AuthContext.Provider value={{ token, login, logout, userLogin }}>
      <Router>
        <div className="App">
          <UserRoutes isAuthenticated={isAuthenticated} />
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
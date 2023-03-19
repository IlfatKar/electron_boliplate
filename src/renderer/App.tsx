import { createContext, useState } from 'react';
import {
  MemoryRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import './App.css';
import state from './state';
import Clients from './components/Clients/Clients';
import AddClient from './components/Clients/AddClient';

const StateContext = createContext(state);

function Login() {
  // const st = useContext(StateContext);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isErr, setIsErr] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="App">
      <h1>Вход</h1>
      <div className="form">
        <label>
          <input
            type="text"
            value={login}
            onChange={(e) => {
              setIsErr(false);
              setLogin(e.target.value);
            }}
            placeholder="Логин"
          />
        </label>
        <label>
          <input
            value={password}
            onChange={(e) => {
              setIsErr(false);
              setPassword(e.target.value);
            }}
            type="password"
            placeholder="Пароль"
          />
        </label>
        <button
          onClick={() => {
            window.electron.ipcRenderer.once('login', (arg) => {
              if (!arg) {
                setIsErr(true);
              } else {
                navigate('/clients');
              }
            });
            window.electron.ipcRenderer.sendMessage('login', [login, password]);
          }}
        >
          Войти
        </button>
        {isErr && <small>Неверный логин или пароль</small>}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <StateContext.Provider value={state}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/add" element={<AddClient />} />
        </Routes>
      </Router>
    </StateContext.Provider>
  );
}

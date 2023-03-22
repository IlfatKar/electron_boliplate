/* eslint-disable import/no-cycle */
import React, { createContext, useState, useContext } from 'react';
import {
  MemoryRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import './App.css';
import { observer } from 'mobx-react-lite';
import state from './state';
import AddOilObjects from './components/OilObjects/AddOilObjects';
import TabWrapper from './components/TabWrapper/TabWrapper';
import OilObjects from './components/OilObjects/OilObjects';
import Devices from './components/Devices/Devices';
import AddDevice from './components/Devices/AddDevice';
import Services from './components/Services/Services';
import DevicesTypes from './components/DevicesTypes/DevicesTypes';
import AddDevicesTypes from './components/DevicesTypes/AddDevicesTypes';
import History from './components/History/History';
import AddNeedPoverka from './components/NeedPoverka/AddNeedPoverka';
import NeedPoverka from './components/NeedPoverka/NeedPoverka';
import Reports from './components/Reports/Reports';
import Form, { IFieldType } from './components/utils/Form';
import List from './components/utils/List';

export const StateContext = createContext(state);

const Login = observer(() => {
  const st = useContext(StateContext);
  const [register, setRegister] = useState<any>({});
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isErr, setIsErr] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="App">
      <h1>{isLogin ? 'Вход' : 'Регистрация'}</h1>
      {isLogin && (
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
              window.electron.ipcRenderer.once('Login', (arg: any) => {
                if (!arg) {
                  setIsErr(true);
                } else {
                  st.setRole(arg.role);
                  st.setUser(arg.id);
                  navigate('/needPoverka');
                }
              });
              window.electron.ipcRenderer.sendMessage('Login', [
                login,
                password,
              ]);
            }}
          >
            Войти
          </button>
          <button onClick={() => setIsLogin(false)}>Регистрация</button>
          {isErr && <small>Неверный логин или пароль</small>}
        </div>
      )}
      {!isLogin && (
        <form className="form">
          <label>
            <input
              type="text"
              required
              value={register.fio}
              onChange={(e) => {
                setIsErr(false);
                const val = e.target.value;
                if (
                  val.match(/[а-яА-Я]+ [а-яА-Я]+ [а-яА-Я]+/) &&
                  !val.match(/![а-яА-Я]/)
                ) {
                  e.target.style.border = 'none';
                  setRegister((prev) => ({ ...prev, fio: e.target.value }));
                } else {
                  e.target.style.border = '5px solid red';
                }
              }}
              placeholder="ФИО"
            />
          </label>
          <label>
            <input
              type="email"
              required
              value={register.email}
              onChange={(e) => {
                setIsErr(false);
                setRegister((prev) => ({ ...prev, email: e.target.value }));
              }}
              placeholder="E-email"
            />
          </label>
          <label>
            <input
              type="text"
              required
              value={register.login}
              onChange={(e) => {
                setIsErr(false);
                setRegister((prev) => ({ ...prev, login: e.target.value }));
              }}
              placeholder="Логин"
            />
          </label>
          <label>
            <input
              type="password"
              required
              value={register.password}
              onChange={(e) => {
                setIsErr(false);
                setRegister((prev) => ({ ...prev, password: e.target.value }));
              }}
              placeholder="Пароль"
            />
          </label>
          <label>
            <input
              type="password"
              required
              value={register.password1}
              onChange={(e) => {
                setIsErr(false);
                setRegister((prev) => ({ ...prev, password1: e.target.value }));
              }}
              placeholder="Повтор пароля"
            />
          </label>
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            Регистрация
          </button>
          <button onClick={() => setIsLogin(true)}>Войти</button>
        </form>
      )}
      <button
        onClick={() => {
          navigate('/test');
        }}
      >
        Test
      </button>
    </div>
  );
});

export default function App() {
  return (
    <StateContext.Provider value={state}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/test"
            element={
              <TabWrapper>
                {/* <Form
                  id={0}
                  onSubmit={console.log}
                  title="test"
                  fields={[
                    {
                      title: 'select',
                      type: IFieldType.Select,
                      default: 0,
                      typeTitle: 'slct',
                      selectValues: [
                        { id: 0, title: '2' },
                        { id: 1, title: '3' },
                      ],
                    },
                  ]}
                /> */}
                <List
                  title="Тест"
                  onDelete={(id: number) => {}}
                  onEdit={(id: number) => {}}
                  onAdd={'/oilobjects/add'}
                  list={[
                    {
                      field: 'test',
                      title: 'test',
                      item: {
                        test: 'asd',
                      },
                    },
                  ]}
                />
              </TabWrapper>
            }
          />
          <Route
            path="/oilobjects"
            element={
              <TabWrapper>
                <OilObjects />
              </TabWrapper>
            }
          />
          <Route
            path="/oilobjects/add"
            element={
              <TabWrapper>
                <AddOilObjects />
              </TabWrapper>
            }
          />
          <Route
            path="/devices"
            element={
              <TabWrapper>
                <Devices />
              </TabWrapper>
            }
          />
          <Route
            path="/devices/add"
            element={
              <TabWrapper>
                <AddDevice />
              </TabWrapper>
            }
          />
          <Route
            path="/services"
            element={
              <TabWrapper>
                <Services />
              </TabWrapper>
            }
          />
          <Route
            path="/services/add"
            element={
              <TabWrapper>
                {/* <AddService /> */}
                <Form
                  fields={[
                    {
                      title: 'Название',
                      typeTitle: 'title',
                      type: IFieldType.Text,
                      default: '',
                      required: true,
                      test: (val) => {
                        return val.length > 0;
                      },
                      matchMsg: 'Поле должно быть не пустое',
                    },
                  ]}
                  title="Добавить службу"
                  onSubmit={(form: object) => {
                    window.electron.ipcRenderer.sendMessage('AddService', [
                      form,
                    ]);
                  }}
                />
              </TabWrapper>
            }
          />
          <Route
            path="/services/edit"
            element={
              <TabWrapper>
                {/* <AddService /> */}
                <Form
                  isEdit
                  fields={[
                    {
                      title: 'Название',
                      typeTitle: 'title',
                      type: IFieldType.Text,
                      default: '',
                      required: true,
                      test: (val) => {
                        return val.length > 0;
                      },
                      matchMsg: 'Поле должно быть не пустое',
                    },
                  ]}
                  title="Редактировать службу"
                  onSubmit={(form: object) => {
                    window.electron.ipcRenderer.sendMessage('EditService', [
                      form,
                    ]);
                  }}
                />
              </TabWrapper>
            }
          />
          <Route
            path="/devicesTypes"
            element={
              <TabWrapper>
                <DevicesTypes />
              </TabWrapper>
            }
          />
          <Route
            path="/devicesTypes/add"
            element={
              <TabWrapper>
                <AddDevicesTypes />
              </TabWrapper>
            }
          />
          <Route
            path="/needPoverka"
            element={
              <TabWrapper>
                <NeedPoverka />
              </TabWrapper>
            }
          />
          <Route
            path="/needPoverka/add"
            element={
              <TabWrapper>
                <AddNeedPoverka />
              </TabWrapper>
            }
          />
          <Route
            path="/history"
            element={
              <TabWrapper>
                <History />
              </TabWrapper>
            }
          />
          <Route
            path="/reports"
            element={
              <TabWrapper>
                <Reports />
              </TabWrapper>
            }
          />
        </Routes>
      </Router>
    </StateContext.Provider>
  );
}

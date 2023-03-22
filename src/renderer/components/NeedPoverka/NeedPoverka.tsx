// eslint-disable-next-line import/no-cycle
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../OilObjects/OilObjects.css';
import { observer } from 'mobx-react-lite';
import { StateContext } from 'renderer/App';
import { IService } from '../Services/Services';
import './NeedPoverka.css';

export interface IPoverka {
  id: number;
  date: number;
  nextDate: number;
  device: number;
  deviceTitle?: string;
  type: number;
  typeTitle?: string;
  place: string;
  org: number;
  orgTitle?: string;
  result: string;
  employee: number;
  employeeFIO?: string;
  oilObject: number;
  oilObjectTitle?: string;
}

export default observer(function NeedPoverka() {
  const navigate = useNavigate();
  const state = useContext(StateContext);
  const [objects, setObjects] = useState<IPoverka[]>([]);
  const [objectsFiltered, setObjectsFiltered] = useState<IPoverka[]>([]);
  const [orgs, setOrgs] = useState<IService[]>([]);
  const [org, setOrg] = useState(0);
  const d = new Date();
  const datestring = d
    ? `${d.getFullYear().toString().padStart(4, '0')}-${(d.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
    : '';
  const [from, setFrom] = useState(datestring);
  const [from1, setFrom1] = useState(datestring);
  const [to1, setTo1] = useState('2025-01-01');
  const [to, setTo] = useState('2025-01-01');
  useEffect(() => {
    window.electron.ipcRenderer.once('GetPoverka', (arg) => {
      setObjects(arg as IPoverka[]);
      setObjectsFiltered(arg as IPoverka[]);
    });
    window.electron.ipcRenderer.once('GetServices', (arg) => {
      setOrgs(arg as IService[]);
      setOrg(arg[0].id);
    });
    window.electron.ipcRenderer.sendMessage('GetPoverka', []);
    window.electron.ipcRenderer.sendMessage('GetServices', []);
  }, []);
  useEffect(() => {
    setObjectsFiltered(
      objects.filter(
        (item) =>
          (!org || item.org === org) &&
          item.nextDate &&
          item.nextDate >= Date.parse(from) &&
          item.nextDate <= Date.parse(to || '2025-01-01') &&
          item.date &&
          item.date >= Date.parse(from1) &&
          item.date <= Date.parse(to1 || '2025-01-01')
      )
    );
  }, [from, from1, objects, org, to1, to]);
  return (
    <div className="Clients Devices NeedPoverka">
      <h2>Список подлжежащих поверке</h2>
      <div>
        <p>Сортировка:</p>
        <select
          onChange={(e) => {
            let arr = [...objects];
            const t = +e.target.value;
            if (t === 1) {
              arr = arr.sort((a, b) => {
                if (a.nextDate < b.nextDate) {
                  return 1;
                }
                return -1;
              });
            }
            if (t === 2) {
              arr = arr.sort((a, b) => {
                if (a.date < b.date) {
                  return 1;
                }
                return -1;
              });
            }
            if (t === 3) {
              arr = arr.sort((a, b) => {
                if ((a.deviceTitle || '') < (b.deviceTitle || '')) {
                  return 1;
                }
                return -1;
              });
            }
            setObjects(arr);
          }}
        >
          <option value="1">По дате следующей поверки</option>
          <option value="2">По дате поверки</option>
          <option value="3">По названию прибора</option>
        </select>
      </div>
      <div className="filters">
        <div>
          <p>Период следующих поверок</p>
          <label>
            <span>От</span>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </label>
          <label>
            <span>До</span>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </label>
        </div>
        <div>
          <p>Период прошлых поверок</p>
          <label>
            <span>От</span>
            <input
              type="date"
              value={from1}
              onChange={(e) => setFrom1(e.target.value)}
            />
          </label>
          <label>
            <span>До</span>
            <input
              type="date"
              value={to1}
              onChange={(e) => setTo1(e.target.value)}
            />
          </label>
        </div>
        <div>
          <p>Организцаия поверки</p>
          <select
            value={org}
            onChange={(e) => {
              setOrg(+e.target.value);
            }}
          >
            {orgs.map((item) => (
              <option value={item.id}>{item.title}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="objects col">
        {objectsFiltered.map((item) => (
          <div key={item.id} className="item">
            <div>
              <p>Прибор: {item.deviceTitle}</p>
              <p>Объект: {item.oilObjectTitle}</p>
              <p>Организации поверки: {item.orgTitle}</p>
              <p>Тип поверки: {item.typeTitle}</p>
              <p>Дата поверки: {new Date(item.date).toLocaleString('ru-RU')}</p>
              <p>
                Дата следующей поверки:{' '}
                {new Date(item.nextDate).toLocaleString('ru-RU')}
              </p>
            </div>
            <div className="btns">
              <button
                onClick={() => {
                  state.setEdited(item);
                  navigate('/needPoverka/add');
                }}
              >
                Редактировать
              </button>
              <button
                onClick={() => {
                  window.electron.ipcRenderer.sendMessage('RemovePoverka', [
                    item.id,
                  ]);
                  window.electron.ipcRenderer.once('GetPoverka', (arg) => {
                    setObjects(arg as IPoverka[]);
                  });
                  window.electron.ipcRenderer.sendMessage('GetPoverka', []);
                }}
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="btnWrapper">
        <button
          onClick={() => {
            navigate('/needPoverka/add');
          }}
        >
          Добавить
        </button>
      </div>
    </div>
  );
});

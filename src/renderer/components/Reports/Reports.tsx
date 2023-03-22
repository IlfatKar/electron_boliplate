/* eslint-disable no-plusplus */
import react, { useEffect, useState } from 'react';
import { IDevicesTypes } from '../DevicesTypes/DevicesTypes';
import { IPoverka } from '../NeedPoverka/NeedPoverka';
import './Reports.css';

export default function Reports() {
  const [tab, setTab] = useState(0);
  const [count, setCount] = useState(0);
  const [count1, setCount1] = useState(0);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [types, setTypes] = useState<IDevicesTypes[]>([]);
  const [objects, setObjects] = useState<IPoverka[]>([]);
  useEffect(() => {
    window.electron.ipcRenderer.once('GetDevicesTypes', (arg) => {
      setTypes(arg as IDevicesTypes[]);
      setSelectedType(arg[0].title);
    });
    window.electron.ipcRenderer.once('GetPoverka', (arg) => {
      const res: IPoverka[] = [];
      (arg as IPoverka[]).forEach((item) => {
        if (
          item.nextDate &&
          item.nextDate > Date.now() &&
          item.nextDate < Date.now() + 2419200000
        ) {
          res.push(item);
        }
      });
      setObjects(res);
    });
    window.electron.ipcRenderer.sendMessage('GetDevicesTypes', []);
    window.electron.ipcRenderer.sendMessage('GetPoverka', []);
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.once('GetPoverka', (arg) => {
      const p = arg as IPoverka[];
      let res = 0;
      p.forEach((item) => {
        if (item.typeTitle === selectedType) {
          res++;
        }
      });
      setCount(res);
    });
    window.electron.ipcRenderer.sendMessage('GetPoverka', []);
  }, [selectedType]);

  useEffect(() => {
    window.electron.ipcRenderer.once('GetPoverka', (arg) => {
      const p = arg as IPoverka[];
      let res = 0;
      const fromN = Date.parse(from);
      const toN = Date.parse(to || '2025-01-01');
      p.forEach((item) => {
        if (item.nextDate < toN && item.nextDate > fromN) {
          res++;
        }
      });
      setCount1(res);
    });
    window.electron.ipcRenderer.sendMessage('GetPoverka', []);
  }, [to, from]);

  return (
    <div className="reports">
      <nav>
        <button onClick={() => setTab(0)}>
          Количетсво выполненных поверок
        </button>
        <button onClick={() => setTab(1)}>
          Список подлежащих поверке приборов
        </button>
        <button onClick={() => setTab(2)}>
          Количество приборов на поверку
        </button>
      </nav>
      {tab === 0 && (
        <div>
          <h3>Количество выполненных поверок</h3>
          <label>
            <span>Вид поверки: </span>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
              }}
            >
              {types.map((item) => (
                <option key={item.id} value={item.title}>
                  {item.title}
                </option>
              ))}
            </select>
          </label>
          <p>Количетсво выполненных поверок по данному виду: {count}</p>
        </div>
      )}
      {tab === 1 && (
        <div>
          <h3>Список приборов которые подлежат поверке в ближайший месяц</h3>
          <div className="list">
            {objects.map((item) => (
              <div key={item.id} className="item">
                <div>
                  <p>Прибор: {item.deviceTitle}</p>
                  <p>Объект: {item.oilObjectTitle}</p>
                  <p>Периодичность поверки: {item.typeTitle}</p>
                  <p>Дата поверки: {new Date(item.date).toLocaleString()}</p>
                  <p>
                    Дата следующей поверки:{' '}
                    {new Date(item.nextDate).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            <button
              onClick={() => {
                document.body.classList.add('print');
                print();
                document.body.classList.remove('print');
              }}
            >
              Печать в pdf
            </button>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div>
          <h3>Рассчет количества приборов для поверки</h3>
          <label>
            <span>От</span>
            <input
              type="date"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
              }}
            />
          </label>
          <label>
            <span>До</span>
            <input
              type="date"
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
              }}
            />
          </label>
          <p>Количетсво приборов на поверку: {count1}</p>
        </div>
      )}
    </div>
  );
}

/* eslint-disable import/no-cycle */
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StateContext } from 'renderer/App';
import { IDevice } from '../Devices/Devices';
import { IService } from '../Services/Services';
import { IPoverka } from './NeedPoverka';

interface IPoverkaForm {
  id: number;
  date: string;
  nextDate: string;
  device: number;
  type: number;
  place: string;
  org: number;
  result: string;
  employee: number;
  oilObject: number;
}

export default observer(function AddNeedPoverka() {
  type idTitleType = {
    id: number;
    title: string;
  };
  const navigate = useNavigate();
  const state = useContext(StateContext);
  const ed = state.edited as IPoverka;
  let d = new Date(ed ? ed.date : Date.now());
  const datestring = d
    ? `${d.getFullYear().toString().padStart(4, '0')}-${(d.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
    : '';
  d = new Date(ed ? ed.date : Date.now());
  const datestring1 = d
    ? `${d.getFullYear().toString().padStart(4, '0')}-${(d.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
    : '';
  const [form, setForm] = useState<IPoverkaForm>({
    id: ed ? ed.id : 0,
    date: datestring,
    nextDate: datestring1,
    device: ed ? ed.device : 0,
    type: ed ? ed.type : 0,
    place: ed ? ed.place : '',
    org: ed ? ed.org : 0,
    result: ed ? ed.result : '',
    employee: ed ? ed.employee : state.user,
    oilObject: ed ? ed.oilObject : 0,
  });

  const [types, setTypes] = useState<idTitleType[]>([]);
  const [objects, setObjects] = useState<idTitleType[]>([]);
  const [devices, setDevices] = useState<IDevice[]>([]);
  const [services, setServices] = useState<IService[]>([]);

  useEffect(() => {
    window.electron.ipcRenderer.once('GetDevicesTypes', (arg) => {
      setTypes(arg as idTitleType[]);
      setForm((prev) => ({ ...prev, type: arg[0].id }));
    });
    window.electron.ipcRenderer.once('GetOilObjects', (arg) => {
      setObjects(arg as idTitleType[]);
      setForm((prev) => ({ ...prev, oilObject: arg[0].id }));
    });
    window.electron.ipcRenderer.once('GetDevices', (arg) => {
      setDevices(arg as IDevice[]);
      setForm((prev) => ({ ...prev, device: arg[0].id }));
    });
    window.electron.ipcRenderer.once('GetServices', (arg) => {
      setServices(arg as IDevice[]);
      setForm((prev) => ({ ...prev, org: arg[0].id }));
    });
    window.electron.ipcRenderer.sendMessage('GetDevicesTypes', []);
    window.electron.ipcRenderer.sendMessage('GetOilObjects', []);
    window.electron.ipcRenderer.sendMessage('GetDevices', []);
    window.electron.ipcRenderer.sendMessage('GetServices', []);
  }, []);
  return (
    <div className="AddClient">
      <h2>
        {state.edited ? 'Редактировать ' : 'Добавить'} запись о поверяемом
        приборе
      </h2>
      <div className="form">
        <label>
          <span>Дата поверки</span>
          <input
            required
            type="date"
            value={form.date}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                date: e.target.value,
              }));
            }}
          />
        </label>
        <label>
          <span>Дата следующей поверки</span>
          <input
            required
            type="date"
            value={form.nextDate}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                nextDate: e.target.value,
              }));
            }}
          />
        </label>
        <label>
          <span>Вид поверки</span>
          <select
            value={form.type}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, type: +e.target.value }));
            }}
            required
          >
            {types.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Прибор</span>
          <select
            required
            value={form.device}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, device: +e.target.value }));
            }}
          >
            {devices.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Объект где установлен прибор</span>
          <select
            required
            value={form.oilObject}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, oilObject: +e.target.value }));
            }}
          >
            {objects.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Организация</span>
          <select
            required
            value={form.org}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, org: +e.target.value }));
            }}
          >
            {services.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Место поверки</span>
          <input
            required
            type="text"
            value={form.place}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, place: e.target.value }));
            }}
          />
        </label>
        <label>
          <span>Результат поверки</span>
          <input
            required
            type="text"
            value={form.result}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, result: e.target.value }));
            }}
          />
        </label>
        <button
          onClick={() => {
            navigate('/needPoverka');
          }}
        >
          Назад
        </button>
        <button
          onClick={() => {
            state.setEdited(null);
            window.electron.ipcRenderer.sendMessage('EditPoverka', [
              {
                ...form,
                date: Date.parse(form.date),
                nextDate: Date.parse(form.nextDate),
              },
            ]);
            navigate('/needPoverka');
          }}
        >
          {state.edited ? 'Редактировать ' : 'Добавить'}
        </button>
      </div>
    </div>
  );
});

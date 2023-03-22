import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line import/no-cycle
import { StateContext } from 'renderer/App';
import { IDevicesTypes } from '../DevicesTypes/DevicesTypes';
import { IDevice } from './Devices';

export default observer(function AddDevice() {
  const navigate = useNavigate();
  const state = useContext(StateContext);
  const [form, setForm] = useState<IDevice>({
    id: (state.edited as IDevice)?.id || 0,
    title: (state.edited as IDevice)?.title || '',
    period: (state.edited as IDevice)?.period || '',
    type: (state.edited as IDevice)?.type || 0,
  });
  const [err, setErr] = useState('');
  const [types, setTypes] = useState<IDevicesTypes[]>([]);
  window.electron.ipcRenderer.once('GetDevicesTypes', (arg) => {
    setTypes(arg as IDevicesTypes[]);
    setForm((prev) => ({ ...prev, type: arg[0].id }));
  });
  window.electron.ipcRenderer.sendMessage('GetDevicesTypes', []);
  return (
    <div className="AddClient">
      <h2>{state.edited ? 'Редактировать' : 'Добавить'} прибор</h2>
      <div className="form">
        <label>
          <span>Название</span>
          <input
            type="text"
            value={form.title}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, title: e.target.value }));
            }}
          />
        </label>
        <label>
          <span>Модель</span>
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
          <span>Периодичность</span>
          <input
            type="text"
            value={form.period}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, period: e.target.value }));
            }}
          />
        </label>
        <button
          onClick={() => {
            navigate('/devices');
          }}
        >
          Назад
        </button>
        <button
          onClick={() => {
            if (form.type <= 0) {
              setErr('Поле `Модель` пустое');
              return;
            }
            if (!form.title.length) {
              setErr('Поле `Название` пустое');
              return;
            }
            if (!form.period.length) {
              setErr('Поле `Периодичностьы` пустое');
              return;
            }
            window.electron.ipcRenderer.sendMessage(
              state.edited ? 'EditDevice' : 'AddDevice',
              [form]
            );
            state.setEdited(null);
            navigate('/devices');
          }}
        >
          {state.edited ? 'Редактировать' : 'Добавить'}
        </button>
        {err && <small>{err}</small>}
      </div>
    </div>
  );
});

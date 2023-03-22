/* eslint-disable import/no-cycle */
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StateContext } from 'renderer/App';
import { IDevice } from '../Devices/Devices';
import { IOilObject } from './OilObjects';

export default observer(function AddOilObjects() {
  const state = useContext(StateContext);
  const navigate = useNavigate();
  const [form, setForm] = useState<IOilObject>({
    id: (state.edited as IOilObject)?.id || 0,
    title: (state.edited as IOilObject)?.title || '',
    address: (state.edited as IOilObject)?.address || '',
    devices: [],
  });
  const [devices, setDevices] = useState<IDevice[]>([]);
  useEffect(() => {
    window.electron.ipcRenderer.once('GetDevices', (arg) => {
      setDevices(arg as IDevice[]);
    });
    window.electron.ipcRenderer.sendMessage('GetDevices', []);
  }, []);
  const [err, setErr] = useState('');
  return (
    <div className="AddClient">
      <h2>{state.edited ? 'Редактировать' : 'Добавить'} нефтяной объект</h2>
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
          <span>Адрес</span>
          <input
            type="text"
            value={form.address}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, address: e.target.value }));
            }}
          />
        </label>
        <div>
          <span>Приборы</span>
          <div>
            {devices.map((item) => (
              <label key={item.id}>
                {item.title}
                <input
                  onChange={(e) => {
                    setForm((prev) => {
                      if (
                        !prev.devices.find((dev) => dev === +e.target.value)
                      ) {
                        return {
                          ...prev,
                          devices: [...prev.devices, +e.target.value],
                        };
                      }
                      return {
                        ...prev,
                        devices: prev.devices.filter(
                          (dev) => dev !== +e.target.value
                        ),
                      };
                    });
                  }}
                  type="checkbox"
                  name="devices"
                  value={item.id}
                />
              </label>
            ))}
          </div>
        </div>
        <button
          onClick={() => {
            navigate('/oilobjects');
          }}
        >
          Назад
        </button>
        <button
          onClick={() => {
            if (!form.address.length) {
              setErr('Поле `Адрес` пустое');
              return;
            }
            if (!form.title.length) {
              setErr('Поле `Название` пустое');
              return;
            }

            window.electron.ipcRenderer.sendMessage(
              state.edited ? 'EditOilObject' : 'AddOilObject',
              [form]
            );
            state.setEdited(null);
            navigate('/oilobjects');
          }}
        >
          {state.edited ? 'Редактировать' : 'Добавить'}
        </button>
        {err && <small>{err}</small>}
      </div>
    </div>
  );
});

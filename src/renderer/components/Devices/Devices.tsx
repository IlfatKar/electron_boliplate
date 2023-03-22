import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../OilObjects/OilObjects.css';
import { observer } from 'mobx-react-lite';
// eslint-disable-next-line import/no-cycle
import { StateContext } from 'renderer/App';

export interface IDevice {
  id: number;
  title: string;
  type: number;
  typeTitle?: string;
  period: string;
}

export default observer(function Devices() {
  const navigate = useNavigate();
  const state = useContext(StateContext);
  const [objects, setObjects] = useState<IDevice[]>([]);
  useEffect(() => {
    window.electron.ipcRenderer.once('GetDevices', (arg) => {
      setObjects(arg as IDevice[]);
    });
    window.electron.ipcRenderer.sendMessage('GetDevices', []);
  }, []);
  return (
    <div className="Clients Devices">
      <h2>Список приборов</h2>
      <div className="objects col">
        {objects.map((item) => (
          <div key={item.id} className="item">
            <div>
              <p>Название: {item.title}</p>
              <p>Модель: {item.typeTitle}</p>
              <p>Периодичность поверок: {item.period}</p>
            </div>
            <div className="btns">
              <button
                onClick={() => {
                  state.setEdited(item);
                  navigate('/devices/add');
                }}
              >
                Редактировать
              </button>
              <button
                onClick={() => {
                  window.electron.ipcRenderer.sendMessage('RemoveDevices', [
                    item.id,
                  ]);
                  window.electron.ipcRenderer.once('GetDevices', (arg) => {
                    setObjects(arg as IDevice[]);
                  });
                  window.electron.ipcRenderer.sendMessage('GetDevices', []);
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
            navigate('/devices/add');
          }}
        >
          Добавить
        </button>
      </div>
    </div>
  );
});

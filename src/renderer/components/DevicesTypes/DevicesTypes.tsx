import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../OilObjects/OilObjects.css';
import { observer } from 'mobx-react-lite';
// eslint-disable-next-line import/no-cycle
import { StateContext } from 'renderer/App';

export interface IDevicesTypes {
  id: number;
  title: string;
}

export default observer(function DevicesTypes() {
  const navigate = useNavigate();
  const state = useContext(StateContext);
  const [objects, setObjects] = useState<IDevicesTypes[]>([]);
  useEffect(() => {
    window.electron.ipcRenderer.once('GetDevicesTypes', (arg) => {
      setObjects(arg as IDevicesTypes[]);
    });
    window.electron.ipcRenderer.sendMessage('GetDevicesTypes', []);
  }, []);
  return (
    <div className="Clients Devices">
      <h2>Список приборов</h2>
      <div className="objects col">
        {objects.map((item) => (
          <div key={item.id} className="item">
            <div>
              <p>Название: {item.title}</p>
            </div>
            <div className="btns">
              <button
                onClick={() => {
                  state.setEdited(item);
                  navigate('/devicesTypes/add');
                }}
              >
                Редактировать
              </button>
              <button
                onClick={() => {
                  window.electron.ipcRenderer.sendMessage(
                    'RemoveDevicesTypes',
                    [item.id]
                  );
                  window.electron.ipcRenderer.once('GetDevicesTypes', (arg) => {
                    setObjects(arg as IDevicesTypes[]);
                  });
                  window.electron.ipcRenderer.sendMessage(
                    'GetDevicesTypes',
                    []
                  );
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
            navigate('/devicesTypes/add');
          }}
        >
          Добавить
        </button>
      </div>
    </div>
  );
});

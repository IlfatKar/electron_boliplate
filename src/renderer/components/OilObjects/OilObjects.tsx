import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StateContext } from 'renderer/App';
import './OilObjects.css';

export interface IOilObject {
  id: number;
  title: string;
  address: string;
  devices: number[];
  devicesTitles?: string[];
}

export default observer(function OilObjects() {
  const state = useContext(StateContext);
  const navigate = useNavigate();
  const [objects, setObjects] = useState<IOilObject[]>([]);
  useEffect(() => {
    window.electron.ipcRenderer.once('GetOilObjects', (arg) => {
      setObjects(arg as IOilObject[]);
    });
    window.electron.ipcRenderer.sendMessage('GetOilObjects', []);
  }, []);
  return (
    <div className="Clients">
      <h2>Список нефтяных объектов</h2>
      <div className="objects col">
        {objects.map((item) => (
          <div key={item.id} className="item">
            <div>
              <p>Название: {item.title}</p>
              <p>
                Приборы:{' '}
                {item.devicesTitles?.map((item) => (
                  <span key={item}>{item}; </span>
                ))}
              </p>
            </div>
            <div className="btns">
              <button
                onClick={() => {
                  state.setEdited(item);
                  navigate('/oilObjects/add');
                }}
              >
                Редактировать
              </button>
              <button
                onClick={() => {
                  window.electron.ipcRenderer.sendMessage('RemoveOilObjects', [
                    item.id,
                  ]);
                  window.electron.ipcRenderer.once('GetOilObjects', (arg) => {
                    setObjects(arg as IOilObject[]);
                  });
                  window.electron.ipcRenderer.sendMessage('GetOilObjects', []);
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
            navigate('/oilObjects/add');
          }}
        >
          Добавить
        </button>
      </div>
    </div>
  );
});

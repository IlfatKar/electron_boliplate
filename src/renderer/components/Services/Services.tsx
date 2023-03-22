import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../OilObjects/OilObjects.css';
import { observer } from 'mobx-react-lite';
// eslint-disable-next-line import/no-cycle
import { StateContext } from 'renderer/App';

export interface IService {
  id: number;
  title: string;
}

export default observer(function Services() {
  const navigate = useNavigate();
  const state = useContext(StateContext);
  const [objects, setObjects] = useState<IService[]>([]);
  useEffect(() => {
    window.electron.ipcRenderer.once('GetServices', (arg) => {
      setObjects(arg as IService[]);
    });
    window.electron.ipcRenderer.sendMessage('GetServices', []);
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
                  navigate(`/services/edit?id=${item.id}`);
                }}
              >
                Редактировать
              </button>
              <button
                onClick={() => {
                  window.electron.ipcRenderer.sendMessage('RemoveServices', [
                    item.id,
                  ]);
                  window.electron.ipcRenderer.once('GetServices', (arg) => {
                    setObjects(arg as IService[]);
                  });
                  window.electron.ipcRenderer.sendMessage('GetServices', []);
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
            navigate('/services/add');
          }}
        >
          Добавить
        </button>
      </div>
    </div>
  );
});

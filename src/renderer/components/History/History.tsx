import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IPoverka } from '../NeedPoverka/NeedPoverka';
import '../OilObjects/OilObjects.css';

export default observer(function History() {
  const [objects, setObjects] = useState<IPoverka[]>([]);
  useEffect(() => {
    window.electron.ipcRenderer.once('GetPoverka', (arg) => {
      setObjects(arg as IPoverka[]);
    });
    window.electron.ipcRenderer.sendMessage('GetPoverka', []);
  }, []);
  return (
    <div className="Clients">
      <h2>История</h2>
      <div className="objects col">
        {objects.map((item) => (
          <div key={item.id} className="item">
            <div>
              <p>Прибор: {item.deviceTitle}</p>
              <p>Дата поверки: {new Date(item.date).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

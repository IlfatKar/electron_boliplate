/* eslint-disable import/no-cycle */
import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StateContext } from 'renderer/App';
import './TabWrapper.css';

export default observer(function TabWrapper({
  children,
}: {
  children: React.ReactElement;
}) {
  const navigate = useNavigate();
  const state = useContext(StateContext);
  return (
    <div className="TabWrapper">
      <div className="tabs">
        {state.role === 1 && (
          <>
            <button onClick={() => navigate('/oilobjects')}>
              Нефтяные объекты
            </button>
            <button onClick={() => navigate('/devices')}>Приборы</button>
            <button onClick={() => navigate('/services')}>
              Метрологические службы
            </button>
            <button onClick={() => navigate('/devicesTypes')}>
              Виды поверок
            </button>
          </>
        )}
        <button onClick={() => navigate('/needPoverka')}>
          Приборы подлежащие поверке
        </button>
        <button onClick={() => navigate('/history')}>История</button>
        <button onClick={() => navigate('/reports')}>Отчетность</button>
        <button onClick={() => navigate('/')}>Выход</button>
      </div>
      {children}
    </div>
  );
});

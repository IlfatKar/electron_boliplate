import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line import/no-cycle
import { StateContext } from 'renderer/App';
import { IService } from './Services';

export default observer(function AddDevice() {
  const navigate = useNavigate();
  const state = useContext(StateContext);
  const [form, setForm] = useState<IService>({
    id: (state.edited as IService)?.id || 0,
    title: (state.edited as IService)?.title || '',
  });
  const [err, setErr] = useState('');
  return (
    <div className="AddClient">
      <h2>{state.edited ? 'Редактировать' : 'Добавить'} службу</h2>
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
        <button
          onClick={() => {
            navigate('/services');
          }}
        >
          Назад
        </button>
        <button
          onClick={() => {
            if (!form.title.length) {
              setErr('Поле `Название` пустое');
              return;
            }
            window.electron.ipcRenderer.sendMessage(
              state.edited ? 'EditService' : 'AddService',
              [form]
            );
            state.setEdited(null);
            navigate('/services');
          }}
        >
          {state.edited ? 'Редактировать' : 'Добавить'}
        </button>
        {err && <small>{err}</small>}
      </div>
    </div>
  );
});

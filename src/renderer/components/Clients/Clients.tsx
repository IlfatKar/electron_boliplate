import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Clients.css';
import { IClient } from './AddClient';

export default function Clients() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<IClient[]>([]);
  useEffect(() => {
    window.electron.ipcRenderer.once('getClients', (arg) => {
      setClients(arg as IClient[]);
    });
    window.electron.ipcRenderer.sendMessage('getClients', []);
  }, []);
  return (
    <div className="Clients">
      <h2>Список клиентов</h2>
      <div className="row header">
        <p>Фото</p>
        <p>ФИО</p>
        <p>Дата рождения</p>
        <p>Место жительства</p>
        <p>Телефон</p>
        <p>E-mail</p>
      </div>
      <div className="table">
        {clients.map((item) => (
          <div className="row" key={item.id}>
            <img src={item.image} alt="userImage" />
            <p>
              {item.soname} {item.name} {item.patronymic}
            </p>
            <p>{item.birth}</p>
            <p>
              {item.city} {item.street} {item.house} {item.floor}
            </p>
            <p>{item.phone}</p>
            <p>{item.email}</p>
          </div>
        ))}
      </div>
      <div className="btnWrapper">
        <button
          onClick={() => {
            navigate('/clients/add');
          }}
        >
          Добавить
        </button>
      </div>
    </div>
  );
}

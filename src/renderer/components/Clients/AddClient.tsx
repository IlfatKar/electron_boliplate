import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface IClient {
  id: number;
  name: string;
  soname: string;
  patronymic: string;
  birth: string;
  image: string;
  city: string;
  street: string;
  house: string;
  floor: string;
  phone: string;
  email: string;
}

export default function AddClient() {
  const navigate = useNavigate();
  const [form, setForm] = useState<IClient>({
    id: 0,
    name: '',
    soname: '',
    patronymic: '',
    birth: '',
    image: '',
    city: '',
    street: '',
    house: '',
    floor: '',
    phone: '',
    email: '',
  });
  const [err, setErr] = useState('');
  return (
    <div className="AddClient">
      <h2>Добавить нового клиента</h2>
      <div className="form">
        <label>
          <span>Изображение пользователя</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const reader = new FileReader();
              reader.onload = () => {
                if (reader.result) {
                  setForm((prev) => ({
                    ...prev,
                    image: (reader.result || '').toString(),
                  }));
                }
              };
              if (e.target.files) reader.readAsDataURL(e.target.files[0]);
            }}
          />
        </label>
        <label>
          <span>Фамилия</span>
          <input
            type="text"
            value={form.soname}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, soname: e.target.value }))
            }
          />
        </label>
        <label>
          <span>Имя</span>
          <input
            type="text"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </label>
        <label>
          <span>Отчество</span>
          <input
            type="text"
            value={form.patronymic}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, patronymic: e.target.value }))
            }
          />
        </label>
        <label>
          <span>Дата рождения</span>
          <input
            type="date"
            value={form.birth}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, birth: e.target.value }))
            }
          />
        </label>
        <label>
          <span>Город проживания</span>
          <input
            type="text"
            value={form.city}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, city: e.target.value }))
            }
          />
        </label>
        <label>
          <span>Улица проживания</span>
          <input
            type="text"
            value={form.street}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, street: e.target.value }))
            }
          />
        </label>
        <label>
          <span>Дом</span>
          <input
            type="text"
            value={form.house}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, house: e.target.value }))
            }
          />
        </label>
        <label>
          <span>Квартира</span>
          <input
            type="text"
            value={form.floor}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, floor: e.target.value }))
            }
          />
        </label>
        <label>
          <span>Телефон</span>
          <input
            type="text"
            value={form.phone}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, phone: e.target.value }))
            }
          />
        </label>
        <label>
          <span>E-mail</span>
          <input
            type="text"
            value={form.email}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, email: e.target.value }));
            }}
          />
        </label>
        <button
          onClick={() => {
            navigate('/clients');
          }}
        >
          Назад
        </button>
        <button
          onClick={() => {
            if (!form.soname.length) {
              setErr('Поле `Фамилия` пустое');
              return;
            }
            if (!form.name.length) {
              setErr('Поле `Имя` пустое');
              return;
            }
            if (!form.patronymic.length) {
              setErr('Поле `Отчество` пустое');
              return;
            }
            if (!form.email.length) {
              setErr('Поле `E-mail` пустое');
              return;
            }
            if (!form.birth.length) {
              setErr('Поле `Дата рождения` пустое');
              return;
            }
            if (!form.city.length) {
              setErr('Поле `Город` пустое');
              return;
            }
            if (!form.street.length) {
              setErr('Поле `Улица` пустое');
              return;
            }
            if (!form.house.length) {
              setErr('Поле `Дом` пустое');
              return;
            }
            if (!form.floor.length) {
              setErr('Поле `Квартира` пустое');
              return;
            }
            if (!form.phone.length) {
              setErr('Поле `Телефон` пустое');
              return;
            }
            if (form.name.match(/\d|(\.|,|\\|\/|\?|!|_|-)/gm)) {
              setErr('Поле `Имя` содержит недопустимые символы');
              return;
            }
            if (form.soname.match(/\d|(\.|,|\\|\/|\?|!|_|-)/gm)) {
              setErr('Поле `Фамилия` содержит недопустимые символы');
              return;
            }
            if (form.patronymic.match(/\d|(\.|,|\\|\/|\?|!|_|-)/gm)) {
              setErr('Поле `Отчество` содержит недопустимые символы');
              return;
            }
            if (!form.phone.match(/^\S+@\S+.\S+/gm)) {
              setErr('Поле `E-mail` не соответствует шаблону');
              return;
            }
            if (!form.email.match(/^\d{11}/gm)) {
              setErr('Поле `Телефон` не соответствует шаблону (7xxxxxxxxx)');
              return;
            }
            window.electron.ipcRenderer.sendMessage('addClient', [form]);
            navigate('/clients');
          }}
        >
          Добавить
        </button>
        {err && <small>{err}</small>}
      </div>
    </div>
  );
}

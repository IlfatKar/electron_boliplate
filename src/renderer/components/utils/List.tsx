import React from 'react';
import { useNavigate } from 'react-router-dom';

interface IListItem {
  item: object;
  title: string;
  field: string;
}

interface IListProps {
  title: string;
  list: IListItem[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onAdd?: string;
}

export default function List({
  onAdd,
  onEdit,
  onDelete,
  title,
  list,
}: IListProps) {
  const navigate = useNavigate();
  return (
    <div className="Clients">
      <h2>{title}</h2>
      <div className="objects col">
        {list.map(({ title, item, field }) => (
          <div key={item.id} className="item">
            <div>
              <p>
                {title}: {item[field]}
              </p>
            </div>
            <div className="btns">
              {onEdit && (
                <button onClick={() => onEdit(item.id)}>Редактировать</button>
              )}
              {onDelete && (
                <button onClick={() => onDelete(item.id)}>Удалить</button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="btnWrapper">
        {onAdd && <button onClick={() => navigate(onAdd)}>Добавить</button>}
      </div>
    </div>
  );
}

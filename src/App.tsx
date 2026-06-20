import { useEffect, useState } from 'react';

const URL = 'https://ee76ab0779f3481a.mokky.dev/users';

type User = {
  id: number;
  email: string;
  password: string;
  created_at: string;
};

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('id');

  const load = async (q = '', s = 'id') => {
    try {
      const p = new URLSearchParams();

      if (q) p.set('email', `*${q}*`);
      p.set('sortBy', s);

      const response = await fetch(`${URL}?${p}`);
      const data = await response.json();

      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const apply = (e: React.SyntheticEvent) => {
    e.preventDefault();
    load(search, sort);
  };

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'Arial' }}>
      <h1>Реестр пользователей</h1>

      <form onSubmit={apply}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по email"
        />
        <button type="submit">Найти</button>
        <button
          type="button"
          onClick={() => {
            setSearch('');
            load('', sort);
          }}
        >
          Сброс
        </button>
      </form>

      <div>
        {['id', 'email', 'created_at'].map((f) => (
          <button
            key={f}
            onClick={() => {
              setSort(f);
              load(search, f);
            }}
            style={{
              fontWeight: sort === f ? 'bold' : 'normal',
            }}
          >
            {f}
            {sort === f ? ' ▼' : ''}
          </button>
        ))}
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Пароль</th>
            <th>Создан</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.email}</td>
              <td>••••••••</td>
              <td>
                {new Date(u.created_at).toLocaleDateString('ru-RU')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
import { useState, useCallback } from 'react';
import type { SearchFilters, KodikTranslation } from '../types/kodik';
import { KODIK_API_TOKEN } from '../config/kodik';
import './SearchBar.css';

interface Props {
  onSearch: (filters: SearchFilters) => void;
  loading: boolean;
}

const defaultFilters: SearchFilters = {
  title: '',
  idType: 'shikimori_id',
  idValue: '',
  translationId: '',
  year: '',
  animeKind: '',
  animeStatus: '',
  limit: 25,
  withMaterialData: true,
};

export default function SearchBar({ onSearch, loading }: Props) {
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [translations, setTranslations] = useState<KodikTranslation[]>([]);
  const [transError, setTransError] = useState('');

  const update = useCallback(<K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const loadTranslations = async () => {
    setTransError('');
    try {
      const res = await fetch(`https://kodik-api.com/translations?token=${encodeURIComponent(KODIK_API_TOKEN)}`, {
        method: 'POST',
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setTranslations(data);
      } else {
        setTransError('Не удалось загрузить переводы');
      }
    } catch {
      setTransError('Ошибка загрузки переводов');
    }
  };

  const idOptions: { value: SearchFilters['idType']; label: string }[] = [
    { value: 'id', label: 'Kodik ID' },
    { value: 'shikimori_id', label: 'Shikimori ID' },
    { value: 'kinopoisk_id', label: 'Kinopoisk ID' },
    { value: 'imdb_id', label: 'IMDb ID' },
    { value: 'mdl_id', label: 'MyDramaList ID' },
    { value: 'worldart_link', label: 'WorldArt ссылка' },
  ];

  return (
    <form className="searchbar" onSubmit={handleSubmit}>
      <h2 className="searchbar__title">Комбинаторный поиск Kodik API</h2>
      <div className="searchbar__grid">
        <div className="searchbar__field">
          <label htmlFor="title">Название</label>
          <input
            id="title"
            value={filters.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="Например, Наруто"
          />
        </div>

        <div className="searchbar__row" style={{ gridColumn: '1 / -1' }}>
          <div className="searchbar__field">
            <label htmlFor="idType">Тип ID</label>
            <select id="idType" value={filters.idType} onChange={(e) => update('idType', e.target.value as SearchFilters['idType'])}>
              {idOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="searchbar__field">
            <label htmlFor="idValue">Значение ID</label>
            <input
              id="idValue"
              value={filters.idValue}
              onChange={(e) => update('idValue', e.target.value)}
              placeholder="Введите ID"
            />
          </div>
        </div>

        <div className="searchbar__field">
          <label htmlFor="year">Год выхода</label>
          <input
            id="year"
            type="number"
            value={filters.year}
            onChange={(e) => update('year', e.target.value)}
            placeholder="2024"
          />
        </div>

        <div className="searchbar__field">
          <label htmlFor="translationId">Студия / Перевод</label>
          <select
            id="translationId"
            value={filters.translationId}
            onChange={(e) => update('translationId', e.target.value)}
          >
            <option value="">Любая</option>
            {translations.map((t) => (
              <option key={t.id} value={t.id}>{t.title} ({t.type === 'voice' ? 'озвучка' : 'субтитры'})</option>
            ))}
          </select>
        </div>

        <div className="searchbar__field">
          <label htmlFor="animeKind">Тип аниме</label>
          <select id="animeKind" value={filters.animeKind} onChange={(e) => update('animeKind', e.target.value as SearchFilters['animeKind'])}>
            <option value="">Любой</option>
            <option value="tv">TV Сериал</option>
            <option value="movie">Фильм</option>
            <option value="ova">OVA</option>
            <option value="ona">ONA</option>
            <option value="special">Спешл</option>
            <option value="music">Music</option>
          </select>
        </div>

        <div className="searchbar__field">
          <label htmlFor="animeStatus">Статус</label>
          <select id="animeStatus" value={filters.animeStatus} onChange={(e) => update('animeStatus', e.target.value as SearchFilters['animeStatus'])}>
            <option value="">Любой</option>
            <option value="ongoing">Онгоинг</option>
            <option value="released">Вышел</option>
            <option value="announced">Анонс</option>
          </select>
        </div>

        <div className="searchbar__field">
          <label htmlFor="limit">Лимит</label>
          <input
            id="limit"
            type="number"
            min={1}
            max={100}
            value={filters.limit}
            onChange={(e) => update('limit', Number(e.target.value))}
          />
        </div>

        <div className="searchbar__field" style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <input
            id="withMaterialData"
            type="checkbox"
            checked={filters.withMaterialData}
            onChange={(e) => update('withMaterialData', e.target.checked)}
          />
          <label htmlFor="withMaterialData" style={{ margin: 0 }}>С материалами (постер, описание)</label>
        </div>
      </div>

      <div className="searchbar__actions">
        <button className="searchbar__btn" type="submit" disabled={loading}>
          {loading ? 'Поиск...' : 'Найти'}
        </button>
        <button className="searchbar__btn searchbar__btn--secondary" type="button" onClick={loadTranslations}>
          Загрузить переводы
        </button>
        <button className="searchbar__btn searchbar__btn--secondary" type="button" onClick={() => setFilters(defaultFilters)}>
          Сбросить
        </button>
      </div>

      {transError ? <div className="searchbar__hint" style={{ color: '#ff7a7a' }}>{transError}</div> : null}
      <div className="searchbar__hint">
        Если указаны Название или ID — используется /search. Иначе — /list. Параметры комбинируются.
      </div>
    </form>
  );
}
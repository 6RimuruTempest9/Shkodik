import { useState, useCallback } from 'react';
import SearchBar from '../components/SearchBar';
import AnimeCard from '../components/AnimeCard';
import type { KodikResult, KodikResponse, SearchFilters } from '../types/kodik';
import { KODIK_API_TOKEN } from '../config/kodik';
import './SearchPage.css';

export default function SearchPage() {
  const [results, setResults] = useState<KodikResult[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = useCallback(async (filters: SearchFilters) => {
    setLoading(true);
    setError('');
    setResults([]);
    setTotal(0);

    const params = new URLSearchParams();
    params.append('token', KODIK_API_TOKEN);
    if (filters.title) params.append('title', filters.title);
    if (filters.idValue) params.append(filters.idType, filters.idValue);
    if (filters.translationId) params.append('translation', filters.translationId);
    if (filters.year) params.append('year', filters.year);
    if (filters.animeKind) params.append('anime_kind', filters.animeKind);
    if (filters.animeStatus) params.append('anime_status', filters.animeStatus);
    params.append('limit', filters.limit.toString());
    if (filters.withMaterialData) params.append('with_material_data', '1');

    const useSearch = filters.title || filters.idValue;
    const endpoint = useSearch ? 'https://kodik-api.com/search' : 'https://kodik-api.com/list';

    try {
      const res = await fetch(`${endpoint}?${params.toString()}`, {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error(`Ошибка: ${res.status} ${res.statusText}`);
      }

      const data: KodikResponse = await res.json();
      setResults(data.results);
      setTotal(data.total);

      if (data.total === 0) {
        setError('Ничего не найдено. Попробуйте изменить параметры поиска.');
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Неизвестная ошибка';
      setError(`Ошибка поиска: ${msg}`);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="searchpage">
      <header className="searchpage__header">
        <h1>Поиск аниме — Kodik API</h1>
        <p>Комбинаторный поиск с фильтрами по названию, ID, студии, году и другим параметрам</p>
      </header>

      <div className="searchpage__content">
        <SearchBar onSearch={handleSearch} loading={loading} />

        {error ? (
          <div className="searchpage__error">{error}</div>
        ) : (
          <div className="searchpage__results">
            {results.length > 0 && (
              <div className="searchpage__count">
                Найдено: <strong>{total}</strong>
              </div>
            )}
            <div className="searchpage__grid">
              {results.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
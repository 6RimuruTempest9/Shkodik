import type { KodikResult } from '../types/kodik';
import './AnimeCard.css';

interface Props {
  anime: KodikResult;
}

export default function AnimeCard({ anime }: Props) {
  const md = anime.material_data;
  const poster = md?.anime_poster_url || md?.poster_url || '';
  const studios = anime.anime_studios?.join(', ') || md?.anime_studios?.join(', ') || anime.translation?.title || '';
  const status = md?.anime_status || md?.all_status || '';
  const kind = md?.anime_kind || '';
  const year = anime.year || md?.year;

  return (
    <article className="anime-card">
      {poster ? (
        <img className="anime-card__poster" src={poster} alt={anime.title} loading="lazy" />
      ) : (
        <div className="anime-card__poster" style={{ display: 'grid', placeItems: 'center', color: '#555' }}>
          Нет постера
        </div>
      )}
      <div className="anime-card__body">
        <h3 className="anime-card__title">{anime.title}</h3>
        <div className="anime-card__meta">
          {year ? <span className="anime-card__badge">{year}</span> : null}
          {kind ? <span className="anime-card__badge anime-card__badge--accent">{kind.toUpperCase()}</span> : null}
          {status ? <span className="anime-card__badge">{status}</span> : null}
          {anime.episodes_count ? (
            <span className="anime-card__badge">{anime.episodes_count} эп.</span>
          ) : null}
        </div>
        {studios ? <div className="anime-card__studios">{studios}</div> : null}
        {md?.description || md?.anime_description ? (
          <p className="anime-card__desc">{md.description || md.anime_description}</p>
        ) : null}
        <a
          className="anime-card__link"
          href={`https:${anime.link}`}
          target="_blank"
          rel="noreferrer"
        >
          Смотреть на Kodik
        </a>
      </div>
    </article>
  );
}

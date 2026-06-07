import classNames from 'classnames';

import { useToggle } from './../../hooks';

import './PlayPauseButton.scss';

import playIcon from './../../assets/play.svg';
import pauseIcon from './../../assets/pause.svg';

export default function PlayPauseButton() {
    const [isPlaying, togglePlaying] = useToggle(false);

    const buttonClassName = classNames('play-pause-button', {
        'play-pause-button--playing': isPlaying
    });

    return (
        <button
            className={buttonClassName}
            onClick={togglePlaying}
        >
            <img
                className="play-pause-button__icon"
                alt={isPlaying ? "Pause" : "Play"}
                src={isPlaying ? pauseIcon : playIcon}
            />
        </button>
    );
}
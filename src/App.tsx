import PlayPauseButton from "./components/PlayPauseButton/PlayPauseButton"

function App() {
  return (
    <>
      <video
        controls
        height={350}
      >
        <source
          src="https://cloud.solodcdn.com/useruploads/782065c9-1287-4a5f-8f67-0057040ae1c1/c9db7cb5a00716f565364918ce7ac15c:2026060720/720.mp4"
          type="video/mp4"
        >
        </source>
      </video>
      <PlayPauseButton />
    </>
  )
}

export default App

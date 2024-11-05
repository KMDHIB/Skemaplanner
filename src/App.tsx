import reactLogo from './assets/uvdata.svg'
import './App.scss'
import Timetable from './components/Timetable.tsx'

function App() {
  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Skemaplanner</h1>
      <div className='myBox'>
      <Timetable />
      </div>
    </>
  )
}

export default App

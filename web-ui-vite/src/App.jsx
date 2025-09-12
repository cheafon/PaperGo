import {useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Result from './components/Result.jsx'

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <div className={'searchInput'}>
                <input />
            </div>
            <div className={'result'}>
                <Result/>
            </div>
        </>
    )
}

export default App

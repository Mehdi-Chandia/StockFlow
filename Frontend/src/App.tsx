
import { ToastContainer } from 'react-toastify'
import './App.css'
import AppRoutes from './app/AppRoutes'

function App() {

  return (
    <>
    <div className='min-h-screen text-white bg-[#111315]'>
      <AppRoutes/>
        <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        closeOnClick
        pauseOnHover
      />
    </div>
    </>
  )
}

export default App

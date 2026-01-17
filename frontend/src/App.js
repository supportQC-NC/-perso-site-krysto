import React from 'react'
import HomeScreen from './screens/HomeScreen'
import Header from './components/global/Header'
import Footer from './components/global/Footer'

const App = () => {
  return (
    <>
   <Header/>
    <main>
      <HomeScreen/>
    </main>
<Footer/>
    </>
  )
}

export default App
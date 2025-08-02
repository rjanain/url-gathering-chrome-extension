import React from 'react'


import { Header, HomeTab, OptionTab } from './components/Home'



function App() {


  return (
    <>
      <div className="container text-center">
        <div className="row">
          <div className="col-md-12">
            <div id="myTabContent" className="tab-content">
              <Header />

              <HomeTab />

              <OptionTab />

            </div>
          </div>
        </div>
      </div>
    </>
  )
}


export default App

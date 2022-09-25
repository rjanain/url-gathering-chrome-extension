import React from "react"
import { HomeCard } from "./home/HomeCard"
import { OptionCard } from "./options/OptionCard"

  


export function Header() {
    return (
        <>
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <a className="nav-link active" data-bs-toggle="tab" href="#home">Home</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" data-bs-toggle="tab" href="#option">Settings</a>
                </li>
            </ul>
        </>
    )
}

export function HomeTab(props) {

    return (
        <>
            <div className="tab-pane fade active  show" id="home">
                
                <div className="card border-dark mt-1" id="card-body">
                    <h4 className="card-header">
                        Automic URL Gathering 
                    </h4>
                    
                     <HomeCard/>


                </div>
            </div>
        </>
    )
}


export function OptionTab() {



    return (
        <>
            <div className="tab-pane fade show" id="option">
                <div className="card border-dark mt-1" id="card-body">
                    <h4 className="card-header">
                        Settings
                    </h4>

                     <OptionCard/>

                </div>
            </div>
        </>
    )
}
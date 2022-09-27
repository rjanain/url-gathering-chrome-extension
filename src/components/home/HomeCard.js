import React, { useEffect, useState } from "react"
import {Button, Stack } from "react-bootstrap";
import { getTabs } from "./API/chromeAPI"
import CreateIcon from "./icon/Icon"

 
export const HomeCard = (props) => {

  const [tabs, setTabs] = useState([])
  const [copyRequest, setCopyRequest] = useState({})



  useEffect(() => {
    getTabs().then(
      (res) => {
        console.log(res)
        setTabs(res)
      }
    )
  }
    , [])



  const handleListClickEvent = (e) => {
    console.log("You have clicked this list")
    console.log(e.target.id)
    setCopyRequest({
      [e.target.id]: true
    })
  }



  return (
    <>
      
          <Stack
            direction="horizontal"
            className="justify-content-between"
          >
            {
              tabs
                ? tabs.map((el, index) => {
                  return (
                    <CreateIcon
                      onClick={handleListClickEvent}
                      key={index}
                      index={index}
                      title={el?.title}
                      url={el?.url}
                      favIconUrl={el?.favIconUrl}
                      isCopied={copyRequest[index]}
                    />
                  )
                })
                : null
            }

          </Stack>

          <Button size="sm" variant="outline-primary">Go somewhere</Button>
    </>
  );
}


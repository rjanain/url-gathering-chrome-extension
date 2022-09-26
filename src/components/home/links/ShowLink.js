import React, { useEffect, useState } from 'react';
 
import ListGroup from 'react-bootstrap/ListGroup';
import { getTabs } from './chromeAPI';
import List from './List';





export default function ShowLink() {

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



  const handleListClickEvent =(e)=>{
    console.log("You have clicked this list")
    console.log(e.target.id)
    setCopyRequest({
      [e.target.id]: true
    })
  }



  return (
    <>
      <ListGroup variant="flush">
        {
          tabs
            ? tabs.map((el, index) => {
              return (
                 <List 
                  onClick={handleListClickEvent}
                  key={index} 
                  index={index} 
                  title = {el?.title} 
                  url={el?.url} 
                  isCopied={copyRequest[index] } 
                  />
              )
            })
            : null
        }
      </ListGroup>
    </>
  );
}


/*
<Badge bg="primary" pill>
                    copied
                  </Badge>
                  */
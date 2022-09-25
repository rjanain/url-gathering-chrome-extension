import React, { useEffect, useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import { getTabs } from './chromeAPI';





export default function ShowLink() {

  const [tabs, setTabs] = useState([])


  useEffect(() => {
    getTabs().then(
      (res) => {
        console.log(res)
        setTabs(res)
      }
    )
  }
    , [])





  return (
    <>
      <ListGroup variant="flush">
        {
          tabs
            ? tabs.map((el, index) => {
              return (
                <ListGroup.Item
                  key={index}
                  as="li"
                  className="d-flex justify-content-between align-items-start"
                >
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">{el.title}</div>
                  </div>
                  <Badge bg="primary" pill>
                    copied
                  </Badge>
                </ListGroup.Item>
              )
            })
            : null
        }
      </ListGroup>
    </>
  );
}

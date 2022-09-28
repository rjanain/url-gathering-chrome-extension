import React from "react"
import { Card } from "react-bootstrap"



export const OptionCard = (props) => {
  return (
    <>
      <Card.Body>
        <Card.Text>
          Provide option to choose Separator and store that data into local storage sync file.
          Before running each app it will first check whethr there is user specified separator is
          there or not in the local storage. If does, then it will use that as separator. 
        </Card.Text>
        
      </Card.Body>

    </>
  )
}
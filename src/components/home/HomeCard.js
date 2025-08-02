import React, { useEffect, useState } from "react"
import Badge from 'react-bootstrap/Badge';
import { Stack } from "react-bootstrap";
import { getTabs } from "../api/chromeAPI"
import { getLink } from "../api/copyAPI";
import CopyAllButton from "./icon/CopyAllButton";
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



  const handleListClickEvent = async (e) => {
    console.log("You have clicked: " + e.target.id)
    console.log(e)

    var filteredTabs = tabs;


    if (e.target.id === 'copyHighlighted') {
      // Remove all non-highlighted tabs
      filteredTabs = tabs.filter((el) => {
        return (el.highlighted)
      })

    }


    await navigator.clipboard.writeText(await getLink(e.target.id, filteredTabs))

    setCopyRequest({
      [e.target.id]: true
    })
    
    setTimeout(() => {
      // Removed copied badge after few seconds
      setCopyRequest({
        [e.target.id]: false
      })
    }, 1000)
  }



  return (
    <>
      <div className="mb-2">
        <small>The icon of the active page will appear larger than other icons.</small>
      </div>


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
                  active={el?.active}
                  isCopied={copyRequest[index]}
                />
              )
            })
            : null
        }



      </Stack>


      <Stack
        direction="vertical"
        className="mx-auto"
        gap={2}
      >


        <CopyAllButton
          onClick={handleListClickEvent}
          isCopied={copyRequest["copyAll"]}
          text={"Copy All"}
          variant="outline-warning"
          id="copyAll"
        />

        {
          tabs.filter(el => { return (el.highlighted) }).length > 0
            ? (
              <CopyAllButton
                onClick={handleListClickEvent}
                variant="outline-dark"
                isCopied={copyRequest["copyHighlighted"]}
                id="copyHighlighted"
                text={"Copy Highlighted"}
              />
            )
            : null
        }


        {
          copyRequest["copyHighlighted"] || copyRequest["copyAll"] 
          ? (
            <div className="mt-1">
              <Badge bg="success" pill>
                All Url has been copied
              </Badge>
            </div>
          ) : null
        }





      </Stack>
    </>
  );
}


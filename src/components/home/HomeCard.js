import React, { useEffect, useState } from "react"
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
    await navigator.clipboard.writeText(await getLink(e.target.id, tabs))
    setCopyRequest({
      [e.target.id]: true
    })
    setTimeout(() => {
      // Removed copied badge after few seconds
      setCopyRequest({
        [e.target.id]: false
      })
    }, 5000)
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



      <CopyAllButton
        onClick={handleListClickEvent}
        isCopied={copyRequest["copyAll"]}
        id="copyAll"
      />
    </>
  );
}


import React, { useEffect, useState } from "react"
import { Stack } from "react-bootstrap";
import { getTabs } from "./API/chromeAPI"
import CopyAllButton from "./icon/CopyAllButton";
import CreateIcon from "./icon/Icon"


export const HomeCard = (props) => {

  const [tabs, setTabs] = useState([])
  const [copyRequest, setCopyRequest] = useState({})

  const getLink = (id) => {
    const seperator = "\r\n" // for new line
    const res = (id == "copyAll")
      ? tabs.map(el => { return el.url }).join(seperator)
      : tabs[id].url

    return res
  }


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
    console.log("You have clicked: " + e.target.id)
    console.log(e)
    navigator.clipboard.writeText(getLink(e.target.id))
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

      <CopyAllButton
        onClick={handleListClickEvent}
        isCopied={copyRequest["copyAll"]}
        id="copyAll"
      />
    </>
  );
}


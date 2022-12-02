import React, { useEffect, useState } from "react";
import "./Doughtnut.css";
import DoughnutSegment from "./DoughnutSegment";
import axios from "axios";

interface DoughnutSegmentData {
  segmentState: string;
  description: string;
  childNumber: number;
}

export async function getDoughnutData() {
  return await axios.get("http://localhost:3001");
}

const Doughnut: React.FC = () => {
  // console.log("re-render time!");
  const [doughnutSegmentData, setDoughnutSegmentData] = useState([{}]);
  const [uiHeadingMessage, setUiHeadingMessage] = useState("Default Text");

  function doughnutDataAlgorythm(d: any) {
    const maxChildren = 12;
    if (d.length !== maxChildren) {
      let sortedData = [...d];
      // ? LOGIC USED: LOOP THROUGH THE CHILD NUMBERS AND FILL GAPS
      // ? EG: [pD.cN 1 == 1, pD.cN 2 == 2, pD.cN 3 != 3... make pD.cN 3 == 3]
      for (let i = 1; i < maxChildren + 1; i++) {
        sortedData.sort(({ childNumber: a }, { childNumber: b }) => a - b);

        if (sortedData[i - 1] === undefined) {
          sortedData.push({
            segmentState: "inactive",
            description: "",
            childNumber: i,
          });
          sortedData.sort(({ childNumber: a }, { childNumber: b }) => a - b);
          continue;
        }

        if (sortedData[i - 1].childNumber !== i) {
          sortedData.push({
            segmentState: "inactive",
            description: "",
            childNumber: i,
          });
          sortedData.sort(({ childNumber: a }, { childNumber: b }) => a - b);
          continue;
        }

        if (sortedData[i - 1].childNumber === i) {
          sortedData.sort(({ childNumber: a }, { childNumber: b }) => a - b);
          continue;
        }
      }
      return sortedData;
    }
    return d;
  }

  const newDataCall = async () => {
    console.log("new fetch of data...");
    setDoughnutSegmentData([{}]);
    setUiHeadingMessage("Loading your data");
    let response = await getDoughnutData();
    setTimeout(() => {
      let processedData = [...response.data];
      let endResult = doughnutDataAlgorythm(processedData);
      setDoughnutSegmentData(endResult as any[]);
    }, 500);
  };

  useEffect(() => {
    const firstDataCall = async () => {
      console.log("first fetch of data...");
      setUiHeadingMessage("Loading your data");
      let response = await getDoughnutData();
      let processedData = [...response.data];
      let endResult = doughnutDataAlgorythm(processedData);
      setTimeout(() => {
        setDoughnutSegmentData(endResult as any[]);
        setUiHeadingMessage("Click the segments to edit!");
      }, 2000);
    };
    firstDataCall();
  }, []);

  return (
    <div className="doughnut-container">
      <h2 className="doughnut-container__heading">{uiHeadingMessage}</h2>
      <div className="doughnut-container__doughnut">
        <div className="doughnut-container__doughnut__doughnut-hole"></div>
        <div id="Guidelines">
          <div className="doughnut-container_doughnut_guide-line--1"></div>
          <div className="doughnut-container_doughnut_guide-line--2"></div>
          <div className="doughnut-container_doughnut_guide-line--3"></div>
          <div className="doughnut-container_doughnut_guide-line--4"></div>
          <div className="doughnut-container_doughnut_guide-line--5"></div>
          <div className="doughnut-container_doughnut_guide-line--6"></div>
          <div className="doughnut-container_doughnut_guide-line--7"></div>
          <div className="doughnut-container_doughnut_guide-line--8"></div>
          <div className="doughnut-container_doughnut_guide-line--9"></div>
          <div className="doughnut-container_doughnut_guide-line--10"></div>
          <div className="doughnut-container_doughnut_guide-line--11"></div>
          <div className="doughnut-container_doughnut_guide-line--12"></div>
        </div>
        <div id="doughnutSegmentContainer">
          {/*// TODO - ASSIGN PROPER TYPE TO SEGMENT */}
          {doughnutSegmentData.length !== 1 ? (
            doughnutSegmentData.map((segment: any) => (
              <DoughnutSegment
                childNumber={segment.childNumber}
                key={segment.childNumber}
                status={segment.segmentState}
                description={segment.description}
                closeSegmentFunction={() => {
                  console.log("Bubble up recieved. Calling new data...");
                  newDataCall();
                }}
              />
            ))
          ) : (
            <>
              <div className="doughnut-container__loading-container">
                <div className="doughnut-container__loading-container__icon"></div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doughnut;

import React, { useEffect, useState } from "react";
import "./Doughtnut.css";
import YearDataModal from "./YearDataModal";
import DoughnutSegment from "./DoughnutSegment";
import axios from "axios";

interface DoughnutSegmentData {
  segmentState: string;
  description: string;
  childNumber: number;
}

export const MONTH_NAME_KEY = {
  1: "January",
  2: "Feburary",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
  13: "ERROR: MONTHNAME NOT FOUND",
};

export async function getDoughnutData() {
  return await axios.get("http://localhost:3001");
}

const Doughnut: React.FC = () => {
  const [doughnutSegmentData, setDoughnutSegmentData] =
    useState<DoughnutSegmentData[]>();
  const [uiHeadingMessage, setUiHeadingMessage] = useState("Default Text");
  const [isActive, setIsActive] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [wholeYearOfData, setWholeYearOfData] = useState([{}]);

  function doughnutDataAlgorythmAndUiSetter(d: DoughnutSegmentData[]) {
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
      setIsActive("inactive");
      setWholeYearOfData([{ hmmm: "how did you get in here?" }]);
      setUiHeadingMessage("Fill in your year!");
      return sortedData;
    }
    setIsActive("active");
    setWholeYearOfData(
      d.sort(({ childNumber: a }, { childNumber: b }) => a - b)
    );
    setUiHeadingMessage("Check out your year!");
    return d;
  }

  const newDataCall = async () => {
    console.log("new fetch of data...");
    setIsActive("inactive");
    setUiHeadingMessage("Loading your data");
    let response = await getDoughnutData();
    setTimeout(() => {
      let processedData = [...response.data];
      let endResult = doughnutDataAlgorythmAndUiSetter(processedData);
      setDoughnutSegmentData(endResult as any[]);
    }, 500);
  };

  useEffect(() => {
    const firstDataCall = async () => {
      console.log("first fetch of data...");
      setIsActive("inactive");
      setUiHeadingMessage("Loading your data");
      let response = await getDoughnutData();
      setTimeout(() => {
        let processedData = [...response.data];
        let endResult = doughnutDataAlgorythmAndUiSetter(processedData);
        setDoughnutSegmentData(endResult as any[]);
      }, 500);
    };
    firstDataCall();
  }, []);

  return (
    <div className="doughnut-container">
      <button
        className={`doughnut-container__heading--${isActive}`}
        onClick={() => setIsOpen(true)}
      >
        {uiHeadingMessage}
      </button>
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
          {doughnutSegmentData?.length !== undefined ? (
            doughnutSegmentData?.map((segment: DoughnutSegmentData) => (
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
      <YearDataModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        allData={wholeYearOfData}
      ></YearDataModal>
    </div>
  );
};

export default Doughnut;

import React, { useEffect, useState } from "react";
import "./styles/Doughtnut.css";
import YearDataModal from "./YearDataModal";
import DoughnutSegment from "./DoughnutSegment";
import axios from "axios";

interface DoughnutSegmentData {
  segmentState: string;
  description: string;
  childNumber: number;
  _id: string;
}

export const PROXY = "http://localhost:3001";

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

const Doughnut: React.FC = () => {
  const [doughnutSegmentData, setDoughnutSegmentData] =
    useState<DoughnutSegmentData[]>();
  const [uiHeadingMessage, setUiHeadingMessage] = useState("");
  const [isActive, setIsActive] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [wholeYearOfData, setWholeYearOfData] = useState([{}]);

  async function getDoughnutData() {
    console.log("Sending req - let's get this bread");
    return await axios
      .get(`${PROXY}/segments`)
      // .get(`/segments`)
      .catch((err) => console.error(err));
  }

  // ? Automatically fetches data if it doesn't load on first try
  // setInterval(() => {
  //   let response = getDoughnutData()
  //     .then(() => {
  //       if (response === undefined) return (response.data = {});
  //     })
  //     .catch((e) => console.error(e));
  //   let processedData = [...response.data];
  //   let endResult = doughnutDataAlgorythmAndUiSetter(processedData);
  //   setDoughnutSegmentData(endResult as any[]);
  // }, 3000);

  function doughnutDataAlgorythmAndUiSetter(d: DoughnutSegmentData[]) {
    const maxChildren = 12;
    if (d.length !== maxChildren) {
      let sortedData = [...d];
      // ? LOGIC USED: LOOP THROUGH THE CHILD NUMBERS AND FILL GAPS
      // ? EG: [pD.cN 1 == 1, pD.cN 2 == 2, pD.cN 3 != 3... make pD.cN 3 == 3]
      for (let i = 1; i < maxChildren + 1; i++) {
        sortedData.sort(({ childNumber: a }, { childNumber: b }) => a - b);

        const innactiveSegment = {
          segmentState: "inactive",
          description: "",
          childNumber: i,
          _id: `inactive-segment-number${i}`,
        };

        if (sortedData[i - 1] === undefined) {
          sortedData.push(innactiveSegment);
          sortedData.sort(({ childNumber: a }, { childNumber: b }) => a - b);
          continue;
        }

        if (sortedData[i - 1].childNumber !== i) {
          sortedData.push(innactiveSegment);
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
    setUiHeadingMessage("Loading your data");
    setDoughnutSegmentData(undefined);
    setTimeout(async () => {
      let response = await getDoughnutData().catch((e) => console.error(e));
      let processedData = [...response?.data];
      let endResult = doughnutDataAlgorythmAndUiSetter(processedData);
      setDoughnutSegmentData(endResult as any[]);
      console.log("Response received");
    }, 500);
  };

  useEffect(() => {
    const firstDataCall = async () => {
      setIsActive("inactive");
      setUiHeadingMessage("Loading your data");
      let response = await getDoughnutData();
      setTimeout(() => {
        let processedData = [...response?.data];
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
        <div id="doughnutSegmentContainer">
          {doughnutSegmentData !== undefined ? (
            doughnutSegmentData?.map((segment: DoughnutSegmentData) => (
              <DoughnutSegment
                childNumber={segment.childNumber}
                key={segment._id}
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
        allData={wholeYearOfData as []}
      ></YearDataModal>
    </div>
  );
};

export default Doughnut;

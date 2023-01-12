import React, { useEffect, useState } from "react";
import YearDataModal from "./YearDataModal";
import DoughnutSegment from "./DoughnutSegment";
import axios from "axios";
import "./styles/Doughtnut.css";

interface DoughnutSegmentData {
  segmentState: string;
  description: string;
  childNumber: number;
  _id: string;
}

export const PROXY =
  "https://australia-southeast1-year-of-the-donut.cloudfunctions.net/server";

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

export const AXOIS_TIMEOUT_DURATION = 2000;

export const MODAL_CSS_TRANSFORM_DURATION = 500;

const Doughnut: React.FC = () => {
  const [doughnutSegmentData, setDoughnutSegmentData] =
    useState<DoughnutSegmentData[]>();
  const [uiHeadingMessage, setUiHeadingMessage] = useState("");
  const [isActive, setIsActive] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [wholeYearOfData, setWholeYearOfData] = useState([{}]);

  async function getDoughnutData() {
    let res = await axios
      .get(`${PROXY}/segments`)
      .catch((err) => console.error(err));
    if (res === undefined) console.error("could not get /segments");
    console.log(res);
    return res?.data;
  }

  async function doughnutDataAlgorythmAndUiSetter(d: DoughnutSegmentData[]) {
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

  async function dataCall() {
    let response = await getDoughnutData();
    let end = [...response];
    return end;
  }

  useEffect(() => {
    setIsActive("inactive");
    setUiHeadingMessage("Loading... please wait");
    dataCall().then((rawData) =>
      doughnutDataAlgorythmAndUiSetter(rawData).then((processedData) =>
        setDoughnutSegmentData(processedData)
      )
    );
  }, []);

  return (
    <div className="doughnut-container">
      <button
        className={`doughnut-container__heading--${isActive}`}
        onClick={() => {
          if (isActive === "active") {
            setIsOpen(true);
          }
        }}
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
                  setUiHeadingMessage("Making your donut!");
                  dataCall().then((rawData) =>
                    doughnutDataAlgorythmAndUiSetter(rawData).then(
                      (processedData) => setDoughnutSegmentData(processedData)
                    )
                  );
                }}
                setUserDataToUndefined={() => {
                  setDoughnutSegmentData(undefined);
                  setUiHeadingMessage("Sending month to dounut...");
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
        allData={wholeYearOfData as DoughnutSegmentData[]}
      ></YearDataModal>
    </div>
  );
};

export default Doughnut;

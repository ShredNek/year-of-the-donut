import React from "react";
import ReactDom from "react-dom";
import "./styles/YearDataModal.css";
import { TfiClose } from "react-icons/tfi";
import { MONTH_NAME_KEY } from "./Doughnut";
import { createYearDataPdf } from "./makeYearDataPdf";

interface PortalChildren {
  isOpen: boolean;
  onClose: React.MouseEventHandler<HTMLButtonElement>;
  allData: DoughnutSegmentDataModel[];
}

class DoughnutSegmentDataModel {
  segmentState = "active";
  description: string;
  childNumber: number;
  _id: string;
}

const CreateViewPortal: React.FC<PortalChildren> = ({
  isOpen,
  onClose,
  allData,
}: PortalChildren) => {
  const onCloseAndDoNotEditData = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    onClose(e);
  };

  // ? we're adding in a dynamic variable so that state also controls
  // ? if we can see this portal or not
  return ReactDom.createPortal(
    <>
      <div className={`year-data-modal__interface--${isOpen}`}>
        <button
          className="year-data-modal__close-button"
          onClick={onCloseAndDoNotEditData}
        >
          <TfiClose />
        </button>
        <h2 className="year-data-modal__title">
          Your story of {new Date().getFullYear()}
        </h2>
        <div className="year-data-modal__month-details">
          {allData.length === 12
            ? allData.map((i: DoughnutSegmentDataModel) => (
                <div key={i._id}>
                  <h3>{MONTH_NAME_KEY[i.childNumber]}</h3>
                  <p>{i.description}</p>
                </div>
              ))
            : ""}
        </div>
        <button
          className="year-data-modal__download-button"
          onClick={() => {
            createYearDataPdf(allData);
          }}
        >
          Download your {new Date().getFullYear()}
        </button>
      </div>
      <div className={`year-data-modal__overlay--${isOpen}`}></div>
    </>,
    document.getElementById("year-data-portal-root") as HTMLElement
  );
};

export default CreateViewPortal;

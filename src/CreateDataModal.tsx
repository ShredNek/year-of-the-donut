import React, { useRef } from "react";
import ReactDom from "react-dom";
import "./styles/CreateDataModal.css";
import { TfiClose } from "react-icons/tfi";
import axios from "axios";
import { MONTH_NAME_KEY, PROXY } from "./Doughnut";

interface Modal {
  isOpen: boolean;
  onClose: React.MouseEventHandler;
  doughnutSegmentChildNumber: number;
}

class DoughnutSegmentDataModel {
  segmentState = "active";
  description: string;
  childNumber: number;
}

const CreateDataPortal: React.FC<Modal> = ({
  doughnutSegmentChildNumber,
  isOpen,
  onClose,
}: Modal) => {
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  let newDoughnutSegmentData = new DoughnutSegmentDataModel();

  const onCloseAndDoNotSaveData = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose(e);
  };

  const onCloseAndSaveData = async (e: React.MouseEvent) => {
    // e.preventDefault();
    // location.reload();

    newDoughnutSegmentData.description = descriptionRef.current!.value;
    newDoughnutSegmentData.childNumber = doughnutSegmentChildNumber;

    if (descriptionRef.current!.value === "" || undefined) {
      return window.alert("Looks like didn't input any data! Try again");
    }
    console.log(
      `Apparently we have: ${Object.entries(newDoughnutSegmentData)}`
    );

    axios
      .post(`${PROXY}/segments`, newDoughnutSegmentData)
      .catch((err) => console.log(err))
      .then((res) => console.log(res));
    onClose(e);
  };

  // ? I'm adding in a dynamic variable so that state also controls
  // ? if this portal is visible to the user or not

  return ReactDom.createPortal(
    <>
      <div className={`create-modal__interface--${isOpen}`}>
        <button
          className="create-modal__close-button"
          onClick={onCloseAndDoNotSaveData}
        >
          <TfiClose />
        </button>
        <h2 className="create-modal__title">
          {MONTH_NAME_KEY[doughnutSegmentChildNumber]}
        </h2>
        <form className="create-modal__form-details">
          <h3 className="create-modal__form-details__form-heading">
            So, what did we do on this month?
          </h3>
          <textarea
            required
            className="create-modal__form-details__textarea"
            ref={descriptionRef}
          />
        </form>
        <button
          className="create-modal__submit-button"
          onClick={onCloseAndSaveData}
        >
          Time to TimeCount
        </button>
      </div>
      <div className={`create-modal__overlay--${isOpen}`}></div>
    </>,
    document.getElementById("create-portal-root") as HTMLElement
  );
};

export default CreateDataPortal;

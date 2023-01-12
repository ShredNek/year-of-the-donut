import React, { useRef } from "react";
import ReactDom from "react-dom";
import "./styles/CreateDataModal.css";
import { TfiClose } from "react-icons/tfi";
import axios from "axios";
import { MONTH_NAME_KEY, PROXY, AXOIS_TIMEOUT_DURATION } from "./Doughnut";

interface Modal {
  isOpen: boolean;
  onSaveClose: Function;
  onNoSaveClose: Function;
  doughnutSegmentChildNumber: number;
}

class DoughnutSegmentDataModel {
  segmentState = "active";
  description: string;
  childNumber: number;
}

export function containsCharacters(s: string | undefined) {
  if (s === undefined) {
    return console.error(`${s} is undefined`);
  }
  // ? This checks if the string has any characters, to
  // ? check if there has been a misinput
  return s!.search(/\S+/) >= 0;
}

const CreateDataPortal: React.FC<Modal> = ({
  doughnutSegmentChildNumber,
  isOpen,
  onSaveClose,
  onNoSaveClose,
}: Modal) => {
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  let newDoughnutSegmentData = new DoughnutSegmentDataModel();

  const onCloseAndDoNotSaveData = (e: React.MouseEvent) => {
    e.preventDefault();
    onNoSaveClose(e);
  };

  const onCloseAndSaveData = async (e?: React.MouseEvent) => {
    if (containsCharacters(descriptionRef.current?.value)) {
      newDoughnutSegmentData.description = descriptionRef.current!.value;
      newDoughnutSegmentData.childNumber = doughnutSegmentChildNumber;

      onSaveClose();
      // ! A hard fix - using the 'timeout' on axois request to
      // ! refresh the page after sending data. I don't know why
      // ! but when this axios code is run, it send data but does
      // ! not continue with the rest of this function
      await axios
        .post(`${PROXY}/segments`, newDoughnutSegmentData, {
          timeout: AXOIS_TIMEOUT_DURATION,
        })
        .catch((err) => console.log(err));
    } else {
      return window.alert("Looks like didn't input any data! Try again");
    }
  };

  function keyDownHandler(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      onCloseAndSaveData();
    }
  }

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
            onKeyDown={keyDownHandler}
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

import React, { useRef, useState } from "react";
import ReactDom from "react-dom";
import "./styles/ViewDataModal.css";
import { TfiClose } from "react-icons/tfi";
import axios from "axios";
import { MONTH_NAME_KEY, PROXY, AXOIS_TIMEOUT_DURATION } from "./Doughnut";
import { containsCharacters } from "./CreateDataModal";

interface PortalChildren {
  isOpen: boolean;
  onSaveClose: Function;
  onNoSaveClose: Function;
  doughnutSegmentChildNumber: number;
  doughnutSegmentDescription: string;
}

class DoughnutSegmentDataModel {
  segmentState = "active";
  description: string;
  childNumber: number;
}

const CreateViewPortal: React.FC<PortalChildren> = ({
  isOpen,
  onSaveClose,
  onNoSaveClose,
  doughnutSegmentChildNumber,
  doughnutSegmentDescription,
}: PortalChildren) => {
  const [editButtonEngaged, setEditButtonEngaged] = useState(false);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  let newDoughnutSegmentData = new DoughnutSegmentDataModel();

  const onCloseAndDoNotEditData = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setTimeout(() => {
      if (editButtonEngaged == true) setEditButtonEngaged(false);
    }, 750);
    onNoSaveClose(e);
  };

  const onEditButtonClick = () => {
    if (editButtonEngaged == true) setEditButtonEngaged(false);
    if (editButtonEngaged == false) setEditButtonEngaged(true);
  };

  const onCloseAndSaveData = async (e?: React.MouseEvent) => {
    if (containsCharacters(descriptionRef.current!.value)) {
      newDoughnutSegmentData.description = descriptionRef.current!.value;
      newDoughnutSegmentData.childNumber = doughnutSegmentChildNumber;

      onSaveClose();
      setTimeout(() => onEditButtonClick(), 750);
      // ! A hard fix - using the 'timeout' on axois request to
      // ! refresh the page after sending data. I don't know why
      // ! but when this axios code is run, it send data but does
      // ! not continue with the rest of this function
      await axios
        .put(
          `${PROXY}/edit/${doughnutSegmentChildNumber}`,
          newDoughnutSegmentData,
          { timeout: AXOIS_TIMEOUT_DURATION }
        )
        .catch((e) => console.error(e));
    } else {
      descriptionRef.current?.value === "";
      return window.alert("Looks like didn't input any data! Try again");
    }
  };

  const onDeleteButtonClick = async (e?: React.MouseEvent) => {
    newDoughnutSegmentData.childNumber = doughnutSegmentChildNumber;

    onSaveClose();
    // ! A hard fix - using the 'timeout' on axois request to
    // ! refresh the page after sending data. I don't know why
    // ! but when this axios code is run, it send data but does
    // ! not continue with the rest of this function
    await axios
      .delete(`${PROXY}/delete/${doughnutSegmentChildNumber}`, {
        timeout: AXOIS_TIMEOUT_DURATION,
      })
      .catch((e) => console.error(e));
    console.log("AXIOS PASSED");
  };

  function keyDownHandler(e: React.KeyboardEvent) {
    console.log(e);
    if (e.key === "Enter") {
      onCloseAndSaveData();
    }
  }

  // ? we're adding in a dynamic variable so that state also controls
  // ? if we can see this portal or not
  return ReactDom.createPortal(
    <>
      <div className={`view-modal__interface--${isOpen}`}>
        <button
          className="view-modal__close-button"
          onClick={onCloseAndDoNotEditData}
        >
          <TfiClose />
        </button>
        <h2 className="view-modal__title">
          {MONTH_NAME_KEY[doughnutSegmentChildNumber]}
        </h2>
        <form className="view-modal__form-details">
          <h3 className="view-modal__form-details__form-heading">
            Let's have a look at your month...
          </h3>
          <div
            className={`view-modal__form-details__userinfo--hidden-${editButtonEngaged}`}
          >
            <p>{doughnutSegmentDescription}</p>
          </div>
          <textarea
            className={`view-modal__form-details__textarea--shown-${editButtonEngaged}`}
            defaultValue={doughnutSegmentDescription}
            ref={descriptionRef}
            onKeyDown={keyDownHandler}
          />
        </form>
        <div
          className={`view-modal__button-row--edit-engaged-${editButtonEngaged}`}
        >
          <button
            className={`view-modal__button-row__edit-button--${editButtonEngaged}`}
            onClick={onEditButtonClick}
          >
            Edit
          </button>
          <button
            className="view-modal__button-row__delete-button"
            onClick={onDeleteButtonClick}
          >
            Delete
          </button>
        </div>
        <div
          className={`view-modal__button-row--save-engaged-${editButtonEngaged}`}
        >
          <button
            className={`view-modal__button-row__edit-button--${editButtonEngaged}`}
            onClick={onCloseAndSaveData}
          >
            Save Changes
          </button>
        </div>
      </div>
      <div className={`view-modal__overlay--${isOpen}`}></div>
    </>,
    document.getElementById("edit-portal-root") as HTMLElement
  );
};

export default CreateViewPortal;

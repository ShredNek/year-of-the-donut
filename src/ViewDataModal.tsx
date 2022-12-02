import React, { useRef, useState } from "react";
import ReactDom from "react-dom";
import "./ViewDataModal.css";
import { TfiClose } from "react-icons/tfi";
import axios from "axios";
import { getDoughnutData } from "./Doughnut";

interface PortalChildren {
  isOpen: boolean;
  onClose: React.MouseEventHandler<HTMLButtonElement>;
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
  onClose,
  doughnutSegmentChildNumber,
  doughnutSegmentDescription,
}: PortalChildren) => {
  const [editButtonEngaged, setEditButtonEngaged] = useState(false);
  // TODO - FIND APPROPRIATE TYPE FOR THIS!
  const descriptionRef: any = useRef<HTMLTextAreaElement>();
  let newDoughnutSegmentData = new DoughnutSegmentDataModel();

  const onCloseAndDoNotEditData = (e: any) => {
    setTimeout(() => {
      if (editButtonEngaged == true) setEditButtonEngaged(false);
    }, 750);
  };

  const onEditButtonClick = () => {
    if (editButtonEngaged == true) setEditButtonEngaged(false);
    if (editButtonEngaged == false) setEditButtonEngaged(true);
  };

  const onCloseAndSaveData = async (e: any, cN: number) => {
    newDoughnutSegmentData.description = descriptionRef.current.value;
    newDoughnutSegmentData.childNumber = doughnutSegmentChildNumber;
    if (descriptionRef.current?.value === "" || undefined) {
      return window.alert("Looks like didn't input any data! Try again");
    }

    axios
      .put(`http://localhost:3001/edit/${cN}`, newDoughnutSegmentData)
      .then((res) => console.log(res));
    setTimeout(() => onEditButtonClick(), 2000);
    await getDoughnutData();
    onClose(e);
  };

  const onDeleteButtonClick = async (e: any, cN: number) => {
    axios
      .delete(`http://localhost:3001/delete/${cN}`)
      .then((res) => console.log(res));
    await getDoughnutData();
    onClose(e);
  };

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
        <h2 className="view-modal__title">Let's have a look...</h2>
        <form className="view-modal__form-details">
          <h3 className="view-modal__form-details__form-heading">
            Let's have a look at your hour...
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
            onClick={() =>
              onDeleteButtonClick(event?.target, doughnutSegmentChildNumber)
            }
          >
            Delete
          </button>
        </div>
        <div
          className={`view-modal__button-row--save-engaged-${editButtonEngaged}`}
        >
          <button
            className={`view-modal__button-row__edit-button--${editButtonEngaged}`}
            onClick={() =>
              onCloseAndSaveData(event?.target, doughnutSegmentChildNumber)
            }
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

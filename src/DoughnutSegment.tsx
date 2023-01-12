import React, { useState } from "react";
import CreateDataModal from "./CreateDataModal";
import ViewDataModal from "./ViewDataModal";
import "./Doughnut";
import {
  MONTH_NAME_KEY,
  AXOIS_TIMEOUT_DURATION,
  MODAL_CSS_TRANSFORM_DURATION,
} from "./Doughnut";

interface ChildNumberAndStatus {
  key: string;
  childNumber: number;
  status: string;
  description: string;
  closeSegmentFunction: Function;
  setUserDataToUndefined: Function;
}

const DoughnutSegment: React.FC<ChildNumberAndStatus> = ({
  childNumber,
  status,
  description,
  closeSegmentFunction,
  setUserDataToUndefined,
}: ChildNumberAndStatus) => {
  const [createSegmentDataPortalState, setCreateSegmentDataPortalState] =
    useState(false);
  const [viewSegmentDataPortalState, setViewSegmentDataPortalState] =
    useState(false);

  const openSegmentClickEvent = () => {
    if (status == "inactive") setCreateSegmentDataPortalState(true);
    if (status == "active") setViewSegmentDataPortalState(true);
  };

  const onSaveCloseSegmentClickEvent = () => {
    setViewSegmentDataPortalState(false);
    setCreateSegmentDataPortalState(false);

    setTimeout(() => {
      setUserDataToUndefined();
      setTimeout(() => {
        closeSegmentFunction();
      }, AXOIS_TIMEOUT_DURATION);
    }, MODAL_CSS_TRANSFORM_DURATION);
  };

  const onNoSaveCloseSegmentClickEvent = () => {
    setViewSegmentDataPortalState(false);
    setCreateSegmentDataPortalState(false);
  };

  return (
    <div>
      <div
        className={`doughnut-container__doughnut__doughnut-segment__heading-${childNumber}`}
      >
        <h6
          className={`doughnut-container__doughnut__doughnut-segment__heading--h6-${childNumber}`}
        >
          {MONTH_NAME_KEY[childNumber]}
        </h6>
      </div>
      <div
        onClick={openSegmentClickEvent}
        className={`doughnut-container__doughnut__doughnut-segment__${childNumber}--${status}`}
        id={`doughnut-segment--${status}`}
      ></div>
      <CreateDataModal
        isOpen={createSegmentDataPortalState}
        doughnutSegmentChildNumber={childNumber}
        onSaveClose={onSaveCloseSegmentClickEvent}
        onNoSaveClose={onNoSaveCloseSegmentClickEvent}
      ></CreateDataModal>
      <ViewDataModal
        isOpen={viewSegmentDataPortalState}
        doughnutSegmentChildNumber={childNumber}
        doughnutSegmentDescription={description}
        onSaveClose={onSaveCloseSegmentClickEvent}
        onNoSaveClose={onNoSaveCloseSegmentClickEvent}
      ></ViewDataModal>
    </div>
  );
};

export default DoughnutSegment;

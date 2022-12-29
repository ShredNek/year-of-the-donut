import React, { useState } from "react";
import CreateDataModal from "./CreateDataModal";
import ViewDataModal from "./ViewDataModal";
import "./Doughnut";
import { MONTH_NAME_KEY } from "./Doughnut";

interface ChildNumberAndStatus {
  key: string;
  childNumber: number;
  status: string;
  description: string;
  closeSegmentFunction: Function;
}

const DoughnutSegment: React.FC<ChildNumberAndStatus> = ({
  childNumber,
  status,
  description,
  closeSegmentFunction,
}: ChildNumberAndStatus) => {
  const [createSegmentDataPortalState, setCreateSegmentDataPortalState] =
    useState(false);
  const [viewSegmentDataPortalState, setViewSegmentDataPortalState] =
    useState(false);

  const openSegmentClickEvent = () => {
    if (status == "inactive") setCreateSegmentDataPortalState(true);
    if (status == "active") setViewSegmentDataPortalState(true);
  };

  const closeSegmentClickEvent = () => {
    closeSegmentFunction();
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
        onClose={closeSegmentClickEvent}
      ></CreateDataModal>
      <ViewDataModal
        isOpen={viewSegmentDataPortalState}
        doughnutSegmentChildNumber={childNumber}
        doughnutSegmentDescription={description}
        onClose={closeSegmentClickEvent}
      ></ViewDataModal>
    </div>
  );
};

export default DoughnutSegment;

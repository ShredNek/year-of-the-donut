import React, { useState } from "react";
import CreateDataModal from "./CreateDataModal";
import ViewDataModal from "./ViewDataModal";
import "./Doughnut";

interface ChildNumberAndStatus {
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

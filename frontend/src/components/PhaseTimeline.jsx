/* eslint-disable react/prop-types */
/* https://www.npmjs.com/package/react-chrono*/
import { Chrono } from "react-chrono";

const PhaseTimeline = ({ phases, onEdit, onDelete }) => {
  if (!phases || phases.length === 0) {
    return (
      <div className="text-center text-red-500 mb-5">
        No Phases Found! Add a Phase Below!
      </div>
    );
  }

  const items = phases.map((phase) => ({
    title: phase.name,
    cardTitle: phase.name,
    cardSubtitle: `Expected Start: ${
      phase.expectedStartDate || ""
    }, Actual Start: ${phase.starteDate || ""}`,
    cardDetailedText: (
      <div>
        <button onClick={() => onEdit(phase)}>Edit</button>
        <button onClick={() => onDelete(phase.id)}>Delete</button>
      </div>
    ),
  }));

  return (
    <div className="w-full h-full my-10">
      <Chrono
        items={items}
        mode="HORIZONTAL"
        slideShow
        slideItemDuration={4500}
        enableOutline={false}
      />
    </div>
  );
};

export default PhaseTimeline;

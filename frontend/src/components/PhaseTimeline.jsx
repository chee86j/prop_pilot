/* eslint-disable react/prop-types */
import { Chrono } from 'react-chrono';

const PhaseTimeline = ({ phaseNames }) => {
  const items = phaseNames.map((name, index) => ({
    title: name,
    cardTitle: name,
    cardSubtitle: `Expected Start: ${new Date().toISOString().split('T')[0]}`,
    cardDetailedText: `Details about ${name}`,
    key: index 
  }));

  return (
    <div style={{ width: '100%', height: '400px' }}>
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

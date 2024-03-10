import { useState } from 'react';

const PhaseTracker = () => {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const phases = [
    {
      name: 'Demolition (Operator)',
      tasks: [
        'Overseeing the removal of existing structures or materials to prepare the site for renovation.',
        'Ensuring compliance with safety regulations and environmental considerations during demolition activities.'
      ]
    },
    {
      name: 'Rough-In (Operator)',
      tasks: [
        'Installing basic systems and infrastructure, including plumbing, electrical, HVAC, and structural elements.',
        'Coordinating rough-in work to accommodate future renovations and meet building code requirements.'
      ]
    },
    {
      name: 'Rough-In Inspections (Municipal)',
      tasks: [
        'Scheduling inspections with municipal authorities to verify compliance with building codes and regulations.',
        'Addressing any deficiencies or issues identified during inspections to ensure timely resolution.'
      ]
    },
    {
      name: 'Finals (Operator)',
      tasks: [
        'Completing construction and installation work, including finishing touches and cosmetic improvements.',
        'Conducting final checks to ensure all work meets project specifications and quality standards.'
      ]
    },
    {
      name: 'Final Inspections (Municipal)',
      tasks: [
        'Requesting final inspections from municipal authorities to obtain regulatory approval for occupancy.',
        'Verifying compliance with safety standards, structural integrity, and building code requirements.'
      ]
    },
    {
      name: 'Certificate of Occupancy Acquired (Operator)',
      tasks: [
        'Applying for a Certificate of Occupancy (CO) once all inspections are passed and the property meets regulatory requirements.',
        'Obtaining the CO confirms that the property is safe for occupancy and complies with applicable building codes and regulations.'
      ]
    }
  ];

  const nextPhase = () => {
    if (currentPhaseIndex < phases.length - 1) {
      setCurrentPhaseIndex(currentPhaseIndex + 1);
    }
  };

  const prevPhase = () => {
    if (currentPhaseIndex > 0) {
      setCurrentPhaseIndex(currentPhaseIndex - 1);
    }
  };

  return (
    <div>
      <h2 className='my-2 text-3xl'>Property Management Phases</h2>
        <p className='text-xs'>The delineation of inspection phases, including demolition, 
            rough-in, finals, and final inspections, underscores the 
            importance of thorough due diligence and compliance with 
            building codes and regulations throughout the renovation 
            process. Municipal inspections serve as checkpoints to 
            verify that construction work meets safety standards and 
            code requirements, while the acquisition of a Certificate 
            of Occupancy signifies regulatory approval for occupancy. 
            Environmental and historical inspections may be necessary for 
            properties with specific concerns or historical significance, 
            ensuring compliance with additional regulations and preservation 
            guidelines.</p>
      <h3 className='my-2 text-bold text-xl'>{phases[currentPhaseIndex].name}</h3>
      <ul className='text-md'>
        {phases[currentPhaseIndex].tasks.map((task, index) => (
          <li key={index}>{task}</li>
        ))}
      </ul>
      <div className='my-2'>
        <button onClick={prevPhase} disabled={currentPhaseIndex === 0}>Previous Phase</button>
        <button onClick={nextPhase} disabled={currentPhaseIndex === phases.length - 1}>Next Phase</button>
      </div>
    </div>
  );
};

export default PhaseTracker;

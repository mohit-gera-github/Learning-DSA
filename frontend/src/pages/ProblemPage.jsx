import React from 'react';
import { useParams } from 'react-router-dom';

const ProblemPage = () => {
  const { id } = useParams();
  return (
    <div className="problem-page">
      <h2>Problem Analysis: {id}</h2>
      <p>Visual animations for this problem will go here.</p>
    </div>
  );
};

export default ProblemPage;

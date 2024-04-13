import { useState } from "react";

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  let all = good + neutral + bad;
  const handleClick = () => {
    setGood(good + 1);
  };
  const handleClick1 = () => {
    setNeutral(neutral + 1);
  };
  const handleClick2 = () => {
    setBad(bad + 1);
  };
  return (
    <>
      <h1>Give Feedback</h1>
      <button onClick={handleClick}>Good</button>
      <button onClick={handleClick1}>Neutral</button>
      <button onClick={handleClick2}>Bad</button>
      <h1>Statistics</h1>
      <p>Good: {good}</p>
      <p>Neutral: {neutral}</p>
      <p>Bad: {bad}</p>
      <p>All: {all}</p>
      <p>Average: {(good - bad) / all}</p>
      <p>Positive: {good / all}%</p>
    </>
  );
};

export default App;

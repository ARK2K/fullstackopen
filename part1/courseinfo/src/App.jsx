import { useState } from "react";

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const Click = (text) => {
    if (text == 1) {
      setGood(good + 1);
    }
    if (text == 0) {
      setNeutral(neutral + 1);
    }
    if (text == 2) {
      setBad(bad + 1);
    }
  };
  return (
    <>
      <h1>Give Feedback</h1>
      <button onClick={Click(1)}>Good</button>
      <button onClick={Click(0)}>Neutral</button>
      <button onClick={Click(2)}>Bad</button>
      <h1>Statistics</h1>
      <p>Good: {good}</p>
      <p>Neutral: {neutral}</p>
      <p>Bad: {bad}</p>
      <p>All: {good + bad + neutral}</p>
      <p>
        Average: <Average val={good} sum={good + neutral + bad} />
      </p>
      <p>
        Positive: <Percentage val={good} sum={good + neutral + bad} />%
      </p>
    </>
  );
};

const Average = ({ val, sum }) => {
  //return val / sum;
};

const Percentage = ({ val, sum }) => {
  return (val / sum) * 100;
};

export default App;

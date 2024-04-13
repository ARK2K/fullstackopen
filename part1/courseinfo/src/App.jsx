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
      {all == 0 ? (
        <p>No feedback given</p>
      ) : (
        <Statistics good={good} neutral={neutral} bad={bad} all={all} />
      )}
    </>
  );
};
const Statistics = (props) => {
  return (
    <>
      <p>Good: {props.good}</p>
      <p>Neutral: {props.neutral}</p>
      <p>Bad: {props.bad}</p>
      <p>All: {props.all}</p>
      <p>Average: {(props.good - props.bad) / props.all}</p>
      <p>Positive: {props.good / props.all}%</p>
    </>
  );
};
export default App;

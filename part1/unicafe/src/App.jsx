import { useState } from "react";

const App = () => {
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
      <Button text="Good" click={handleClick} />
      <Button text="Neutral" click={handleClick1} />
      <Button text="Bad" click={handleClick2} />
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
      <StatisticLine text="Good" value={props.good} per="" />
      <StatisticLine text="Neutral" value={props.neutral} per="" />
      <StatisticLine text="Bad" value={props.bad} per="" />
      <StatisticLine text="All" value={props.all} per="" />
      <StatisticLine
        text="Average"
        value={(props.good - props.bad) / props.all}
        per=""
      />
      <StatisticLine
        text="Positive"
        value={(props.good / props.all) * 100}
        per="%"
      />
    </>
  );
};
const Button = (props) => {
  return <button onClick={props.click}>{props.text}</button>;
};
const StatisticLine = (props) => {
  return (
    <p>
      {props.text}: {props.value} {props.per}
    </p>
  );
};
export default App;

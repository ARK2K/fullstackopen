import { useState } from "react";

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];
  const [vote, setVote] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const v1 = [...vote];
  let max = v1.reduce(
    (maxIndex, elem, i, arr) => (elem > arr[maxIndex] ? i : maxIndex),
    0
  );
  const [selected, setSelected] = useState(0);
  console.log(vote);
  console.log(max);
  console.log(selected);
  const handleClick = () => {
    v1[selected] += 1;
    setVote([...v1]);
  };
  const handleClick1 = () => setSelected(selected + 1);
  return (
    <>
      <h1>Anectode of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {vote[selected]} votes</p>
      <Button click={handleClick} text="Vote" />
      <Button click={handleClick1} text="Next anecdotes" />
      <h1>Anectode with most votes</h1>
      <p>{anecdotes[max]}</p>
      <p>has {vote[max]} votes</p>
    </>
  );
};
const Button = (props) => {
  console.log(props);
  return <button onClick={props.click}>{props.text}</button>;
};
export default App;

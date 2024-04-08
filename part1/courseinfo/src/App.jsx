const App = () => {
  // const-definitions
  const course = "Half Stack application development";

  return (
    <div>
      <Header course={course} />
      <Content />
      <Total />
    </div>
  );
};

const Header = ({ course }) => {
  // const-definitions

  return <p>{course}</p>;
};

const Content = () => {
  // const-definitions

  return <p>Content</p>;
};

const Total = () => {
  // const-definitions

  return <p>Total</p>;
};

export default App;

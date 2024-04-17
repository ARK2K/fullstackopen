const Course = ({ course }) => {
  return (
    <>
      <Header props={course} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </>
  );
};
const Header = ({ props }) => {
  return <h1>{props.name}</h1>;
};
const Content = (props) => {
  return (
    <>
      <Part prop={props.parts[0]} />
      <Part prop={props.parts[1]} />
      <Part prop={props.parts[2]} />
    </>
  );
};
const Part = ({ prop }) => {
  return (
    <p>
      {prop.name} {prop.exercises}
    </p>
  );
};
const Total = (props) => {
  return (
    <p>
      Number of exercises{" "}
      {props.parts[0].exercises +
        props.parts[1].exercises +
        props.parts[2].exercises}
    </p>
  );
};
export default Course;

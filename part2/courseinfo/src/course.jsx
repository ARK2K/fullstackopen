const listStyle = {
  listStyleType: "none",
};
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
  console.log(props.parts, "cont");
  return (
    <>
      {props.parts.map((e, i) => {
        return (
          <div key={i}>
            <Part prop={e} />
          </div>
        );
      })}
    </>
  );
};
const Part = ({ prop }) => {
  console.log(prop, "part");
  return (
    <p>
      {prop.name} {prop.exercises}
    </p>
  );
};
const Total = (props) => {
  return (
    <p>
      <b>
        Total of {props.parts.reduce((sum, n) => sum + n.exercises, 0)}{" "}
        exercises
      </b>
    </p>
  );
};
export default Course;

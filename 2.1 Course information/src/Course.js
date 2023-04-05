const Header = (props) => {
    return (
        <h1>{props.course}</h1>
    )
}
const Part = (props) => {
    return (
        <p>
            {props.part} {props.exercises}
        </p>
    )
}
const Content = (props) => {
    let sum = 0;
    const partsView = props.parts.map(part => {
        sum += part.exercises;
        return <Part key={part.id} part={part.name} exercises={part.exercises} />
    })
    return (
        <>
            {partsView}
            <p><b>total of {sum} exercises</b></p>
        </>
    )
}
const Total = (props) => {
    return (
        <p>Number of exercises {props.total}</p>
    )
}
const Course = (props) => {
    return (
        <>
            <Header course={props.course.name} />
            <Content parts={props.course.parts} />

        </>
    );
}

export default Course;
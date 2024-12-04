function StartScreen({ numQuestions, dispatch }) {
    return (
        <div className="start">
            <h2>Welcome to The React Quiz!</h2>
            <h3>{numQuestions} questions to test your mastery</h3>
            <button onClick={() => dispatch({ type: 'start' })} className="btn btn-ui">Let's start Quiz</button>
        </div>
    )
}

export default StartScreen

import { useQuiz } from "../contextes/QuizProvider";

function Options({ question }) {
    const { dispatch, answer } = useQuiz();
    const hasAnsweres = answer !== null;

    return (
        <div className="options">
            {question.options.map((item, i) => (
                <button
                    onClick={e => dispatch({ type: "newAnswer", payload: i })}
                    key={item}
                    disabled={hasAnsweres}
                    className={`btn btn-option
                    ${i === answer ? 'answer' : ''}
                    ${hasAnsweres ? i === question.correctOption ? 'correct' : 'wrong' : ''}`}>
                    {item}
                </button>
            ))}
        </div>
    )
}

export default Options;

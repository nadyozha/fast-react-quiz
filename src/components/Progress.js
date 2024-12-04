import { useQuiz } from "../contextes/QuizProvider";

function Progress() {
    const { index, numQuestions, points, maxPossiblePoints, answer } = useQuiz();
    return (
        <header className="progress">
            <progress max={numQuestions} value={index + Number(answer === null)}></progress>
            <p>Question <strong>{index + 1} / {numQuestions}</strong></p>
            <p><strong>{points} / {maxPossiblePoints}</strong></p>
        </header>
    )
}

export default Progress;

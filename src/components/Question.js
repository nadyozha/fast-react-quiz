import { useQuiz } from '../contextes/QuizProvider';
import Option from './Options';

function Question() {
    const { questions, index, dispatch, answer } = useQuiz();
    const question = questions[index];

    if (!question) {
        return <p>Loading question...</p>;
    }

    return (
        <div>
            <h4>{question.question}</h4>
            <Option question={question} />
        </div>
    )
}

export default Question;
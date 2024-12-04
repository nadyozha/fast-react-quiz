import { useEffect } from "react";
import { useQuiz } from "../contextes/QuizProvider";

function Timer() {
    const { secondsRemaning, dispatch } = useQuiz();
    const mins = Math.floor(secondsRemaning / 60);
    const seconds = secondsRemaning % 60;


    useEffect(
        function () {
            const id = setInterval(() => {
                dispatch({ type: 'tick' })
            }, 1000);
            return () => clearInterval(id);
        }
        , [dispatch])

    return (
        <div className="timer">
            {mins < 10 && '0'}{mins}:{seconds < 10 && '0'}{seconds}
        </div>
    )
}

export default Timer;

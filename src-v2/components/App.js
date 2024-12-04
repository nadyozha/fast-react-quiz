import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Timer from "./Timer";
import Footer from "./Footer";

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaning: null,
};


function reducer(state, action) {
  switch (action.type) {
    case 'dataRecived':
      return {
        ...state,
        questions: action.payload,
        status: 'ready'
      };
    case 'dataFaild':
      return {
        ...state,
        status: 'error'
      };
    case 'ready':
      return {
        ...state,
        status: 'go'
      };
    case 'start':
      return {
        ...state,
        status: 'active',
        secondsRemaning: state.questions.length * SECS_PER_QUESTION
      };
    case 'finish':
      return {
        ...state,
        status: 'finished',
        highscore: state.points > state.highscore ? state.points : state.highscore,
      };
    case 'restart':
      return {
        ...initialState,
        questions: state.questions,
        status: 'ready',
        highscore: state.highscore,
      };
    case 'newAnswer':
      const question = state.questions[state.index];
      return {
        ...state,
        answer: action.payload,
        points: action.payload === question.correctOption
          ? state.points + question.points
          : state.points,
      };
    case 'nextQuestion':
      return {
        ...state,
        index: state.index + 1,
        answer: null
      };
    case 'tick':
      return {
        ...state,
        secondsRemaning: state.secondsRemaning--,
        status: state.secondsRemaning === 0 ? 'finished' : state.status,
      };

    default:
      throw new Error('Action unknown');
  }
}

export default function App() {
  const [{ questions, status, index, answer, points, highscore, secondsRemaning }, dispatch] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce((acc, item) => acc + item.points, 0);


  useEffect(function () {
    fetch('http://localhost:9000/questions')
      .then(res => res.json())
      .then(data => dispatch({ type: 'dataRecived', payload: data }))
      .catch(err => dispatch({ type: 'dataFaild' }));
  }, [])

  return (
    <div className='app'>
      <Header />
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && <StartScreen numQuestions={numQuestions} dispatch={dispatch} />}
        {status === 'active' && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer} />
            <Footer>
              <Timer
                dispatch={dispatch}
                secondsRemaning={secondsRemaning} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions} />
            </Footer>

          </>
        )}
        {status === 'finished' && <FinishScreen
          dispatch={dispatch}
          points={points}
          maxPossiblePoints={maxPossiblePoints}
          highscore={highscore}
        />}

      </Main>
    </div>
  );
}

import { createContext, useContext, useEffect, useReducer } from "react";

const QuizContext = createContext();

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

function QuizProvider({ children }) {
	const [{ questions, status, index, answer, points, highscore, secondsRemaning }, dispatch] = useReducer(reducer, initialState);

	const numQuestions = questions.length;
	const maxPossiblePoints = Array.isArray(questions)
		? questions.reduce((acc, item) => acc + item.points, 0)
		: 0;

	// useEffect(function () {
	// 	fetch('http://localhost:9000/questions')
	// 		.then(res => res.json())
	// 		.then(data => dispatch({ type: 'dataRecived', payload: data }))
	// 		.catch(err => dispatch({ type: 'dataFaild' }));
	// }, [])

	useEffect(function () {
		fetch('https://raw.githubusercontent.com/nadyozha/fast-react-quiz/main/data/questions.json')
			.then(res => {
				if (!res.ok) {
					throw new Error('Network response was not ok');
				}
				return res.json();
			})
			.then(data => {
				if (!Array.isArray(data)) {
					throw new Error('Data is not an array');
				}
				dispatch({ type: 'dataRecived', payload: data });
			})
			.catch(err => dispatch({ type: 'dataFaild' }));
	}, []);


	return (
		<QuizContext.Provider value={{
			questions,
			status,
			index,
			answer,
			points,
			highscore,
			secondsRemaning,
			numQuestions,
			maxPossiblePoints,
			dispatch
		}}>
			{children}
		</QuizContext.Provider>
	)
}

function useQuiz() {
	const context = useContext(QuizContext);
	if (context === undefined) throw new Error('QuizContext was used outside the QuizProvider');
	return context;
}

export { QuizProvider, useQuiz };

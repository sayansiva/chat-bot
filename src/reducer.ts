export type ValueOption = {
  nextId: number | boolean;
  text: string;
  value: string | boolean | number;
};

type Question = {
  id: number;
  name: string;
  text: string;
  uiType: string;
  valueOptions: ValueOption[];
};

export type AnsweredQuestion = {
  nextId: number | boolean;
  value: string | number | boolean;
  name: string;
  text: string;
  questionText: string;
};

type State = {
  isFlowDone: boolean;
  questions: Question[];
  answeredQuestions: AnsweredQuestion[];
  currentQuestion: Question | undefined;
};

const initialState: State = {
  isFlowDone: false,
  questions: [],
  answeredQuestions: [],
  currentQuestion: undefined,
};

const fetchedQuestionsType = "bot/fetchedQuestions" as const;
const fetchedQuestions = (questions: Question[]) => ({
  type: fetchedQuestionsType,
  payload: { questions },
});
fetchedQuestions.type = fetchedQuestionsType;

const answerQuestionType = "bot/answerQuestion" as const;
const answerQuestion = ({
  nextId,
  value,
  name,
  text,
  questionText,
}: AnsweredQuestion) => ({
  type: answerQuestionType,
  payload: { value, name, text, questionText, nextId },
});
answerQuestion.type = answerQuestionType;

type Action =
  | ReturnType<typeof answerQuestion>
  | ReturnType<typeof fetchedQuestions>;

const reducer = (state = initialState, action: Action) => {
  if (!action) return state;
  switch (action.type) {
    case fetchedQuestionsType: {
      return {
        ...state,
        questions: action.payload.questions,
        currentQuestion: action.payload.questions.find(({ id }) => id === 100),
      };
    }
    case answerQuestionType:
      return {
        ...state,
        isFlowDone: action.payload.nextId === false,
        currentQuestion: state.questions.find(
          ({ id }) => id === action.payload.nextId
        ),
        answeredQuestions: [...state.answeredQuestions, action.payload],
      };
    default:
      return initialState;
  }
};

const selectCurrentQuestion = (state: State) => state.currentQuestion;
const selectAnsweredQuestions = (state: State) => state.answeredQuestions;
const selectIsFlowDone = (state: State) => state.isFlowDone;

export {
  selectCurrentQuestion,
  selectAnsweredQuestions,
  selectIsFlowDone,
  fetchedQuestions,
  answerQuestion,
  reducer,
  initialState,
};

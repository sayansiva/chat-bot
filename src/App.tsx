import Paper from "@mui/material/Paper";
import { Answer, MessageLeft, MessageRight } from "./Message";
import { makeStyles } from "tss-react/mui";
import { useEffect, useReducer } from "react";
import {
  initialState,
  reducer,
  selectAnsweredQuestions,
  selectCurrentQuestion,
  selectIsFlowDone,
  fetchedQuestions,
  answerQuestion,
  AnsweredQuestion,
} from "./reducer";

const useStyles = makeStyles()(() => ({
  paper: {
    width: "80vw",
    height: "80vh",
    maxWidth: "500px",
    maxHeight: "700px",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    position: "relative",
  },
  paper2: {
    width: "80vw",
    maxWidth: "500px",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    position: "relative",
  },
  container: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  messagesBody: {
    width: "calc( 100% - 20px )",
    margin: 10,
    overflowY: "scroll",
    height: "calc( 100% - 80px )",
  },
}));

export default function App() {
  const { classes } = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);

  const isFlowDone = selectIsFlowDone(state);
  const answeredQuestions = selectAnsweredQuestions(state);
  const currentQuestion = selectCurrentQuestion(state);

  useEffect(() => {
    if (isFlowDone) {
      const answers = answeredQuestions.map(({ name, value }) => ({
        name,
        value,
      }));
      fetch("https://virtserver.swaggerhub.com/L8475/task/1.0.1/conversation", {
        method: "PUT",
        body: JSON.stringify(answers),
      });
    }
  }, [isFlowDone, answeredQuestions]);

  useEffect(() => {
    fetch("http://localhost:3000/flow.json")
      .then((response) => response.json())
      .then(fetchedQuestions)
      .then(dispatch);
  }, [dispatch]);

  return (
    <div className={classes.container}>
      <div className={classes.paper}>
        <Paper id="style-1" className={classes.messagesBody}>
          {answeredQuestions &&
            answeredQuestions.map((question) => (
              <>
                <MessageLeft message={question.questionText} />
                <MessageRight message={question.text} />
              </>
            ))}
          {!isFlowDone && currentQuestion && (
            <MessageLeft message={currentQuestion.text} />
          )}
          {!isFlowDone && currentQuestion && (
            <Answer
              questionText={currentQuestion.text}
              onAnswerQuestion={(values: AnsweredQuestion) =>
                dispatch(answerQuestion(values))
              }
              name={currentQuestion.name}
              options={currentQuestion.valueOptions}
            />
          )}
          {isFlowDone && (
            <MessageLeft message={"Herzlichen Dank für Ihre Angaben"} />
          )}
        </Paper>
      </div>
    </div>
  );
}

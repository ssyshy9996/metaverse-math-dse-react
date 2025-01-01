import React, { useEffect, useState } from "react";
import Upload from "./components/Upload";
import Action from "./components/Action";
import BPanel, { isValidLaTeX } from "./components/BPanel";
import CPanel from "./components/CPanel";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tooltip } from "react-tooltip";

const calculateZoom = () => {
  const baseWidth = 1800;
  const baseHeight = 950;
  const scaleWidth = window.innerWidth / baseWidth; // Scale relative to viewport width
  const scaleHeight = window.innerHeight / baseHeight; // Scale relative to viewport height
  return Math.min(scaleWidth, scaleHeight);
};

const App: React.FC = () => {
  const [uploadType, setUploadType] = useState<string>("Question");
  const [solutionResponses, setSolutionResponses] = useState<string>("");
  const [similarQuestion, setSimilarQuestion] = useState<string>("");
  const [questionLatex, setQuestionLatex] = useState<string>("");
  const [answerResponse, setAnswerResponse] = useState<any>("");
  const [evaluation, setEvaluation] = useState<string>("");
  const [evaluationCorrect, setEvaluationCorrect] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mainQuestionValid, setMainQuestionValid] = useState<number>(0);
  const [edit, setEdit] = useState<boolean>(false);
  const [zoom, setZoom] = useState(calculateZoom());
  const [capturedImageType, setCapturedImageType] = useState<string>("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [disabledGenerateButton, setDisabledGenerateButton] =
    useState<boolean>(false);
  const [base64Image, setBase64Image] = useState<string | null>(null);


  var question_bank_id: string = "";

  useEffect(() => {
    console.log(
      "isValidLatex",
      isValidLaTeX("\\text{Evaluate:} \\int \\frac{2+x}{(1+x)^2} \\, dx")
    );
    if (solutionResponses) {
      saveQuestionWithSolution();
    }
  }, [solutionResponses]);
  const saveQuestionWithSolution = async () => {
    const payload = {
      question: questionLatex,
      solution: solutionResponses,
    };
    // console.log(payload);
    try {
      const response = await fetch(
        "https://ken6a03.pythonanywhere.com/api/db/question_bank/add",
        // "http://127.0.0.1:5000/api/db/question_bank/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      if (response.ok) {
        question_bank_id = data.id;
        // console.log("Question saved:", data);
      } else {
        console.error("Failed to save question:", data.error);
      }
    } catch (error) {
      console.error("Failed to save question:", error);
    }
  };

  const CPanelRefresh = async () => {
    if (uploadType === "Question") {
      setIsLoading(true);
      const payload = {
        question: questionLatex,
      };
      try {
        const response = await fetch(
          "https://ken6a03.pythonanywhere.com/api/solution/solve",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        const data = await response.json();

        if (response.ok) {
          // console.log("Success:", data);
          setSolutionResponses(data);
          setDisabledGenerateButton(true);
        } else {
          console.error("Error:", data);
          alert(`Request failed: ${data.error || "Unknown error"}`);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Check the console for details.");
      } finally {
        setIsLoading(false); // Stop loading
      }
    }
  };
  const removeQuestionWithSolution = async () => {
    if (!question_bank_id) {
      console.log("No question bank ID available to remove.");
      return;
    }

    try {
      const response = await fetch(
        `https://ken6a03.pythonanywhere.com/api/db/question_bank/delete/${question_bank_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        console.log("Question removed successfully.");
        question_bank_id = ""; // Reset the ID after successful removal
      } else {
        const data = await response.json();
        console.error("Failed to remove question:", data.error);
      }
    } catch (error) {
      console.error("Failed to remove question:", error);
    }
  };

  useEffect(() => {
    const handleResize = () => setZoom(calculateZoom());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col h-auto"
      style={{
        backgroundImage: "url(/background.png)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="min-h-screen flex-grow flex flex-col sm:flex-row justify-around">
        {/* Upload */}
        <Upload
          setCapturedImageType={setCapturedImageType}
          questionImage={questionLatex}
          setIsLoading={setIsLoading}
          setSolutionResponses={setSolutionResponses}
          setQuestionImage={setQuestionLatex}
          setAnswerResponse={setAnswerResponse}
          setEvaluation={setEvaluation}
          setEvaluationCorrect={setEvaluationCorrect}
          uploadType={uploadType}
          setUploadType={setUploadType}
          mainQuestionValid={mainQuestionValid}
          setDisabledGenerateButton={setDisabledGenerateButton}
          similarQuestion={similarQuestion}
          setSimilarQuestion={setSimilarQuestion}
          capturedImage={capturedImage}
          setCapturedImage={setCapturedImage}
          saveQuestionWithSolution={saveQuestionWithSolution}
          setBase64Image={setBase64Image}
        />
        {/* Actions */}
        <div className="w-full sm:w-[67%] flex flex-col justify-between h-full min-h-screen">
          <div className="relative rounded-md flex-grow mt-5">
            {/* {Actions} */}
            <Action
              edit={edit}
              capturedImageType={capturedImageType}
              setCapturedImageType={setCapturedImageType}
              setUploadType={setUploadType}
              solutionResponses={solutionResponses}
              setSolutionResponses={setSolutionResponses}
              questionImage={questionLatex}
              setIsLoading={setIsLoading}
              setSetSimilarQuestion={setSimilarQuestion}
              setEvaluation={setEvaluation}
              setEvaluationCorrect={setEvaluationCorrect}
              setAnswerResponse={setAnswerResponse}
              answerResponse={answerResponse}
              uploadType={uploadType}
              disabledGenerateButton={disabledGenerateButton}
              setEdit={setEdit}
              removeQuestionWithSolution={removeQuestionWithSolution}
              similarQuestion={similarQuestion}
              setCapturedImage={setCapturedImage}
            />
            <div className="absolute bottom-[calc(5%+1rem)] grid grid-cols-1 sm:grid-cols-3 gap-1 h-[calc(90%-2rem)] w-[90%] left-[5%]">
              <BPanel
                uploadType={uploadType}
                mainQuestionValid={mainQuestionValid}
                edit={edit}
                answerResponse={answerResponse}
                similarQuestion={similarQuestion}
                questionImage={questionLatex}
                isLoading={isLoading}
                setAnswerResponse={setAnswerResponse}
                setQuestionImage={setQuestionLatex}
                setIsLoading={setIsLoading}
                setMainQuestionValid={setMainQuestionValid}
                base64Image={base64Image}
              />
              <CPanel
                uploadType={uploadType}
                evaluation={evaluation}
                solutionResponses={solutionResponses}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                questionImage={questionLatex}
                setSolutionResponses={setSolutionResponses}
                setUploadType={setUploadType}
                setEvaluation={setEvaluation}
                evaluationCorrect={evaluationCorrect}
                similarQuestion={similarQuestion}
                refreshHandler={CPanelRefresh}
              />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={false}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        closeButton={false}
        theme={"dark"}
      />
      <Tooltip id="tooltip" />
    </div>
  );
};

export default App;

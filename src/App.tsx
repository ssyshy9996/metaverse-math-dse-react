import React, { useEffect, useState } from "react";
import Upload from "./components/Upload";
import Action from "./components/Action";
import BPanel from "./components/BPanel";
import CPanel from "./components/CPanel";
import { ToastContainer } from "react-toastify";

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
  const [similarQuestion, setSetSimilarQuestion] = useState<string>("");
  const [questionImage, setQuestionImage] = useState<string>("");
  const [answerResponse, setAnswerResponse] = useState<any>("");
  const [evaluation, setEvaluation] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mainQuestionValid, setMainQuestionValid] = useState<number>(0);
  const [edit, setEdit] = useState<boolean>(false);
  const [zoom, setZoom] = useState(calculateZoom());
  const [capturedImageType, setCapturedImageType] = useState<string>("");
  const [disabledGenerateButton, setDisabledGenerateButton] =
    useState<boolean>(false);

  var question_bank_id: string = "";

  useEffect(() => {
    if (solutionResponses) {
      saveQuestionWithSolution();
    }
  }, [solutionResponses]);
  const saveQuestionWithSolution = async () => {
    const payload = {
      question: questionImage,
      solution: solutionResponses,
    };
    console.log(payload);
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
        console.log("Question saved:", data);
      } else {
        console.error("Failed to save question:", data.error);
      }
    } catch (error) {
      console.error("Failed to save question:", error);
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
          questionImage={questionImage}
          setIsLoading={setIsLoading}
          setSolutionResponses={setSolutionResponses}
          setQuestionImage={setQuestionImage}
          setAnswerResponse={setAnswerResponse}
          setEvaluation={setEvaluation}
          uploadType={uploadType}
          setUploadType={setUploadType}
          mainQuestionValid={mainQuestionValid}
          setDisabledGenerateButton={setDisabledGenerateButton}
          similarQuestion={similarQuestion}
          saveQuestionWithSolution={saveQuestionWithSolution}
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
              questionImage={questionImage}
              setIsLoading={setIsLoading}
              setSetSimilarQuestion={setSetSimilarQuestion}
              setEvaluation={setEvaluation}
              setAnswerResponse={setAnswerResponse}
              answerResponse={answerResponse}
              uploadType={uploadType}
              disabledGenerateButton={disabledGenerateButton}
              setEdit={setEdit}
              removeQuestionWithSolution={removeQuestionWithSolution}
            />
            <div className="absolute bottom-[calc(5%+1rem)] grid grid-cols-1 sm:grid-cols-3 gap-1 h-[calc(90%-2rem)] w-[90%] left-[5%]">
              <BPanel
                uploadType={uploadType}
                mainQuestionValid={mainQuestionValid}
                edit={edit}
                answerResponse={answerResponse}
                similarQuestion={similarQuestion}
                questionImage={questionImage}
                isLoading={isLoading}
                setAnswerResponse={setAnswerResponse}
                setQuestionImage={setQuestionImage}
                setIsLoading={setIsLoading}
                setMainQuestionValid={setMainQuestionValid}
              />
              <CPanel
                uploadType={uploadType}
                evaluation={evaluation}
                solutionResponses={solutionResponses}
                isLoading={isLoading}
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
    </div>
  );
};

export default App;

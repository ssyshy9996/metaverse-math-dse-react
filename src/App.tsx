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
              setEdit={setEdit} />
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

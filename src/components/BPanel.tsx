import React, { useEffect, useState } from "react";
import { EditableMathField, StaticMathField, addStyles } from "react-mathquill";
import ProgressBar from "./ProgressBar";
import katex from "katex";
import "katex/dist/katex.min.css";
import { toast } from "react-toastify";
import "./BPanel.css";
import RefreshOnHover from "./RefreshOnHover";

import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

interface Props {
  questionImage: any;
  isLoading: boolean;
  answerResponse: any;
  similarQuestion: any;
  edit: boolean;
  uploadType: string;
  mainQuestionValid: number;
  setIsLoading: (loading: boolean) => void;
  setQuestionImage: (response: string) => void;
  setAnswerResponse: (response: any) => void;
  setMainQuestionValid: (response: any) => void;
  base64Image: any;
}

addStyles();

// Normalize LaTeX and validate its correctness
function normalizeSlashes(input: string): string {
  if (typeof input !== "string") {
    console.warn("normalizeSlashes expected a string but got:", input);
    return ""; // Fallback value or handle appropriately
  }

  // Remove \left and \right
  const withoutLeftRight = input.replace(/\\left|\\right/g, "");

  // Normalize multiple consecutive slashes
  const normalizedSlashes = withoutLeftRight.replace(/\/{2,}/g, "/");

  // Ensure valid LaTeX for fractions
  const consistentFractions = normalizedSlashes.replace(
    /\\frac{([^}]*)}{([^}]*)}/g,
    (_, numerator, denominator) => {
      return `\\frac{${numerator}}{${denominator}}`;
    }
  );

  // Replace parentheses formatted as \( and \) with normal parentheses
  const finalNormalized = consistentFractions.replace(/\\\(|\\\)/g, (match) => {
    return match === "\\(" ? "(" : ")";
  });

  return finalNormalized.trim();
}

// Validate LaTeX input using KaTeX
function isValidLaTeX(latex: string): boolean {
  try {
    katex.renderToString(latex, { throwOnError: true });
    return true;
  } catch (e) {
    console.error("Invalid LaTeX:", e, "Try agian please");
    return false;
  }
}
export { isValidLaTeX };

const RenderSteps: React.FC<{
  steps: string[];
  editMode: boolean;
  onEdit: (index: number, newStep: string) => void;
}> = ({ steps, editMode, onEdit }) => (
  <>
    <h3 className="text-lg font-medium mb-2">Solution Steps:</h3>
    {steps.map((step, index) => (
      <div key={index} className="mb-2">
        {editMode ? (
          <EditableMathField
            style={{ color: "black" }}
            latex={step}
            onChange={(mathField) => onEdit(index, mathField.latex())}
          />
        ) : isValidLaTeX(normalizeSlashes(step)) ? (
          <StaticMathField style={{ color: "black", pointerEvents: "none" }}>
            {normalizeSlashes(step)}
          </StaticMathField>
        ) : (
          <p style={{ color: "red" }}>Invalid LaTeX: {step}</p>
        )}
      </div>
    ))}
  </>
);

const BPanel: React.FC<Props> = ({
  answerResponse,
  similarQuestion,
  questionImage,
  edit,
  uploadType,
  mainQuestionValid,
  setQuestionImage,
  setAnswerResponse,
  setMainQuestionValid,
  isLoading,
  base64Image,
  setIsLoading,
}) => {
  const [mainQuestion, setMainQuestion] = useState<string>("");
  const [generatedQuestion, setGeneratedQuestion] = useState<string>("");
  const [answerSteps, setAnswerSteps] = useState<string[]>([]);
  const [finalAnswer, setFinalAnswer] = useState<string>("");

  const handleStepEdit = (index: number, newStep: string) => {
    const updatedSteps = [...answerResponse?.steps];
    updatedSteps[index] = newStep;
    setAnswerSteps(updatedSteps);
    setAnswerResponse({ ...answerResponse, steps: updatedSteps });
  };

  const handleFinalAnswerEdit = (newAnswer: string) => {
    setFinalAnswer(newAnswer); // Update final answer in the state
    setAnswerResponse({ ...answerResponse, final_answer: newAnswer }); // Update answerResponse with new final answer
  };

  useEffect(() => {
    // console.log("Editing:", edit);
    // console.log("Current questionImage:", questionImage);

    const tmpgeneratedQuestion = similarQuestion?.questions || "";
    const tmpmainquestion = questionImage || "";
    const tmpanswerSteps = answerResponse?.steps || [];
    const tmpfinalAnswer = answerResponse?.final_answer;

    // Normalize and validate the LaTeX inputs
    const normalizedMainQuestion = normalizeSlashes(tmpmainquestion);
    const normalizedFinalAnswer = normalizeSlashes(tmpfinalAnswer);

    console.log("normalizedMainQuestion:", normalizedMainQuestion);

    const tmpmainQuestionValid = isValidLaTeX(normalizedMainQuestion);
    const finalAnswerValid = isValidLaTeX(normalizedFinalAnswer);

    console.log(mainQuestionValid, tmpmainQuestionValid);
    if (normalizedMainQuestion) {
      if (!tmpmainQuestionValid) {
        setMainQuestionValid(mainQuestionValid + 2);
      } else {
        setMainQuestionValid(1);
      }
    }

    if (!finalAnswerValid) {
      toast.error(
        "An error occurred while analyzing the photo. Please try again.",
        { autoClose: 3000 }
      );
    }

    // Update state
    setMainQuestion(normalizedMainQuestion);
    setAnswerSteps(tmpanswerSteps);
    setFinalAnswer(normalizedFinalAnswer);
    setGeneratedQuestion(tmpgeneratedQuestion);

    // console.log(`mainquestion :`, tmpmainquestion);
    // console.log(`normalized:  `, normalizedMainQuestion);
    // console.log(tmpanswerSteps);
    // console.log(edit);
  }, [questionImage, similarQuestion, answerResponse, edit]);

  const BPanelRefresh = async () => {
    setIsLoading(true);
    if (uploadType === "Question") {
      const payload = {
        image_data: `data:image/png;base64,${base64Image}`,
      };
      var tmpQuestionImage = "";
      do {
        const response = await fetch(
          "https://ken6a03.pythonanywhere.com/api/ocr/extract",
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
          // console.log("tmpQuestionImage" + data?.text);
          tmpQuestionImage = data?.text;
          setQuestionImage(tmpQuestionImage);
        } else {
          console.error("Error:", data);
          alert(`Request failed: ${data.error || "Unknown error"}`);
        }
        setIsLoading(false);
        // console.log("valid question", isValidLaTeX(tmpQuestionImage));
      } while (!isValidLaTeX(tmpQuestionImage));
    }
  };
  return (
    <div className="sm:col-span-1 border-[15px] border-[#152143] rounded-2xl bg-gray-50 overflow-auto custom-scrollbar min-h-[300px]">
      {/* <StaticMathField>{"\\text{1. Simplify \\( \\left(\\frac{m^5 n^{-2}}{m^4 n^{-3}}\\right)^6 \\) and express your answer with positive indices}" }</StaticMathField>
      <StaticMathField>{"\\text{1. Simplify } \\left( \\frac{m^5 n^{-2}}{m^4 n^{-3}} \\right)^6 \\text{ and express your answer with positive indices}" }</StaticMathField> */}
      <div className="relative h-full w-full p-4">
        {isLoading && <ProgressBar isLoading={isLoading} />}
        {/* <h3 className="text-start font-bold text-4xl mr-2">B</h3> */}

        {(answerSteps.length > 0 || mainQuestion) && similarQuestion==="" ? (
          <div
            data-tooltip-content={
              "Refresh when page is blank or missing content"
            }
            data-tooltip-id="tooltip"
            // data-tooltip-place="bottom-end"
          >
            <RefreshOnHover
              text="B"
              className="text-start font-bold text-4xl mr-2"
              refreshHandler={BPanelRefresh}
            />
          </div>
        ) : (
          <p className="text-start font-bold text-4xl mr-2">B</p>
        )}

        {uploadType === "Question" &&
          !generatedQuestion &&
          mainQuestion &&
          edit && (
            <EditableMathField
              style={{ marginTop: "50px", color: "black" }}
              latex={mainQuestion}
              onChange={(mathField) => {
                console.log("Updated LaTeX:", mathField.latex());
                setQuestionImage(mathField.latex());
              }}
            />
          )}
        {!generatedQuestion && !edit && mainQuestion && (
          <div
            className="mt-[50px] text-black"
            style={{ pointerEvents: "none" }}
          >
            {isValidLaTeX(normalizeSlashes(mainQuestion)) ? (
              <StaticMathField style={{ color: "black" }}>
                {normalizeSlashes(mainQuestion)}
              </StaticMathField>
            ) : (
              <></>
            )}
          </div>
        )}
        {generatedQuestion && (
          <div className="mt-[50px]" style={{ pointerEvents: "none" }}>
            <h4 className="text-lg font-medium">Similar Question:</h4>
            {isValidLaTeX(normalizeSlashes(generatedQuestion)) ? (
              <StaticMathField style={{ color: "black" }}>
                {normalizeSlashes(generatedQuestion)}
              </StaticMathField>
            ) : (
              <p style={{ color: "red" }}>Invalid LaTeX: {generatedQuestion}</p>
            )}
          </div>
        )}
        {!isLoading && answerSteps.length > 0 && (
          <div className="">
            <RenderSteps
              steps={answerSteps}
              editMode={edit} // Pass edit mode to RenderSteps
              onEdit={handleStepEdit} // Pass onEdit function to handle step editing
            />
            {uploadType === "Answer" && edit ? (
              <div>
                <h4 className="text-black text-lg font-medium">
                  Final Answer:
                </h4>
                <EditableMathField
                  latex={finalAnswer}
                  onChange={(mathField) => {
                    handleFinalAnswerEdit(mathField.latex());
                  }}
                />
              </div>
            ) : (
              <div style={{ pointerEvents: "none" }}>
                <h4 className="text-black text-lg font-medium">
                  Final Answer:
                </h4>
                {isValidLaTeX(normalizeSlashes(finalAnswer)) ? (
                  <StaticMathField>
                    {normalizeSlashes(finalAnswer)}
                  </StaticMathField>
                ) : (
                  <p style={{ color: "red" }}>Invalid LaTeX: {finalAnswer}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BPanel;

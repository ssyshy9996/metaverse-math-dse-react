import React from 'react';

interface Props {
    setSolutionResponses: (response: any) => void;
    setSetSimilarQuestion: (response: any) => void;
    setIsLoading: (loading: boolean) => void;
    setEdit: (edit: boolean) => void;
    setEvaluation: (evaluation: any) => void;
    setUploadType: (type: string) => void;
    setCapturedImageType: (type: string) => void;
    setAnswerResponse: (response: string) => void;
    questionImage: string;
    answerResponse: any;
    solutionResponses: any;
    edit: boolean;
    capturedImageType: string;
    uploadType: string;
    disabledGenerateButton: boolean;
    removeQuestionWithSolution: () => void
    similarQuestion: string;
}


const Action: React.FC<Props> = ({ setAnswerResponse, setCapturedImageType, setUploadType, setEdit, setSetSimilarQuestion, setSolutionResponses, setIsLoading, setEvaluation, disabledGenerateButton, solutionResponses, uploadType, answerResponse, edit, questionImage ,removeQuestionWithSolution,similarQuestion}) => {

    const handleGetSolution = async () => {
        setIsLoading(true)
        const payload = {
            question: questionImage,
        };
        try {
            const response = await fetch("https://ken6a03.pythonanywhere.com/api/solution/solve", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                setSolutionResponses(data);
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

    const handleGenerateQuestion = async () => {
        setIsLoading(true);
        const payload = {
            base_question: questionImage
        };
        setIsLoading(true)
        try {
            const response = await fetch("https://ken6a03.pythonanywhere.com/api/practice/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (response.ok) {
                setSetSimilarQuestion(data);
                setUploadType("Answer")
                setCapturedImageType("")
                setEvaluation("")
                setAnswerResponse("")
                setSolutionResponses("")
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
    };

    const postEvaluation = async () => {
        setIsLoading(true)
        const payload = {
            question: similarQuestion,
            final_answer: answerResponse?.final_answer,
            steps: answerResponse?.steps,
        };

        try {
            const response = await fetch("https://ken6a03.pythonanywhere.com/api/solution/evaluate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (response.ok) {
                const evaluationData = data?.evaluation?.steps || [];
                setEvaluation(evaluationData);
            } else {
                console.error("API Error:", data);
                alert(`Request failed: ${data.error || "Unknown error"}`);
                setEvaluation([]);
                return null;
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            alert("An error occurred while connecting to the server.");
            return null;
        } finally {
            setIsLoading(false); // Stop loading
        }
    };
    // console.log(disabledGenerateButton)
    return (
        <div className="absolute sm:top-[calc(5%-3.6rem)] top-[-1.5rem] flex justify-around items-center bg-[#152143] rounded-3xl m-[auto] sm:w-[54%] left-[5%] sm:left-[23%] h-[70px] z-[10] w-[90%]">
            <h2 className="text-yellow-500 font-bold text-2xl">ACTION</h2>
            <div className="flex gap-4">
                {!edit &&
                    <button onClick={() => {
                        setEdit(true)
                        removeQuestionWithSolution();
                    }} className="px-2 py-1 bg-[#6aa4a5] text-black font-bold rounded hover:bg-gray-400">
                        EDIT
                    </button>
                }
                {edit &&
                    <button onClick={() => {
                        if (uploadType === "Answer") {
                            postEvaluation();
                        } else {
                            handleGetSolution();
                        }
                        setEdit(false);
                    }} className="px-2 py-1 bg-[#6aa4a5] text-black font-bold rounded hover:bg-gray-400">
                        OK?
                    </button>
                }
                <button style={{ opacity: !disabledGenerateButton ? "50%" : "100%", pointerEvents: !disabledGenerateButton ? "none" : "visible" }} disabled={!disabledGenerateButton ? true : false} onClick={handleGenerateQuestion} className="px-2 py-1 bg-[#6aa4a5] text-black font-bold rounded hover:bg-gray-400">
                    SIMILAR QUESTION
                </button>
            </div>
        </div>
    );
};

export default Action;

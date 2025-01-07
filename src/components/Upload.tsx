import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { MdOutlineChangeCircle } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isValidLaTeX } from "./BPanel";

interface UploadProps {
  setIsLoading: (loading: boolean) => void;
  setQuestionImage: (response: any) => void;
  answerResponse: any;
  setAnswerResponse: (response: any) => void;
  setEvaluation: (evaluation: any) => void;
  setEvaluationCorrect: (correct: boolean) => void;
  setUploadType: (type: string) => void;
  setSolutionResponses: (response: any) => void;
  setCapturedImageType: (type: string) => void;
  setDisabledGenerateButton: (status: boolean) => void;
  saveQuestionWithSolution: () => void;
  uploadType: string;
  mainQuestionValid: number;
  questionImage: string;
  similarQuestion: any;
  setSimilarQuestion: (response: any) => void;
  capturedImage: string | null;
  setCapturedImage: (image: string | null) => void;
  setBase64Image: (image: string | null) => void;
  edit: boolean;
}

const Upload: React.FC<UploadProps> = ({
  setIsLoading,
  setQuestionImage: setQuestionLatex,
  answerResponse,
  setAnswerResponse,
  setEvaluation,
  setEvaluationCorrect,
  setUploadType,
  setSolutionResponses,
  setDisabledGenerateButton,
  setCapturedImageType,
  mainQuestionValid,
  similarQuestion,
  setSimilarQuestion,
  uploadType,
  questionImage,
  saveQuestionWithSolution,
  capturedImage,
  setCapturedImage,
  setBase64Image,
  edit,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [photoMode, setPhotoMode] = useState(false);
  const [cameraAccessible, setCameraAccessible] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const changeUploadType = () => {
    // if (uploadType === "Answer" && answerResponse) {
    //   const confirm = window.confirm(
    //     "Are you sure you want to start a new question?"
    //   );
    //   if (!confirm) {
    //     return;
    //   }
    //   if (confirm) {
    //     window.location.reload();
    //   }
    // }
    setUploadType(uploadType === "Question" ? "Answer" : "Question");
  };

  useEffect(() => {
    console.log("hi")
    if (edit) return;
    if (mainQuestionValid >= 2 && capturedImage) {
      handleSubmit(capturedImage);
    }
    console.log(mainQuestionValid, questionImage);
    if (mainQuestionValid === 1 && questionImage) {
      const payload = {
        question: questionImage,
      };
      handleGetSolution(payload);
    }
  }, [mainQuestionValid]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: "environment", // This will use the back camera on mobile
        },
      })
      // .getUserMedia({ video: true })
      .then(() => {
        setCameraAccessible(true);
      })
      .catch(() => {
        setCameraAccessible(false);
      });
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
        setPhotoMode(false);
      }
    };

    if (capturedImage) {
      setDropdownOpen(false);
      setPhotoMode(false);
    }

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [dropdownOpen, capturedImage]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const fileInput = event.target;
    const file = fileInput.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (result) {
          compressImage(result, (compressedBase64) => {
            handleSubmit(compressedBase64);
            setCapturedImage(compressedBase64);
            setDropdownOpen(false);
            setCapturedImageType(uploadType);
          });
        } else {
          toast.error("Failed to upload image. Please try again.", {
            autoClose: 3000,
          });
        }
      };
      reader.readAsDataURL(file);
    }

    fileInput.value = "";
  };

  const handleCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        compressImage(imageSrc, (compressedBase64) => {
          setCapturedImage(imageSrc);
          handleSubmit(compressedBase64);
        });
      } else {
        toast.error("Failed to capture image. Please try again.", {
          autoClose: 3000,
        });
        setPhotoMode(false);
      }
    }
  };

  const compressImage = (
    base64String: string,
    callback: (compressed: string) => void
  ) => {
    const img = new Image();
    img.src = base64String;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const maxWidth = 500;
      const maxHeight = 500;

      let { width, height } = img;
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);

      const compressedBase64 = canvas.toDataURL("image/jpeg", 0.8);
      callback(compressedBase64);
    };
  };

  const handleGetSolution = async (payload: any) => {
    setIsLoading(true);
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
  };

  const handleSubmit = async (image: string) => {
    setIsLoading(true);

    if (!image) {
      toast.error("Please capture or upload an image before submitting.", {
        autoClose: 3000,
      });
      setIsLoading(false);
      return;
    }

    setIsLoading(true); // Start loading

    try {
      const base64Image = image.split(",")[1]; // Remove "data:image/jpeg;base64,"
      setBase64Image(base64Image);
      if (uploadType === "Question") {
        setEvaluation(null);
        setAnswerResponse("");
        setSolutionResponses("");
        setQuestionLatex("");
        setSimilarQuestion("");

        const payload = {
          image_data: `data:image/png;base64,${base64Image}`,
        };
        var tmpQuestionImage = "";
        const MAX_RETRY = 2;
        var retryCount = 0;
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
            console.log("tmpQuestionImage" + data?.text);
            tmpQuestionImage = data?.text;
            setQuestionLatex(tmpQuestionImage);
          } else {
            console.error("Error:", data);
            alert(`Request failed: ${data.error || "Unknown error"}`);
          }
        } while (!isValidLaTeX(tmpQuestionImage) && retryCount < MAX_RETRY);
      } else if (uploadType === "Answer") {
        const response = await axios.post(
          "https://ken6a03.pythonanywhere.com/api/ocr/extract_answer",
          {
            image_data: `data:image/png;base64,${base64Image}`,
          }
        );

        if (response.data && response.data.text) {
          const responseText = response.data.text;
          setAnswerResponse(responseText);

          const payload = {
            question: similarQuestion?.questions,
            final_answer: responseText?.final_answer,
            steps: responseText?.steps,
          };

          try {
            const response = await fetch(
              "https://ken6a03.pythonanywhere.com/api/solution/evaluate",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              }
            );

            const data = await response.json();
            if (response.ok) {
              const evaluationData = data?.evaluation?.steps || [];
              setEvaluation(evaluationData);
              setEvaluationCorrect(data?.evaluation?.final_answer);
            } else {
              console.error("API Error:", data);
              alert(`Request failed: ${data.error || "Unknown error"}`);
              setEvaluation([]);
              setEvaluationCorrect(false);
              return null;
            }
          } catch (error) {
            console.error("Fetch Error:", error);
            alert("An error occurred while connecting to the server.");
            return null;
          }
        } else {
          toast.error("Failed to extract text from the image.", {
            autoClose: 3000,
          });
        }
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("An error occurred while submitting the image.", {
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleTakePhotoClick = () => {
    if (cameraAccessible) {
      setPhotoMode(true);
      setDropdownOpen(false);
    } else {
      toast.error("Camera not accessible. Please check your device.", {
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="w-[90%] flex flex-col gap-4 sm:m-10 m-4 sm:w-[27%] h-auto">
      <div className="h-full flex flex-col justify-between mb-4">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={changeUploadType}
        >
          <div>
            <h2 className="text-white font-bold text-3xl fade-in-out">
              {uploadType}
            </h2>
          </div>
          <MdOutlineChangeCircle color="white" size={25} />
        </div>
        <div className="border-[15px] border-[#152143] rounded-2xl bg-white p-4 h-full relative text-center min-h-[300px]">
          <div className="flex justify-between items-center">
            <h3 className="z-[1] font-bold text-4xl ml-2">A</h3>
            <button
              onClick={() => {
                setDropdownOpen(true);
                setCapturedImage(null);
              }}
              className="z-[1] px-2 py-1 bg-[#6aa4a5] text-black font-bold rounded hover:bg-[#6aa4a580]"
            >
              Upload
            </button>
            {capturedImage && (
              <img
                src={capturedImage}
                alt="Captured"
                className="absolute top-[60px] left-[0] z-[0] w-[100%] h-[calc(100%-60px)] object-contain"
              />
            )}
            {dropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-4 mt-[140px] bg-[#6aa4a5] shadow-lg rounded-md w-64 text-black font-bold"
              >
                <ul className="py-2">
                  <li className="px-4 py-2 bg-[#6aa4a5] hover:bg-gray-300 cursor-pointer">
                    <label className="cursor-pointer block">
                      <span>Select from Library</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </li>
                  <li
                    className="px-4 py-2 bg-[#6aa4a5] hover:bg-gray-300 cursor-pointer"
                    onClick={handleTakePhotoClick}
                  >
                    Take Photo
                  </li>
                </ul>
              </div>
            )}
            {photoMode && (
              <div className="absolute top-[60px] w-full">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{
                    facingMode: "environment",
                    aspectRatio: 9 / 16,
                  }}
                  className="rounded shadow"
                />
                <button
                  onClick={handleCapture}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow mt-2"
                >
                  Capture Photo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;

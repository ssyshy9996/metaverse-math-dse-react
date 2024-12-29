import { useState } from "react";

const RefreshOnHover: React.FC<{
  text: string;
  className?: string;
  refreshHandler?: () => void;
  likeHandler?: () => void;
  dislikeHandler?: () => void;
}> = ({ text, className, refreshHandler, likeHandler, dislikeHandler }) => {
  const [showRefresh, setShowRefresh] = useState(false);
  const [showLike, setShowLike] = useState(false);
  const [showDislike, setShowDislike] = useState(false);

  return (
    <div
      className={className}
      onMouseEnter={() => {
        setShowRefresh(true);
        setShowLike(true);
        setShowDislike(true);
      }}
      onMouseLeave={() => {
        setShowRefresh(false);
        setShowLike(false);
        setShowDislike(false);
      }}
    >
      {text}
      {showRefresh && (
        <button className="ml-2" onClick={() => refreshHandler?.()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      )}
      {/* {showLike && (
        <button className="ml-2" onClick={() => likeHandler?.()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 14h-4.017l-3.2 6.5a2 2 0 01-2 1.8 1 1 0 01-1.6-.8l-3-6a2 2 0 00-2-1.8 1 1 0 01.8-2l3.5-7a2 2 0 012 2.894h4.764a2 2 0 01.789-1.894l1.617-3m-8 0a2 2 0 00-.222 1.615l-.706.706a2 2 0 01-2.89 2.616l-.777-.777a2 2 0 01.893-3.304l.818-.82zM17 0h-2.5a2.5 2.5 0 10-5 0v2.5a2.5 2.5 0 115 0v-2.5a2.5 2.5 0 011.5-2.5h2.5a2.5 2.5 0 012.5 2.5z"
            />
          </svg>
        </button>
      )}
      {showDislike && (
        <button className="ml-2" onClick={() => dislikeHandler?.()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      )} */}
    </div>
  );
};

export default RefreshOnHover;


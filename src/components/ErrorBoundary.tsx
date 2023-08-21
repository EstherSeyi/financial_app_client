import { useQueryClient } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { useNavigate } from "react-router-dom";

function fallbackRender({
  error,
  resetErrorBoundary,
}: {
  error: { message: string };
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="border border-highlightBlue rounded-md p-4 mt-8">
      <p>It looks like something has gone wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>

      <p>
        Please click here to reset app:{" "}
        <button
          onClick={resetErrorBoundary}
          className="p-2 text-white bg-midBlue rounded-lg  hover:border border-highlightBlue"
        >
          Click me!
        </button>
      </p>
    </div>
  );
}

const AppErrorBoundary = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return (
    <ErrorBoundary
      fallbackRender={fallbackRender}
      onReset={async () => {
        await queryClient.refetchQueries();
        localStorage.setItem("favorites", JSON.stringify([]));
        navigate("/");
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export default AppErrorBoundary;

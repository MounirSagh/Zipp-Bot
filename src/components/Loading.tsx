import { ClipLoader } from "react-spinners";

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[700px]">
      <ClipLoader
        color="#ffffff"
        size={60}
        cssOverride={{
          borderWidth: "4px",
        }}
      />
    </div>
  );
}

export default Loading;

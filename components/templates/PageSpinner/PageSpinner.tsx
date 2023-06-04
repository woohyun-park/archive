import ReactDOM from "react-dom";
import Spinner from "components/atoms/Spinner/Spinner";

export default function PageSpinner() {
  return ReactDOM.createPortal(
    <div className="flex flex-col items-center justify-center w-full h-full bg-white">
      <div className="flex flex-col items-center bg-white">
        <Spinner />
      </div>
      <div className="-mt-1 text-sm">LOADING</div>
    </div>,
    document.getElementById("modal-root") as Element
  );
}

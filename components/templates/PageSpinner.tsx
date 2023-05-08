import Spinner from "../atoms/Spinner";
import WrapFullScreen from "../wrappers/WrapFullScreen";
import ReactDOM from "react-dom";

export default function PageSpinner() {
  return ReactDOM.createPortal(
    <WrapFullScreen>
      <div className="-mt-16">
        <Spinner />
      </div>
    </WrapFullScreen>,
    document.getElementById("modal-root") as Element
  );
}

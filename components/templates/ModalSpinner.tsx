import Spinner from "../atoms/Spinner";
import WrapFullScreen from "../wrappers/WrapFullScreen";
import ReactDOM from "react-dom";

export default function ModalSpinner() {
  return ReactDOM.createPortal(
    <WrapFullScreen>
      <Spinner />
    </WrapFullScreen>,
    document.getElementById("modal-root") as Element
  );
}

import ReactDOM from "react-dom";
import Spinner from "./Spinner";
import WrapFullScreen from "../wrappers/WrapFullScreen";

export default function ModalSpinner() {
  return ReactDOM.createPortal(
    <WrapFullScreen>
      <Spinner />
    </WrapFullScreen>,
    document.getElementById("modal-root") as Element
  );
}

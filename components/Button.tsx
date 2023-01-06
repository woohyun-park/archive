import { COLOR } from "../custom";

interface IButton {
  text: string;
  onClick?: IOnClick;
}

interface IOnClick {
  (e: React.MouseEvent<HTMLButtonElement>): void;
}

export default function Button({ text, onClick }: IButton) {
  console.log(text, onClick);
  return (
    <>
      <button className="button" onClick={onClick}>
        {text}
      </button>
      <style jsx>
        {`
          .button {
            margin: 8px 0;
            background-color: ${COLOR.btn1};
            border: none;
            border-radius: 8px;
            padding: 8px;
            color: ${COLOR.txtDark1};
            width: 100%;
          }
        `}
      </style>
    </>
  );
}

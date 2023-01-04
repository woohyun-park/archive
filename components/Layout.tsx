import Nav from "./Nav";

interface ILayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: ILayoutProps) {
  return (
    <>
      <div className="pageCont">{children}</div>
      <Nav />
      <style jsx global>
        {`
          :root {
            display: flex;
            justify-content: center;
            width: 100%;
            background-color: #d9d9d9;
          }
          body {
            margin: 0;
            width: 100vw;
            max-width: 480px;
            min-height: calc(100vh - 72px);
            background-color: white;
            box-sizing: border-box;
          }
          .pageCont {
            margin: 16px;
            margin-top: 48px;
          }
        `}
      </style>
    </>
  );
}

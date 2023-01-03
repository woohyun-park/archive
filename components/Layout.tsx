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
          body {
            margin: 0;
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

import Nav from "./Nav";

interface ILayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: ILayoutProps) {
  return (
    <>
      <Nav />
      <div className="pageCont">{children}</div>
      <style jsx global>
        {`
          body {
            margin: 0;
          }
          .pageCont {
            margin: 16px;
          }
        `}
      </style>
    </>
  );
}

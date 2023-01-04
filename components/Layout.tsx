import { useRouter } from "next/router";
import Nav from "./Nav";

interface ILayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: ILayoutProps) {
  const router = useRouter();
  console.log(router.pathname.split("/"));
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
          body::-webkit-scrollbar {
            display: none;
          }
          .pageCont {
            padding: 16px;
            padding-top: ${router.pathname.split("/")[1] === "post"
              ? "0"
              : "48px"};
            padding-bottom: 96px;
          }
        `}
      </style>
    </>
  );
}

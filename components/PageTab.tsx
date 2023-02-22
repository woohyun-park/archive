import { useRouter } from "next/router";
import { Children, useEffect, useRef } from "react";
import { IPost } from "../libs/custom";
import { useStatus } from "../stores/useStatus";
import Btn from "./atoms/Btn";
import Page from "./Page";
import { IPageProps } from "./Page";
import PagePostColTwo from "./PagePostColTwo";

interface IPageTapProps {
  header: React.ReactNode;
  tabs: ITabPage[];
}

type ITabPage = IPageProps & {
  type: "postColTwo" | "default";
  label: string;
};

export default function PageTab({ header, tabs }: IPageTapProps) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const { scroll, setScroll, pages, setSelectedPage } = useStatus();

  const path = router.asPath;
  const page = pages[path] && pages[path].selectedPage;

  useEffect(() => {
    if (page !== undefined) {
      ref.current?.scrollTo(0, scroll[path + "/" + page]);
    } else {
      setSelectedPage(path, 0);
    }
  }, [page]);

  return (
    <>
      <div className="relative">
        {tabs.map((tab, i) => (
          <div
            className="overflow-auto h-[100vh] absolute w-full"
            key={i}
            style={{
              transform: `translateX(${(i - page) * 100}%)`,
            }}
          >
            <div>
              <div>{header}</div>
              <div>
                <div className="sticky top-0 z-10 h-8">
                  <div className="flex px-4 py-4 bg-white">
                    {Children.toArray(
                      tabs.map((tab, i) => (
                        <Btn
                          label={tab.label}
                          onClick={() => {
                            setScroll(
                              path + "/" + page,
                              ref.current?.scrollTop || 0
                            );
                            setSelectedPage(path, i);
                          }}
                          style={{
                            width: "100%",
                            marginRight: i === tabs.length - 1 ? "" : "0.25rem",
                          }}
                          isActive={page === i}
                        />
                      ))
                    )}
                  </div>
                </div>
                <div className="mt-8 mb-32">
                  {Children.toArray(
                    tabs.slice(i, i + 1).map((tab) => (
                      <div className="w-full" ref={page === i ? ref : null}>
                        <Page
                          page={tab.page}
                          data={tab.data}
                          onIntersect={tab.onIntersect}
                          onChange={tab.onChange}
                          onRefresh={tab.onRefresh}
                          changeListener={tab.changeListener}
                          isLast={tab.isLast}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  // return (
  //   <>
  //     {}
  //     <div className="overflow-auto h-[100vh]">
  //       <div>
  //         <>{header}</>
  //         <div>
  //           <h2 className="sticky top-0 z-10 h-8">
  //             <div className="flex px-4 py-4 bg-white">
  //               {Children.toArray(
  //                 tabs.map((tab, i) => (
  //                   <Btn
  //                     label={tab.label}
  //                     onClick={() => {
  //                       setScroll(
  //                         path + "/" + page,
  //                         ref.current?.scrollTop || 0
  //                       );
  //                       setSelectedPage(path, i);
  //                     }}
  //                     style={{
  //                       width: "100%",
  //                       marginRight: i === tabs.length - 1 ? "" : "0.25rem",
  //                     }}
  //                     isActive={page === i}
  //                   />
  //                 ))
  //               )}
  //             </div>
  //           </h2>
  //           <div className="mt-8 mb-32">
  //             {Children.toArray(
  //               tabs.slice(0, 1).map((tab, i) => (
  //                 <div className="w-full" ref={page === i ? ref : null}>
  //                   <Page
  //                     page={tab.page}
  //                     data={tab.data}
  //                     onIntersect={tab.onIntersect}
  //                     onChange={tab.onChange}
  //                     onRefresh={tab.onRefresh}
  //                     changeListener={tab.changeListener}
  //                     isLast={tab.isLast}
  //                   />
  //                 </div>
  //               ))
  //             )}
  //           </div>

  //           {/* <div className="text-5xl break-words">
  //             adfadasdfasdfasadasdfasdfadfasadasdfasdfasadasdfasdfasdfasadasdfasdfasadasdsadasdfasdfasdfasadasdfasdfasadasdfasdfdfasdfasadasdfasdfasadasdfasdfdfasadasdfasdfasadasdfasdfasadasdfasdfasadasdfasdfasadasdfasdfasadasdfasdfasadasdfasdfasadasdfasdfasadasdfasdfasadasdfasdfasadasdfasdfasadasdfasdfasadasdfasdfasdfasdfasdfs
  //           </div> */}
  //         </div>
  //       </div>
  //     </div>
  //   </>
  // );

  // return (
  //   <>
  //     <div>
  // <h1 className="title-page-sm">에 대한 검색결과</h1>
  //       <div>
  //         <div className="sticky top-[0px]">
  //           <div className="flex h-full px-4 pb-4 bg-white">
  //             {Children.toArray(
  //               tabs.map((tab, i) => (
  //                 <Btn
  //                   label={tab.label}
  //                   onClick={() => {
  //                     setScroll(path + "/" + page, ref.current?.scrollTop || 0);
  //                     setSelectedPage(path, i);
  //                   }}
  //                   style={{
  //                     width: "100%",
  //                     marginRight: i === tabs.length - 1 ? "" : "0.25rem",
  //                   }}
  //                   isActive={page === i}
  //                 />
  //               ))
  //             )}
  //           </div>
  //         </div>
  //         <div
  //           onClick={() => {
  //             setScroll(path + "/" + page, ref.current?.scrollTop || 0);
  //           }}
  //         >
  //           <div className="h-[calc(100vh_-_13rem)] overflow-hidden relative">
  //             {Children.toArray(
  //               tabs.map((tab, i) => (
  //                 <div
  //                   className="w-full h-[calc(100vh_-_13rem)] overflow-scroll absolute duration-300"
  //                   style={{
  //                     transform: `translateX(${(i - page) * 100}%)`,
  //                   }}
  //                   ref={page === i ? ref : null}
  //                 >
  //                   <div
  //                     className="absolute w-full duration-300"
  //                     id={`test${i}`}
  //                   >
  //                     {tab.type === "postColTwo" ? (
  //                       <PagePostColTwo
  //                         posts={tab.data as IPost[]}
  //                         onIntersect={tab.onIntersect}
  //                         onChange={tab.onChange}
  //                         onRefresh={tab.onRefresh}
  //                         changeListener={tab.changeListener}
  //                         isLast={tab.isLast || false}
  //                       />
  //                     ) : (
  //                       <Page
  //                         page={tab.page}
  //                         data={tab.data}
  //                         onIntersect={tab.onIntersect}
  //                         onChange={tab.onChange}
  //                         onRefresh={tab.onRefresh}
  //                         changeListener={tab.changeListener}
  //                         isLast={tab.isLast}
  //                       />
  //                     )}
  //                   </div>
  //                 </div>
  //               ))
  //             )}
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </>
  // );
}

import React from "react";
import PullToRefresh from "react-simple-pull-to-refresh";
import { mergeTailwindClasses } from "../../apis/tailwind";
import Loader from "../Loader";

interface IWrapRefreshAndReload {
  children: React.ReactNode;
  loading: boolean;
  onRefresh: () => Promise<any>;
  className?: string;
}

export default function WrapRefreshAndLoad({
  children,
  loading,
  onRefresh,
  className,
}: IWrapRefreshAndReload) {
  return (
    <>
      <PullToRefresh
        onRefresh={onRefresh}
        pullingContent={<Loader isVisible={true} />}
        refreshingContent={<Loader isVisible={true} />}
        isPullable={true}
        className={mergeTailwindClasses("min-h-[50vh]", className || "")}
      >
        <>{children}</>
      </PullToRefresh>
      <Loader isVisible={loading} scrollIntoView={true} />
    </>
  );
}

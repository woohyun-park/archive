import React from "react";
import PullToRefresh from "react-simple-pull-to-refresh";
import { mergeTailwindClasses } from "../../apis/tailwind";
import Loader from "../Loader";

interface IWrapRefreshAndReload {
  children: React.ReactNode;
  loading: boolean;
  isPullable?: boolean;
  className?: string;
  onRefresh: () => Promise<any>;
}

export default function WrapRefreshAndLoad({
  children,
  loading,
  isPullable = true,
  className,
  onRefresh,
}: IWrapRefreshAndReload) {
  return (
    <>
      <PullToRefresh
        onRefresh={onRefresh}
        pullingContent={<Loader isVisible={true} />}
        refreshingContent={<Loader isVisible={true} />}
        isPullable={isPullable}
        className={className}
      >
        <>{children}</>
      </PullToRefresh>
      <Loader isVisible={loading} scrollIntoView={true} />
    </>
  );
}

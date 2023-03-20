import React from "react";

interface IWrapTransition {
  children: React.ReactNode;
}

export default function WrapTransition({ children }: IWrapTransition) {
  return children;
}

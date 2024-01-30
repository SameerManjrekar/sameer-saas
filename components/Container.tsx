import React, { ReactNode } from "react";

const Container = ({ children }: { children: ReactNode }) => {
  return <div className="max-w-7xl h-screen container p-7">{children}</div>;
};

export default Container;

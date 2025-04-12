import React, { ReactNode } from "react";
import { AuthProvider } from "./auth-provider";

const Provider = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <AuthProvider>{children}</AuthProvider>
    </>
  );
};

export default Provider;

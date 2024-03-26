import React, { FC, ReactElement } from "react";
import { Layout } from "antd";
import { ErrorBoundary } from "react-error-boundary";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import Fallback from "./Fallback";
import Header from "./Header";

interface ApplicationProps {
  children: ReactElement;
}

const Application: FC<ApplicationProps> = (props) => {
  const { reset } = useQueryErrorResetBoundary();
  const onReset = () => reset();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />

      <Layout>
        <Layout.Content className="!overflow-[initial] !p-4 !pt-0">
          <ErrorBoundary FallbackComponent={Fallback} onReset={onReset}>
            {props.children}
          </ErrorBoundary>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default Application;

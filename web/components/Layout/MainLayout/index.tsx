import Head from "next/head";
import { FC, ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: FC<MainLayoutProps> = (props) => {
  return (
    <>
      <Head>
        <title>Stock Option Management</title>
      </Head>
      {props.children}
    </>
  );
};

export default MainLayout;

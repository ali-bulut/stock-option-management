import { ReactElement } from "react";
import { Layout, Typography } from "antd";
import Authentication from "@/components/Layout/Authentication";
import MainLayout from "@/components/Layout/MainLayout";
import type { NextPageWithLayout } from "./_app";

const { Title } = Typography;

const Page: NextPageWithLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <div className="flex flex-col py-32 items-center gap-4">
        <Title>Stock Option Management</Title>

        <div className="flex flex-col w-full max-w-sm gap-4"></div>
      </div>
    </Layout>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout>
      <Authentication>{page}</Authentication>
    </MainLayout>
  );
};

export default Page;

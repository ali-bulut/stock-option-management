import MainLayout from "@/components/Layout/MainLayout";
import { Button, Result } from "antd";
import Link from "next/link";
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "./_app";

const Page: NextPageWithLayout = () => {
  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={
        <Link href={"/"}>
          <Button type="primary">Back Home</Button>
        </Link>
      }
    />
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Page;

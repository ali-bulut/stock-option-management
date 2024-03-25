import MainLayout from "@/components/Layout/MainLayout";
import { Button, Result } from "antd";
import Link from "next/link";
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "./_app";

const Page: NextPageWithLayout = () => {
  return (
    <Result
      status="500"
      title="500"
      subTitle="Sorry, something went wrong."
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

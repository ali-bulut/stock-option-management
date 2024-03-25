import MainLayout from "@/components/Layout/MainLayout";
import { Button, Result } from "antd";
import Link from "next/link";
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "./_app";

const Page: NextPageWithLayout = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
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

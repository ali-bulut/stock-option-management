import { ReactElement } from "react";
import { NextPageWithLayout } from "../_app";
import MainLayout from "@/components/Layout/MainLayout";
import Authentication from "@/components/Layout/Authentication";
import Application from "@/components/Layout/Application";
import { Alert, Avatar, Button, Card, Layout, Typography } from "antd";
import Meta from "antd/es/card/Meta";
import useUser from "@/hooks/useUser";
import CurrencyHelper from "@/helpers/CurrencyHelper";
import { PaymentModal } from "@/components/Payment";
import { useModalControls } from "@/hooks/useModalControls";
import { WalletOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const { user, userQuery } = useUser();
  const { open, openModal, closeModal } = useModalControls();

  const onPaymentSuccess = async () => {
    // This is a hack to update the user balance after a successful payment intent webhook
    setTimeout(() => {
      userQuery.refetch();
    }, 1500);
  };

  return (
    <Layout>
      {router.query.new && (
        <Alert
          message={
            <Typography.Text className="font-medium">
              Let's transfer some money into your wallet to start trading!
            </Typography.Text>
          }
          type="info"
          className="my-3 flex justify-center items-center"
          showIcon
          closable
        />
      )}

      <div className="flex flex-col py-8 items-center gap-4">
        <Typography.Title>Profile</Typography.Title>

        <Card
          className="w-full max-w-96"
          actions={[
            <Button
              type="link"
              className="space-x-2"
              key="transfer_money"
              onClick={openModal}
            >
              <WalletOutlined />
              <Typography.Text>Transfer Money</Typography.Text>
            </Button>,
          ]}
        >
          <Meta
            avatar={<Avatar src="/avatar.svg" />}
            title={user.name}
            description={
              <div>
                <Typography.Text>Email: </Typography.Text>
                <Typography.Text>{user.email}</Typography.Text>
                <br />

                <Typography.Text>Amount in Wallet: </Typography.Text>
                <Typography.Text className="font-semibold">
                  {CurrencyHelper.format(user.balance_in_cents, 2, true)}
                </Typography.Text>
              </div>
            }
          />
        </Card>

        <PaymentModal
          open={open}
          closeModal={closeModal}
          onPaymentSuccess={onPaymentSuccess}
        />
      </div>
    </Layout>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout>
      <Authentication>
        <Application>{page}</Application>
      </Authentication>
    </MainLayout>
  );
};

export default Page;

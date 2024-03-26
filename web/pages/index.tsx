import { ReactElement, useState } from "react";
import { Button, InputNumber, Layout, Typography } from "antd";
import Authentication from "@/components/Layout/Authentication";
import MainLayout from "@/components/Layout/MainLayout";
import type { NextPageWithLayout } from "./_app";
import Application from "@/components/Layout/Application";
import useStockSimulation from "@/hooks/useStockSimulation";
import toast from "react-hot-toast";
import ErrorHelper from "@/helpers/ErrorHelper";
import { IStockSimulation } from "@/interfaces/IStockSimulation";

const { Title } = Typography;

const Page: NextPageWithLayout = () => {
  const { simulateMutation } = useStockSimulation();
  const [initialAmount, setInitialAmount] = useState("");
  const [response, setResponse] = useState<IStockSimulation>();

  const onSimulate = async () => {
    if (!initialAmount) {
      toast.error("Please enter an initial amount", {
        id: "initial-amount-empty",
      });
      return;
    }

    const res = await toast.promise(
      simulateMutation.mutateAsync({ initial_amount: Number(initialAmount) }),
      {
        error: ErrorHelper.parseApiError,
        loading: "Simulating...",
        success: "Simulation Completed!",
      }
    );
    setResponse(res.data);
  };

  return (
    <Layout>
      <div className="flex flex-col py-16 items-center gap-4">
        <Title>Stock Option Management</Title>

        <div className="flex flex-col w-full max-w-sm gap-4">
          <InputNumber
            addonBefore="$"
            className="w-full"
            placeholder="Enter Initial Amount"
            onChange={(e) => setInitialAmount(e || "")}
            value={initialAmount}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
            onPressEnter={onSimulate}
          />
          <Button onClick={onSimulate}>Simulate</Button>

          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
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

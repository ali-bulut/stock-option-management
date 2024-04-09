import { useState } from "react";
import useWebSocket from "react-use-websocket";
import { IStockSimulation, ITransactions } from "@/interfaces/IStockSimulation";
import EnvironmentHelper from "@/helpers/EnvironmentHelper";
import useUser from "./useUser";

export default function useWebhook(enabled: boolean = true) {
  const [transactions, setTransactions] = useState<ITransactions>();
  const [result, setResult] = useState<IStockSimulation>();
  const { user } = useUser();
  const { readyState, getWebSocket, sendJsonMessage } = useWebSocket(
    EnvironmentHelper.WEBSOCKET_URL,
    {
      queryParams: { user_email: user.email },
    }
  );

  const ws = getWebSocket();
  if (ws && readyState === 1 && enabled) {
    sendJsonMessage({
      command: "subscribe",
      identifier: `{"channel":"StockSimulationChannel"}`,
    });

    ws.onmessage = (e) => {
      let data = e.data;
      data = JSON.parse(data);
      if (data?.message && data.type !== "ping") {
        const response = data.message;
        if (response.type == "periodic") {
          setTransactions(response.transactions);
        } else if (response.type == "end") {
          setResult(response.result);
        }
      }
    };
  }

  return { transactions, result, setTransactions, setResult };
}

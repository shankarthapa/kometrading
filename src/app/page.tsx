"use client";
import { ArrowLongRightIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from "react";
import { socket } from "../socket";
import { SocketEvents } from "./socket-events";

export default function Home() {
  const [scoketLogs, setScoketLogs] = useState<string[]>([]);
  const [isWaiting, setIsWaiting] = useState(false);
  const [finalData, setFinalData] = useState<object[]>();

  useEffect(() => {
    const onConnect = () => {
      scoketLogs.push('CLIENT:MSG onConnect');
      setScoketLogs([...scoketLogs]);
      socket.io.engine.on("upgrade", (transport) => { });
    }

    const onDisconnect = () => {
      scoketLogs.push('CLIENT:MSG onDisconnect');
      setScoketLogs([...scoketLogs]);
    }

    const onPingPong = (resp: any) => {
      scoketLogs.push('CLIENT:MSG onPingPong got msg from SOCKET SERVER');
      setScoketLogs([...scoketLogs]);
      scoketLogs.push(resp.msg);
      setScoketLogs([...scoketLogs]);
    }
    const onLogs = (resp: any) => {
      scoketLogs.push('CLIENT:MSG onLogs got msg from SOCKET SERVER');
      setScoketLogs([...scoketLogs]);
      scoketLogs.push(resp.msg);
      setScoketLogs([...scoketLogs]);
    }

    const onTradeComplete = (resp: any) => {
      scoketLogs.push('CLIENT:MSG onTradeComplete got msg from SOCKET SERVER');
      setScoketLogs([...scoketLogs]);
      setFinalData({ ...resp });
      setIsWaiting(false);
    }

    const onError = (e: any) => {
      scoketLogs.push(`CLIENT:MSG onError: ${JSON.stringify(e)}`);
      setScoketLogs([...scoketLogs]);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onError);
    socket.on("connect_failed", onError);
    socket.on(SocketEvents.PING_PONG, onPingPong);
    socket.on(SocketEvents.STATUS_LOGS, onLogs);
    socket.on(SocketEvents.TRADE_COMPLETE, onTradeComplete);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onError);
      socket.off("connect_failed", onError);

      socket.off(SocketEvents.PING_PONG, onPingPong);
      socket.off(SocketEvents.STATUS_LOGS, onLogs);
      socket.off(SocketEvents.TRADE_COMPLETE, onTradeComplete);
    };
  }, []);

  const onClickTrade = () => {
    scoketLogs.push('CLIENT:MSG onClickTrade button');
    setScoketLogs([...scoketLogs]);
    socket.emit(SocketEvents.TRADE_INIT, {});
    setIsWaiting(true);
  }

  const formatLogs = () => {
    let logStr = '';
    scoketLogs.forEach((a) => {
      logStr = logStr + '\n' + a;
    });
    return logStr;
  }


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gray-50">
      <div className="flex w-4/5 rounded-2xl p-8 bg-slate-200">
        <div className="flex flex-col flex-1 bg-gray-400 mr-8 h-[500px]">
          <h1 className="text-2xl">trade details</h1>
          <p>{JSON.stringify(finalData)}</p>
        </div>
        <div className="flex flex-1 flex-col">
          <h1 className="text-2xl">System logs</h1>
          <div className="flex flex-col h-full my-4 p-2 border-2 border-[#6495ed]">
            <textarea readOnly className="h-full w-full" value={formatLogs()}></textarea>
          </div>
          <div className="flex flex-row">
            {!isWaiting && <button disabled={isWaiting} onClick={onClickTrade} className="flex w-40 items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Trade <ArrowLongRightIcon className="ml-2"></ArrowLongRightIcon>
            </button>}

            {isWaiting && <button
              type="button"
              className="flex w-40 items-center justify-center pointer-events-none rounded bg-indigo-600 px-6 pb-2 pt-2.5 uppercase leading-normal text-white transition duration-150 ease-in-out"
              disabled>
              <div
                className="inline-block h-4 w-4 animate-[spinner-grow_0.75s_linear_infinite] rounded-full bg-current align-[-0.125em] opacity-0 motion-reduce:animate-[spinner-grow_1.5s_linear_infinite]"
                role="status"></div>
              <span>Processing...</span>
            </button>}


          </div>
        </div>
      </div>
    </main>
  );
}

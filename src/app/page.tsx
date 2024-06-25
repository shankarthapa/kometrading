"use client";
import Image from "next/image";
import { ArrowLongRightIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from "react";
import { socket } from "../socket";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [scoketMsg, setScoketMsg] = useState("");

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      console.log('onConnect');
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      console.log('onDisconnect');
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("TRADE_COMPLETE", (resp) => {
      console.log('resp>>  ', resp);
      setScoketMsg(resp.msg);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const onClickTrade = () => {
    socket.emit('INIT_TRADE', {});
  }


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gray-50">
      <div className="flex w-4/5 rounded-2xl p-8 bg-slate-200 items-end">
        <div className="flex flex-1 bg-gray-400 mr-8 h-[500px]">
          trade details - {scoketMsg}
        </div>
        <div className="flex flex-1">
          <button onClick={onClickTrade} className="flex w-40 items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Trade <ArrowLongRightIcon className="ml-2"></ArrowLongRightIcon>
          </button>
        </div>
      </div>
    </main>
  );
}

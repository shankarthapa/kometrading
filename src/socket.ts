"use client";
import { io } from "socket.io-client";
const ENDPOINT = process.env.NEXT_PUBLIC_APP_SOCKET || 'ws://127.0.0.1:9000';
export const socket = io(ENDPOINT, { transports: ['websocket'] }).connect();
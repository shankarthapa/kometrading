"use client";
import { io } from "socket.io-client";
const ENDPOINT = process.env.NEXT_PUBLIC_APP_SOCKET || 'http://169.38.137.104:9000';
export const socket = io(ENDPOINT, { transports: ['websocket'] }).connect();
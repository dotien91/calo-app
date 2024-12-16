import React from "react";
import { TypedSocket } from "@services/socket/SocketConnect";

export const SocketHelperRef = React.createRef<TypedSocket>();

export function disconnectSocket() {
  SocketHelperRef.current?.disconnect?.();
}

export function onSocket(topic: string, callback: (data: any) => void) {
  SocketHelperRef.current?.on?.(topic, callback);
}

export function offSocket(topic: string, callback?: (data?: any) => void) {
  SocketHelperRef.current?.off?.(topic, callback);
}

export function emitSocket(topic: string, callback: any) {
  SocketHelperRef.current?.emit?.(topic, callback);
}

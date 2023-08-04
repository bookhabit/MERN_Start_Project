import { Socket } from "socket.io";

export interface CustomSocket extends Socket {
    username: string; // 소켓에 추가로 username 속성을 정의합니다.
    userId:number;
}
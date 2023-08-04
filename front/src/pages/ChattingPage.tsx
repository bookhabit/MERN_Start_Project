import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { Button, Input } from '../elements';
import { InputChangeEvent } from '../elements/Input';
import { io } from "socket.io-client";

// 소켓연결
const socket = io("http://localhost:4000"); 
type MessageType = string; // messages의 타입을 지정합니다.

const ChattingPage = () => {
    const [messages, setMessages] = useState<MessageType[]>([])
    const [messageInput, setMessageInput] = useState("");  
    const [errMsg,setErrMsg] = useState('');

    const onChange = (event:InputChangeEvent)=>{
        setMessageInput(event.target.value)
    }

    const handleSendMessage  = (event:MouseEvent<HTMLButtonElement>)=>{
        event.preventDefault()
        // 서버로 데이터 전송
        socket.emit("hello from client", messageInput);
        setMessageInput("");
    }

    // 채팅기능
    useEffect(() => {
        // 서버로부터 데이터 수신
        socket.on("hello from server", (message:MessageType) => {
            setMessages((prevMessage)=>[...prevMessage,message])
        });

        // 언마운트 시 소켓 연결 해제
        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div className='flex h-screen'>
            <div className='bg-blue-50 w-1/3'>
                contacts
            </div>
            <div className='bg-blue-100 w-2/3 flex flex-col p-2'>
                <div className='flex-grow'>
                    messages with selected person
                    {messages.map((message, index) => (
                        <div key={index}>
                            <p>{message}</p>
                        </div>
                    ))}
                </div>
                <form className='flex items-center gap-2 mb-5'>
                    <Input 
                        placeholder='메시지를 입력해주세요'    
                        sort="chatting"
                        type='text'
                        value={messageInput}
                        name="chatting"
                        _onChange={onChange}
                        isValid={true}
                        errorMessage={errMsg}
                        validateMode={false}
                    />
                    <Button _onClick={handleSendMessage } sort="chatting" />
                </form>
            </div>
        </div>
    );
};

export default ChattingPage;
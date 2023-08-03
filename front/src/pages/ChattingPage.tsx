import React, { useEffect, useState } from 'react';
import { Button, Input } from '../elements';
import { InputChangeEvent } from '../elements/Input';
import { io } from "socket.io-client";

const socket = io("http://localhost:4000"); // 백엔드 서버의 주소

const ChattingPage = () => {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");  
    const [errMsg,setErrMsg] = useState('');

    const onChange = (event:InputChangeEvent)=>{
        setMessageInput(event.target.value)
    }

    const handleSendMessage  = ()=>{
        socket.emit("chat message", messageInput);
        setMessageInput("");
    }

    // 채팅연결
    useEffect(() => {
        socket.on("chat message", (message) => {
            console.log(message)
        });

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
                        <div key={index}>{message}</div>
                    ))}
                </div>
                <div className='flex items-center gap-2 mb-5'>
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
                </div>
            </div>
        </div>
    );
};

export default ChattingPage;
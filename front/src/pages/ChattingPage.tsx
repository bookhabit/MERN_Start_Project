import React, { ChangeEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import { Button, Input } from '../elements';
import { InputChangeEvent } from '../elements/Input';
import { io } from "socket.io-client";

// 소켓연결
const socket = io("http://localhost:4000",{withCredentials:true}); 
type MessageType = {
    username:string,
    text:string,
    time:string,
}; // messages의 타입을 지정합니다.

const ChattingPage = () => {
    const [messages, setMessages] = useState<MessageType[]>([])
    const [messageInput, setMessageInput] = useState("");  
    const [broadcast,setBroadcast] = useState<MessageType>();
    const [errMsg,setErrMsg] = useState('');
    const divUnderMessages = useRef<HTMLDivElement | null>(null);

    const onChange = (event:InputChangeEvent)=>{
        setMessageInput(event.target.value)
    }

    const handleSendMessage  = (event:MouseEvent<HTMLButtonElement>)=>{
        event.preventDefault()
        // 서버로 데이터 전송
        socket.emit("message from client", messageInput);
        setMessageInput("");
    }

    // 채팅기능
    useEffect(() => {
        // boradcast 수신
        socket.on('broadcast',(message)=>{
            setBroadcast(message)
        })

        // 서버로부터 데이터 수신
        socket.on("message from server", (message:MessageType) => {
            console.log(message)
            setMessages((prevMessage)=>[...prevMessage,message])
        });

        // 언마운트 시 소켓 연결 해제
        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        const div = divUnderMessages.current;
        
        if (div) {
          div.scrollIntoView({behavior:'smooth', block:'end'});
        }
    }, [messages]);

    return (
        <div className='flex h-screen'>
            <div className='bg-blue-50 w-1/3'>
                contacts
            </div>
            <div className='bg-blue-100 w-2/3 flex flex-col p-2 gap-5'>
                {broadcast && <p>{broadcast?.username} 님이 {broadcast?.text}</p> }
                <div className="relative h-full">
                    <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2">
                        <div className='flex-grow flex flex-col gap-5' ref={divUnderMessages}>
                            {messages.map((message, index) => (
                                <div key={index} className='flex items-center gap-5 bg-white'>
                                    <p>{message.username}</p>
                                    <p className='text-lg'>{message.text}</p>
                                    <p className=' text-gray-400 text-md'>{message.time}</p>
                                </div>
                            ))}
                        </div>
                    </div>
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
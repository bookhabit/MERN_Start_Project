import React, { useState } from 'react';
import { Button, Input } from '../elements';
import { InputChangeEvent } from '../elements/Input';

const ChattingPage = () => {
    const [value,setValue] = useState('');
    const [errMsg,setErrMsg] = useState('');

    const onChange = (event:InputChangeEvent)=>{
        setValue(event.target.value)
    }

    const sendHandler = ()=>{

    }

    return (
        <div className='flex h-screen'>
            <div className='bg-blue-50 w-1/3'>
                contacts
            </div>
            <div className='bg-blue-100 w-2/3 flex flex-col p-2'>
                <div className='flex-grow'>
                    messages with selected person
                </div>
                <div className='flex items-center gap-2 mb-5'>
                    <Input 
                        placeholder='메시지를 입력해주세요'    
                        sort="chatting"
                        type='text'
                        value={value}
                        name="chatting"
                        _onChange={onChange}
                        isValid={true}
                        errorMessage={errMsg}
                        validateMode={false}
                    />
                    <Button _onClick={sendHandler} sort="chatting" />
                </div>
            </div>
        </div>
    );
};

export default ChattingPage;
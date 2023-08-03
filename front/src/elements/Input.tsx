import React, { ChangeEvent } from "react";
import tw from "tailwind-styled-components";

interface ValidateProps{
  isValid:boolean
  validateMode:boolean
}

const AuthInput = tw.input<ValidateProps>`
  w-80 h-8 rounded-lg py-5 px-3 text-black
  ${(props)=>props.isValid && props.validateMode && "bg-error_fill border border-error_stroke"}
`;

const ResumeInput = tw.input`
  bg-white-50
`;

const PortfolioInput = tw.input`
  bg-black-50
`;

const ChattingInput = tw.input`
  focus:outline-none h-10 w-full p-2 flex-grow bg-white rounded-sm
`

export type InputValue = string | number
export type InputChangeEvent = ChangeEvent<HTMLInputElement>

interface IProps{
    label? :string;
    placeholder:string;
    value: InputValue;
    _onChange?: (ev: InputChangeEvent) => void
    name:string;
    type:string;
    sort:"auth"|"resume"|"portfolio"|"chatting";
    isValid:boolean;
    errorMessage:string;
    validateMode:boolean;
}


const Input = (props:IProps) => {
    const {label ,placeholder, _onChange,sort,type,value,name,isValid,errorMessage,validateMode } = props;
      return(
        <React.Fragment>
            {label}
            {sort==="auth"&&
            <AuthInput placeholder = {placeholder} onChange={_onChange} type={type} name={name} value={value} isValid={isValid} validateMode={validateMode} />}
            {sort==="resume"&&
            <ResumeInput placeholder = {placeholder} onChange={_onChange} type={type} name={name} value={value}/>}
            {sort==="portfolio"&&
            <PortfolioInput placeholder = {placeholder} onChange={_onChange} type={type} name={name} value={value}/>}
            {sort === "chatting" &&
              <ChattingInput placeholder = {placeholder} onChange={_onChange} type={type} name={name} value={value}
            />}
            {isValid && errorMessage && validateMode && (
              <p className="font text-sm text-error_stroke">{errorMessage}</p>
            )}
        </React.Fragment>
      )
}
 
export default Input;
import React from "react";
import tw from "tailwind-styled-components";

const AuthButton = tw.button`
  bg-primary p-2 w-full text-white rounded-2xl
`;

const SocialButton=tw.button`
  flex w-full h-8 bg-primary rounded-2xl text-white items-center justify-center
  gap-3 pl-2
`;

const ResumeButton = tw.button`
  bg-white-50
`;

const PortfolioButton = tw.button`
  bg-black-50
`;

const ChattingButton = tw.button`
  bg-blue-500 hover:text-white p-2 h-10 rounded-sm
`

interface IProps{
    text?:string
    _onClick?:React.MouseEventHandler<HTMLButtonElement>
    sort:"auth" | "social" | "resume" | "portfolio" | "chatting"
    icon?:string
    alt?:string
}


const Button = (props:IProps) => {
  const {text,_onClick,sort,icon,alt} = props;


  return (
    <React.Fragment>
        {sort==="auth" && <AuthButton onClick={_onClick}>{text}</AuthButton>}
        {sort==="social" && 
        <SocialButton onClick={_onClick} >
          <img src={icon} alt={alt} className="items-start"/>
          {text}
        </SocialButton>
        }
        {sort==="resume" && <ResumeButton onClick={_onClick} >{text}</ResumeButton>}
        {sort==="portfolio" && <PortfolioButton onClick={_onClick} >{text}</PortfolioButton>}
        {sort==="chatting" && 
          <ChattingButton onClick={_onClick}>
            {text}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </ChattingButton>
        }
    </React.Fragment>
  );
};


export default Button;
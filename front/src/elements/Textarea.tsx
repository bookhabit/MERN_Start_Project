import React from "react";
import tw from "tailwind-styled-components";

const ResumeTextarea = tw.textarea`
  bg-yellow
`;

const PortfolioTexarea = tw.textarea`
  bg-green
`;

interface IProps{
    label :string,
    placeholder:string,
    _onChange:React.ChangeEventHandler<HTMLTextAreaElement>,
    sort:string,
}

const Textarea = (props:IProps) => {
    const {label ,placeholder, _onChange,sort } = props;
 
  return(
    <React.Fragment>
    {label}
        {sort==="resumeTextarea"&&
        <ResumeTextarea placeholder = {placeholder} onChange={_onChange}/>}
        {sort==="portfolioTexarea"&&
        <PortfolioTexarea placeholder = {placeholder} onChange={_onChange}/>}
    </React.Fragment>
  )
};
 

export default Textarea;
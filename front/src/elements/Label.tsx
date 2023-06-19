import React from "react";
import tw from "tailwind-styled-components";

const ResumeLabel = tw.textarea`
  bg-yellow
`;

const PortfolioLabel = tw.textarea`
  bg-green
`;

interface IProps{
    icon :string,
    sort:string,
    label:string,
}

const Label = (props:IProps) => {
    const {icon,label,sort} = props;
 
  return(
    <React.Fragment>
        {icon}
        {sort==="resumeLabel" && <ResumeLabel value={label} />}
        {sort==="portfolioLabel" && <PortfolioLabel value={label} />}
    </React.Fragment>
  )
};
 

export default Label;
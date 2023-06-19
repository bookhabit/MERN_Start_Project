import {Link, Navigate} from "react-router-dom";
import {useContext, useEffect, useRef, useState} from "react";
import axios from "axios";
import { UserContext, UserContextType } from "../Context/UserContext";
import Input, { InputChangeEvent } from "../elements/Input";
import gsap from 'gsap'
import { ValidateContext, ValidateContextType } from "../Context/ValidateContext";
import { Button } from "../elements";

type ValidationLoginForm = {
  email:string,
  password:string
}


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const { setUser } = useContext<UserContextType>(UserContext);

  const formRef = useRef(null);
  const [errorMessage,setErrorMessage] = useState<ValidationLoginForm>({
    email:"",
    password:"",
  })
  const { validateMode,setValidateMode } = useContext<ValidateContextType>(ValidateContext);

  useEffect(() => {
    gsap.fromTo(formRef.current,{x: 1000}, {x: 0} )
}, [])

  const onChangeInput = (event:InputChangeEvent)=>{
    if(event.target.name==="email"){
      setEmail(event.target.value)
      setErrorMessage((prevState) => ({
        ...prevState,
        email: "",
      }));
    }else if(event.target.name==="password"){
      setPassword(event.target.value)
      setErrorMessage((prevState) => ({
        ...prevState,
        password: "",
      }));
    }
    setValidateMode(false)
  }
  
  const validateLoginForm = ()=>{
    // 이메일 형식을 검증하는 정규 표현식
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    // email vaildation
    if (!email) {
      setErrorMessage((prevState) => ({
        ...prevState,
        email: "이메일을 입력해주세요",
      }));
      return false
    }
    if(!emailRegex.test(email)){
      setErrorMessage((prevState) => ({
        ...prevState,
        email: "유효한 이메일 형식이 아닙니다",
      }))
      return false
    }

    // password vaildation
    if (!password) {
      setErrorMessage((prevState) => ({
        ...prevState,
        password: "비밀번호를 입력해주세요",
      }));
      return false
    }

    return true
  }

  const handleLogin = async (event:React.FormEvent)=>{
    event.preventDefault();
    // form요소 유효성 검사
    setValidateMode(true)

    if(validateLoginForm()){
      try{
        const {data}  = await axios.post('/login',{email,password})
        setUser(data)
        // 비밀번호 validation
        alert('login successful')
        setRedirect(true)
      }catch(err:any){
        if(err.response?.status===404){
          setValidateMode(true)
          setErrorMessage((prevState) => ({
            ...prevState,
            email: err.response.data
          }));
        }
        else if(err.response?.status===400){
          setValidateMode(true)
          setErrorMessage((prevState) => ({
            ...prevState,
            password: err.response.data
          }));
        }
      }
    }
  }

  if(redirect){
    return <Navigate to="/"/>
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div ref={formRef} className="mb-64">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-md mx-auto" onSubmit={handleLogin}>
        <Input 
                    type="email"
                    placeholder="your@email.com"
                    _onChange={onChangeInput}
                    sort="authInput"
                    value={email}
                    name="email"
                    isValid={ !!errorMessage.email}
                    errorMessage={errorMessage.email}
                    validateMode={validateMode}
                />
                <Input 
                    type="password"
                    placeholder="password"
                    _onChange={onChangeInput}
                    sort="authInput"
                    value={password}
                    name="password"
                    isValid={ !!errorMessage.password}
                    errorMessage={errorMessage.password}
                    validateMode={validateMode}
                />

              <Button
                  text="Login"
                  sort="auth"
              />
          <div className="text-center py-2 text-gray-500">
            Don't have an account yet? 
            <Link className="underline text-black ml-4" to={'/register'}>
                Register now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
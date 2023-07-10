import {Link, useNavigate} from "react-router-dom";
import {  useEffect, useRef, useState} from "react";
import axios from "axios";
import gsap from 'gsap'
import { Button, Input } from "../elements";
import { InputChangeEvent } from "../elements/Input";
import { useRecoilState } from "recoil";
import { validateModeAtom } from "../recoil/validateAtom";

type ValidationRegisterForm = {
  name:string,
  email:string,
  password:string
}

export default function ReigsterPage() {
  const [name,setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [redirect, setRedirect] = useState<boolean>(false);

  const formRef = useRef(null);
  const [errorMessage,setErrorMessage] = useState<ValidationRegisterForm>({
    name:"",
    email:"",
    password:"",
  })
  const [validateMode,setValidateMode] = useRecoilState(validateModeAtom)
  

  useEffect(() => {
    gsap.fromTo(formRef.current,{x: -1000}, {x: 0} )
  }, [])

  const router = useNavigate();

  const onChangeInput = (event:InputChangeEvent)=>{
    if(event.target.name==="name"){
      setName(event.target.value)
      setErrorMessage((prevState) => ({
        ...prevState,
        name: "",
      }));
    }else if(event.target.name==="email"){
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

  const validateSignUpForm = ()=>{
    // name validation
    // 숫자가 포함되지 않는지 확인하는 정규 표현식
    const nameRegex = /^[^0-9]*$/;
    // 이메일 형식을 검증하는 정규 표현식
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    // 비밀번호를 검증하는 정규 표현식
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()])[a-zA-Z\d!@#$%^&*()]{10,}$/;

    if (!name) {
      setErrorMessage((prevState) => ({
        ...prevState,
        name: "이름을 입력해주세요",
      }));
      return false
    }
    if(name.length>15){
      setErrorMessage((prevState) => ({
        ...prevState,
        name: "이름이 너무 깁니다",
      }))
      return false
    }
    if(!nameRegex.test(name)){
      console.log('숫자포함됌')
      setErrorMessage((prevState) => ({
        ...prevState,
        name: "이름에 숫자를 포함할 수 없습니다",
      }))
      return false
    }
    

    // email vaildation
    if (!email) {
      setErrorMessage((prevState) => ({
        ...prevState,
        email: "이메일을 입력해주세요",
      }));
      return false
    }
    if(email.length>25){
      setErrorMessage((prevState) => ({
        ...prevState,
        email: "이메일이 너무 깁니다",
      }))
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
    if(password.length<=10){
      setErrorMessage((prevState) => ({
        ...prevState,
        password: "비밀번호를 10자 이상 입력해주세요",
      }))
      return false
    }
    if(!passwordRegex.test(password)){
      setErrorMessage((prevState) => ({
        ...prevState,
        password: "비밀번호에 영문,특수기호,숫자를 포함해주세요",
      }))
      return false
    }
    
    return true;
}

  async function registerUser(event:React.FormEvent){ 
    event.preventDefault();
    // form요소 유효성 검사
    setValidateMode(true)
    if(validateSignUpForm()){
      try{
        const res = await axios.post('/register',{
          name:name,
          email:email,
          password:password
        })
        console.log('res',res)
        if(res.status===200){
          alert('register successful.')
          setRedirect(true)
        }
      }catch(err:any){
        if(err.response?.status===409){
          setValidateMode(true)
          setErrorMessage((prevState) => ({
            ...prevState,
            email: err.response.data
          }));
          }else{
            alert('회원가입에 실패하였습니다')
          }
      }
    }
  }

  if(redirect){
    router('/login')
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div ref={formRef} className="mb-64">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form className="max-w-md mx-auto" onSubmit={registerUser}>
                <Input
                    type="text"
                    placeholder="이름을 입력해주세요"
                    _onChange={onChangeInput}
                    sort="authInput"
                    value={name}
                    name="name"
                    isValid={ !!errorMessage.name}
                    errorMessage={errorMessage.name}
                    validateMode={validateMode}
                />
                <Input 
                    type="email"
                    placeholder="your@email.com"
                    _onChange={onChangeInput}
                    sort="authInput"
                    value={email}
                    name="email"
                    isValid={!!errorMessage.email}
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
                    isValid={!!errorMessage.password}
                    errorMessage={errorMessage.password}
                    validateMode={validateMode}
                />
                <Button
                  text="Register"
                  sort="auth"
                />
          <div className="text-center py-2 text-gray-500">
            if you have an account? 
            <Link className="underline text-black ml-4" to={'/login'}>
                Login now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
import {Link, Navigate, useNavigate} from "react-router-dom";
import { useEffect, useRef, useState} from "react";
import axios from "axios";
import Input, { InputChangeEvent } from "../elements/Input";
import gsap from 'gsap'
import { Button } from "../elements";
import { useRecoilState, useSetRecoilState } from "recoil";
import { validateModeAtom } from "../recoil/validateAtom";
import { userAtom } from "../recoil/userAtom";
import { UserType } from "../Types/userType";
import googleSvg from "../assets/auth/google.svg"
import githubSvg from "../assets/auth/github.svg"

type ValidationLoginForm = {
  email:string,
  password:string
}

const GITHUB_CLIENT_ID = "1251dd62543c1d6e0fc6";
const GOOGLE_CLIENT_ID = "454233507421-t57fvs9nsthq9577tkp2eh938cruhvib.apps.googleusercontent.com";


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const setUser = useSetRecoilState(userAtom)

  const formRef = useRef(null);
  const [errorMessage,setErrorMessage] = useState<ValidationLoginForm>({
    email:"",
    password:"",
  })
  const [validateMode,setValidateMode] = useRecoilState(validateModeAtom)

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
        if(data){
          axios.get('/profile')
          .then(({data}:{data:UserType}) => {
            setUser(data);
          });
        }
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

    // 소셜 로그인
    const router = useNavigate();
    // 깃허브 로그인
    async function gitHubLoginAPI(code:string) {
      console.log('깃허브 로그인 시작')
      try {
        const response = await axios.get(`/github/login?code=${code}`);
        console.log(response);
        if (response.status === 200) {
          setUser(response.data as UserType);
          router("/");
        }
      } catch (error) {
        // 오류 처리
        console.log(error);
      }
    }

    async function googleLoginAPI(code:string) {
      try {
        const response = await axios.get(`/google/login?code=${code}`);
        console.log(response);
        if (response.status === 200) {
          setUser(response.data as UserType);
          router("/");
        }
      } catch (error) {
        // 오류 처리
        console.log(error);
      }
    }

    useEffect(() => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const codeParam = urlParams.get("code");
      
      if (codeParam && window.location.pathname === "/login/github") {
        gitHubLoginAPI(codeParam);
      }

        // 구글 로그인
      if (codeParam && window.location.pathname === "/login/google") {
        googleLoginAPI(codeParam);
      }

    }, []);
    
    
    
    async function loginWithGithub(event: React.FormEvent) {
      event.preventDefault();

      const scope = "user user:email";
      window.location.assign(
        `https://github.com/login/oauth/authorize?scope=${scope}&client_id=${GITHUB_CLIENT_ID}`
      );
    }
    
    async function loginWithGoogle(event: React.FormEvent) {
      event.preventDefault();

      const redirectUri = "http://localhost:5173/login/google"
      const scope = "profile email";
      window.location.assign(
        `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`
      );
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
              <div className="flex flex-col gap-5">
                <Button
                    text="Login"
                    sort="auth"
                />
                <Button
                  text="Login with Github"
                  _onClick={loginWithGithub}
                  sort="social"
                  icon={githubSvg}
                  alt="깃허브 로고"
                />
                <Button
                      text="Login with Google"
                      _onClick={loginWithGoogle}
                      sort="social"
                      icon={googleSvg}
                      alt="구글로고"
                />
              </div>
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
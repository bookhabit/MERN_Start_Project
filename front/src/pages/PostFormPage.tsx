import {  useEffect, useState } from "react";
import PhotosUploader from "../components/testRestAPI/PhotosUploader";
import { Navigate, useParams } from "react-router";
import axios from "axios";
// import PhotosUploader from "./PhotosUploader";

export default function PostFormPage() {
    const {id:postId} = useParams();
    const [title,setTitle] = useState('');
    const [description,setDescription] = useState('');
    const [addedLinkPhotos,setAddedLinkPhotos] = useState<string[]>([]);
    const [redirect,setRedirect] = useState(false);

    useEffect(() => {
      if (!postId) {
        return;
      }
      axios.get('/post/'+postId).then(response => {
         const {data} = response;
         setTitle(data.title);
         setAddedLinkPhotos(data.photos);
         setDescription(data.description);
      });
    }, [postId]);

    function inputHeader(text:string):JSX.Element {
        return (
          <h2 className="text-2xl mt-4">{text}</h2>
        );
      }
      function inputDescription(text:string):JSX.Element {
        return (
          <p className="text-gray-500 text-sm">{text}</p>
        );
      }
      function preInput(header:string,description:string) {
        return (
          <>
            {inputHeader(header)}
            {inputDescription(description)}
          </>
        );
      }

    // 숙소 등록 및 수정
    async function savePlace(ev:React.FormEvent) {
        ev.preventDefault();
        const post = {
            title, addedLinkPhotos,description, 
        };
        console.log(post);
        if (postId) {
            // update
            await axios.put('/post/update', {
                postId, ...post
            });
            setRedirect(true);
        } else {
            // new post
            await axios.post('/post/create', post);
            setRedirect(true);
        }

    }

    if (redirect) {
        return <Navigate to={'/'} />
    }

    return(
        <form onSubmit={savePlace}>
            {preInput('제목', '')}
            <input 
                type="text" 
                value={title} 
                onChange={ev => setTitle(ev.target.value)} placeholder="제목 입력"/>
            {preInput('설명', '어떤 글인지 설명해주세요')}
            <textarea 
                value={description} 
                onChange={ev => setDescription(ev.target.value)} />
            {preInput('이미지', '이미지를 첨부해주세요')}
            <PhotosUploader
                addedPhotos={addedLinkPhotos} 
                onChange={setAddedLinkPhotos} />
            <button className="primary my-4">등록</button>
        </form>
    )
}
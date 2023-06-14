import {  useState } from "react";
import PhotosUploader from "./PhotosUploader";
// import PhotosUploader from "./PhotosUploader";

export default function PostForm() {
    const [title,setTitle] = useState('');
    const [description,setDescription] = useState('');
    const [addedLinkPhotos,setAddedLinkPhotos] = useState<string[]>([]);
    console.log(addedLinkPhotos)

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
    return(
        <form>
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
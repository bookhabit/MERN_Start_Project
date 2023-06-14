export default function Image({src,...rest}:{src:string,className?:string}) {
    src = src && src.includes('https://')
      ? src
      : 'http://localhost:4000/uploads/'+src;
    return (
      <img {...rest} src={src} alt={'이미지'} />
    );
  }
  
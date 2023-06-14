export default function Image({src,...rest}:{src:string}) {
    src = src && src.includes('https://')
      ? src
      : 'http://localhost:4000/uploads/'+src;
    return (
      <img className="rounded-2xl w-full object-cover" {...rest} src={src} alt={'이미지'} />
    );
  }
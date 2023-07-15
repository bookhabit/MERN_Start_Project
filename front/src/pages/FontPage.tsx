const FontPage = () => {
    return (
        <div className="flex flex-col justify-center items-center px-40">
            <div className="h-sreen flex flex-col gap-5">
                <h2>폰트 지정</h2>
                <div className="p-5 font-Noto_Sans_KR">
                    <h3>Noto Sans KR</h3>
                    <p>한글 : 안녕하세요 저는 이현진입니다</p>
                    <p>영어 : My name is hyun jin lee</p>
                </div>
                <div className="p-5 font-Lora">
                    <h3>Lora</h3>
                    <p>한글 : 안녕하세요 저는 이현진입니다</p>
                    <p>영어 : My name is hyun jin lee</p>
                </div>
                <div className="p-5 font-Nanum_Gothic">
                    <h3>Jua</h3>
                    <p>한글 : 안녕하세요 저는 이현진입니다</p>
                    <p>영어 : My name is hyun jin lee</p>
                </div>
                <div className="p-5 font-Jua">
                    <h3>Nanum Gothic default font-bold</h3>
                    <p>한글 : 안녕하세요 저는 이현진입니다</p>
                    <p>영어 : My name is hyun jin lee</p>
                </div>
            </div>
        </div>
    );
};

export default FontPage;
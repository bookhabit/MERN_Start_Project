import { useSpring, animated } from '@react-spring/web';
import { useState } from 'react';

const Toggle = () => {
    const [isToggled,setToggle] = useState(false)
    const fade = useSpring({
        // opacity:isToggled?1:0,
        // fontSize:isToggled?"2rem":"5rem",
        color:isToggled?"tomato":"green",
        transform:isToggled?"translate3d(0,0,0)":"translate3d(0,-50px,0)",
    })
    return (
        <div className='flex flex-col items-center justify-center gap-5 min-h-screen'>
            <animated.h1 style={fade} className={'text-2xl font-bold'}>Hello</animated.h1>
            <button className='bg-black text-white p-5' onClick={()=>setToggle(!isToggled)}>Toggle</button>
        </div>
    );
};

export default Toggle;
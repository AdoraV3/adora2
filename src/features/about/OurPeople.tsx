import Image from "next/image";
import ceo from '../../../public/uche.jpg'
import advisor from '../../../public/Kyra.jpg'
import developer from '../../../public/Jaypee.jpg'
import designer from '../../../public/Prince.jpg'

export default function OurPeople(){
    return (
       <div className="p-16 flex flex-col items-center gap-8">
            <div className="text-4xl text-center">
                Meet Our <span className="text-[var(--accent)]">People</span>
            </div>
            <div className="flex w-full flex-wrap justify-between max-md:gap-8 max-md:justify-center">
            <div>
                <Image className="w-44 rounded-tl-full rounded-tr-full 
                rounded-br-full" 
                alt="CEO" src={ceo}/>
                <div className="font-semibold mt-1">Uche Igbonacho</div>
                <small className="text-gray-500">Founder & CEO</small>
            </div>
            <div>
                <Image className="w-44 rounded-tl-full rounded-tr-full 
                rounded-br-full" 
                alt="CEO" src={advisor}/>
                <div className="font-semibold mt-1">Kyra Arthur</div>
                <small className="text-gray-500">Customer Operation Advisor</small>
            </div>
             <div>
                <Image className="w-44 rounded-tl-full rounded-tr-full 
                rounded-br-full" 
                alt="CEO" src={developer}/>
                <div className="font-semibold mt-1">Jaypee</div>
                <small className="text-gray-500">Lead Frontend Developer</small>
            </div>
             <div>
                <Image className="w-44 rounded-tl-full rounded-tr-full 
                rounded-br-full" 
                alt="CEO" src={designer}/>
                <div className="font-semibold mt-1">Prince Jehoshaphat</div>
                <small className="text-gray-500">Lead Product Designer</small>
            </div>
        </div>
       </div>
    )
};
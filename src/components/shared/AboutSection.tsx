"use client";

import Link from "next/link";

import {
  LuBot,
  LuCalendarCheck,
  LuHeartPulse,
  LuShieldCheck,
  LuStethoscope,
  LuTarget,
  LuEye,
  LuBrain,
  LuClock,
  LuUsers,
  LuActivity,
} from "react-icons/lu";


const services = [

{
title:"AI Health Assistant",
description:
"Analyze symptoms, provide healthcare guidance and help patients prepare before consultation.",
icon:LuBot,
},


{
title:"Verified Specialists",
description:
"Connect with experienced doctors from different medical specialties.",
icon:LuStethoscope,
},


{
title:"Smart Appointment",
description:
"Book, manage and track appointments easily with digital healthcare solutions.",
icon:LuCalendarCheck,
},


{
title:"Secure Health Records",
description:
"Keep medical information organized with privacy-focused healthcare technology.",
icon:LuShieldCheck,
},


];



const benefits=[

{
title:"AI Powered Healthcare",
text:"Advanced technology helps patients understand symptoms and healthcare options.",
icon:LuBrain
},


{
title:"Faster Healthcare Access",
text:"Find doctors and healthcare services without unnecessary delays.",
icon:LuClock
},


{
title:"Patient Centered Platform",
text:"Designed to make healthcare simple, accessible and convenient.",
icon:LuUsers
},


{
title:"Better Health Decisions",
text:"Support patients with reliable information before medical consultation.",
icon:LuActivity
},


];




const AboutSection=()=>{


return (

<section
className="
py-16

bg-gradient-to-br

from-[#FFF8FC]

via-[#FBEFEF]

to-[#F3EAF7]

dark:from-[#120C18]

dark:via-[#211827]

dark:to-[#0F0915]
"
>


<div className="
mx-auto
max-w-7xl
px-5
">



{/* Hero */}

<div className="
mx-auto
max-w-3xl
text-center
">


<div
className="
inline-flex
items-center
gap-2
rounded-full
border
border-[#F5CBCB]
bg-white/70
px-5
py-2
text-xs
font-black
tracking-widest
text-[#745D83]

dark:bg-[#211B27]
dark:text-[#F5CBCB]
"
>

<LuHeartPulse/>

ABOUT SEBASATHI AI

</div>



<h1
className="
mt-5
text-4xl
font-black
sm:text-5xl
dark:text-white
"
>

Transforming Healthcare

<span
className="
block
bg-gradient-to-r
from-[#745D83]
to-[#B18AC4]
bg-clip-text
text-transparent
"
>

Through Artificial Intelligence

</span>


</h1>



<p
className="
mt-5
leading-7
font-semibold
text-slate-600
dark:text-[#D8CADB]
"
>

SebaSathi AI is an intelligent healthcare platform that connects
patients, doctors and AI technology to create a faster,
smarter and more accessible healthcare experience.

</p>


</div>







{/* Mission Vision */}

<div
className="
mt-12
grid
gap-6
md:grid-cols-2
"
>


<div
className="
rounded-3xl
bg-white/80
p-8
dark:bg-[#2A2233]
"
>

<LuTarget
size={35}
className="text-[#745D83]"
/>


<h2
className="
mt-4
text-2xl
font-black
dark:text-white
"
>

Our Mission

</h2>


<p
className="
mt-3
font-semibold
leading-7
text-slate-600
dark:text-[#D8CADB]
"
>

To simplify healthcare access by combining artificial intelligence,
medical expertise and digital healthcare solutions.

</p>


</div>





<div
className="
rounded-3xl
bg-white/80
p-8
dark:bg-[#2A2233]
"
>


<LuEye
size={35}
className="text-[#745D83]"
/>


<h2
className="
mt-4
text-2xl
font-black
dark:text-white
"
>

Our Vision

</h2>


<p
className="
mt-3
font-semibold
leading-7
text-slate-600
dark:text-[#D8CADB]
"
>

Creating a future where every person can access intelligent
and trusted healthcare support anytime.

</p>


</div>



</div>







{/* Services */}

<h2
className="
mt-16
text-center
text-3xl
font-black
dark:text-white
"
>

What SebaSathi AI Provides

</h2>



<div
className="
mt-8
grid
gap-6
sm:grid-cols-2
lg:grid-cols-4
"
>


{
services.map((item)=>{


const Icon=item.icon;


return(

<div
key={item.title}
className="
rounded-3xl
bg-white/80
p-6
dark:bg-[#2A2233]
"
>


<div
className="
flex
size-12
items-center
justify-center
rounded-2xl
bg-[#745D83]
text-white
"
>

<Icon/>

</div>


<h3
className="
mt-4
font-black
dark:text-white
"
>

{item.title}

</h3>


<p
className="
mt-2
text-sm
font-semibold
text-slate-600
dark:text-[#D8CADB]
"
>

{item.description}

</p>


</div>

)

})

}


</div>








{/* Benefits */}

<h2
className="
mt-16
text-center
text-3xl
font-black
dark:text-white
"
>

Why Choose SebaSathi AI?

</h2>


<div
className="
mt-8
grid
gap-6
md:grid-cols-2
lg:grid-cols-4
"
>


{
benefits.map((item)=>{


const Icon=item.icon;


return(

<div
key={item.title}
className="
rounded-3xl
border
border-[#F5CBCB]
bg-white/70
p-6
dark:bg-[#2A2233]
"
>

<Icon
size={30}
className="text-[#745D83]"
/>


<h3
className="
mt-4
font-black
dark:text-white
"
>

{item.title}

</h3>


<p
className="
mt-2
text-sm
font-semibold
text-slate-600
dark:text-[#D8CADB]
"
>

{item.text}

</p>


</div>

)

})

}


</div>






{/* CTA */}


<div
className="
mt-16
rounded-3xl
bg-[#745D83]
p-10
text-center
"
>


<h2
className="
text-3xl
font-black
text-white
"
>

Experience Smarter Healthcare Today

</h2>


<p
className="
mt-3
text-white/80
font-semibold
"
>

Get AI powered healthcare assistance and connect with trusted doctors.

</p>



<Link
href="/ai-health-assistant"
className="
mt-6
inline-block
rounded-xl
bg-white
px-6
py-3
font-black
text-[#745D83]
"
>

Start Healthcare Journey

</Link>


</div>




</div>


</section>

);


};


export default AboutSection;
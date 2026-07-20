"use client";

import Link from "next/link";

import {
  LuBot,
  LuBrain,
  LuHeartPulse,
  LuShieldCheck,
  LuSparkles,
} from "react-icons/lu";


const features=[

{
title:"Smart Symptom Analysis",
text:"Understand your symptoms with AI powered healthcare guidance.",
icon:LuBrain,
},

{
title:"Personal Health Support",
text:"Get instant assistance before consulting a doctor.",
icon:LuHeartPulse,
},

{
title:"Secure Healthcare",
text:"Your healthcare information remains protected.",
icon:LuShieldCheck,
},


];


const AIHealthAssistantSection=()=>{


return(

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


<div
className="
mx-auto

max-w-7xl

px-5
"
>


<div
className="
grid

gap-10

lg:grid-cols-2

items-center
"
>



<div>


<div
className="
inline-flex

items-center

gap-2

rounded-full

bg-white/70

border

border-[#F5CBCB]

px-5

py-2

text-xs

font-black

text-[#745D83]

dark:bg-[#211B27]

dark:text-[#F5CBCB]
"
>

<LuSparkles/>

AI HEALTH ASSISTANT

</div>



<h2
className="
mt-5

text-4xl

font-black

dark:text-white
"
>

Your Personal

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

AI Healthcare Companion

</span>

</h2>



<p
className="
mt-4

leading-7

font-semibold

text-slate-600

dark:text-[#D8CADB]
"
>

Get intelligent health guidance, symptom analysis and
doctor recommendations anytime with SebaSathi AI.

</p>



<div
className="
mt-8

space-y-4
"
>


{
features.map((item)=>{


const Icon=item.icon;


return(

<div
key={item.title}

className="
flex

gap-4

rounded-2xl

bg-white/80

p-4

dark:bg-[#2A2233]
"
>


<div
className="
flex

size-12

items-center

justify-center

rounded-xl

bg-[#745D83]

text-white
"
>

<Icon/>

</div>


<div>

<h3
className="
font-black

dark:text-white
"
>

{item.title}

</h3>


<p
className="
text-sm

font-semibold

text-slate-600

dark:text-[#D8CADB]
"
>

{item.text}

</p>


</div>


</div>


)

})

}


</div>




<Link

href="/ai-health-assistant"

className="
mt-8

inline-block

rounded-xl

bg-[#745D83]

px-6

py-3

font-black

text-white
"
>

Try AI Assistant

</Link>



</div>







<div
className="
flex

justify-center
"
>


<div
className="
relative

flex

size-72

items-center

justify-center

rounded-full

bg-[#745D83]

shadow-2xl

sm:size-96
"
>


<LuBot
size={150}
className="
text-white
"
/>


</div>



</div>




</div>


</div>


</section>

);


};


export default AIHealthAssistantSection;
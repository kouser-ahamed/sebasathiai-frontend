"use client";


import {useState} from "react";


const faq=[

{
q:"What is SebaSathi AI?",
a:"SebaSathi AI is an AI powered healthcare platform connecting patients with doctors and smart healthcare assistance."
},


{
q:"How does AI Health Assistant work?",
a:"The AI assistant analyzes symptoms and provides healthcare guidance before doctor consultation."
},


{
q:"Can I book appointments with doctors?",
a:"Yes, patients can find doctors and manage appointments easily."
},


{
q:"Is my health information secure?",
a:"Yes, SebaSathi AI focuses on protecting user healthcare information."
},

];



const FAQSection=()=>{


const [active,setActive]=useState<number|null>(null);



return(

<section
className="
py-16

bg-gradient-to-br

from-[#FFF8FC]

to-[#F3EAF7]

dark:from-[#120C18]

dark:to-[#211827]
"
>


<div
className="
mx-auto

max-w-4xl

px-5
"
>


<h2
className="
text-center

text-4xl

font-black

dark:text-white
"
>

Frequently Asked Questions

</h2>



<div
className="
mt-10

space-y-4
"
>


{
faq.map((item,index)=>(


<div

key={index}

className="
rounded-2xl

bg-white/80

p-5

dark:bg-[#2A2233]
"

>


<button

onClick={()=>setActive(
active===index?null:index
)}

className="
flex

w-full

justify-between

text-left

font-black

dark:text-white
"

>

{item.q}

<span>
+
</span>

</button>



{
active===index &&

<p
className="
mt-3

font-semibold

text-slate-600

dark:text-[#D8CADB]
"
>

{item.a}

</p>

}



</div>


))

}


</div>


</div>


</section>


);


};


export default FAQSection;
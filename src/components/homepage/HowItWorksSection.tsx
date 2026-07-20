"use client";


const steps=[

{
number:"01",
title:"Create Account",
text:"Register and create your healthcare profile."
},

{
number:"02",
title:"Describe Symptoms",
text:"Share your health concerns with AI assistant."
},

{
number:"03",
title:"Find Doctor",
text:"Get suitable doctor recommendations."
},

{
number:"04",
title:"Book Appointment",
text:"Consult doctors and manage healthcare easily."
},

];



const HowItWorksSection=()=>{


return(

<section
className="
py-16

bg-white

dark:bg-[#120C18]
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
text-center
"
>

<h2
className="
text-4xl

font-black

dark:text-white
"
>

How SebaSathi AI Works

</h2>


<p
className="
mt-3

font-semibold

text-slate-600

dark:text-[#D8CADB]
"
>

Simple steps to access smarter healthcare.

</p>

</div>




<div
className="
mt-12

grid

gap-6

md:grid-cols-4
"
>


{
steps.map((step)=>(


<div

key={step.number}

className="
rounded-3xl

bg-[#FBEFEF]

p-6

dark:bg-[#2A2233]
"
>


<div
className="
text-4xl

font-black

text-[#745D83]
"
>

{step.number}

</div>



<h3
className="
mt-4

font-black

dark:text-white
"
>

{step.title}

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

{step.text}

</p>


</div>


))

}


</div>


</div>


</section>

);


};


export default HowItWorksSection;
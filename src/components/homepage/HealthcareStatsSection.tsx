"use client";


const stats=[

{
value:"10K+",
title:"Patients Served"
},

{
value:"500+",
title:"Verified Doctors"
},

{
value:"20+",
title:"Medical Specialists"
},

{
value:"24/7",
title:"AI Support"
},

];



const HealthcareStatsSection=()=>{


return(

<section
className="
py-16

bg-[#745D83]
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

gap-6

sm:grid-cols-2

lg:grid-cols-4
"
>


{
stats.map((item)=>(


<div
key={item.title}

className="
rounded-3xl

bg-white/10

p-8

text-center

text-white

backdrop-blur
"
>


<h2
className="
text-4xl

font-black
"
>

{item.value}

</h2>


<p
className="
mt-2

font-bold

text-white/80
"
>

{item.title}

</p>


</div>


))

}


</div>


</div>


</section>


);


};


export default HealthcareStatsSection;
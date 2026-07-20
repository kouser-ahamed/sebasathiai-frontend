"use client";


import {useState} from "react";


import {
  LuMail,
  LuPhone,
  LuMapPin,
  LuClock,
  LuMessageCircle,
  LuFacebook,
  LuLinkedin,
  LuGithub,
  LuSend,
  LuHeartPulse,
} from "react-icons/lu";




const contactInfo=[

{
title:"Email Support",
text:"support@sebasathiai.com",
icon:LuMail,
},


{
title:"Phone Support",
text:"+880 1234 567890",
icon:LuPhone,
},


{
title:"Healthcare Center",
text:"Dhaka, Bangladesh",
icon:LuMapPin,
},


{
title:"Working Hours",
text:"24/7 Healthcare Assistance",
icon:LuClock,
},


];




const ContactSection=()=>{


const [submitted,setSubmitted]=useState(false);



const handleSubmit=(e:React.FormEvent)=>{

e.preventDefault();

setSubmitted(true);

};





return(


<section

className="
min-h-screen

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



{/* Hero */}


<div
className="
mx-auto

max-w-3xl

text-center
"
>


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

CONTACT SEBASATHI AI


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

Need Healthcare Support?

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

We Are Here To Help

</span>


</h1>




<p

className="
mt-4

font-semibold

leading-7

text-slate-600

dark:text-[#D8CADB]
"

>


Have questions about appointments, doctors or AI healthcare
services? Contact our support team anytime.

</p>



</div>







<div

className="
mt-12

grid

gap-8

lg:grid-cols-2
"

>







{/* Contact Information */}



<div

className="
space-y-5
"

>


{
contactInfo.map((item)=>{


const Icon=item.icon;


return(

<div

key={item.title}

className="
rounded-3xl

bg-white/80

p-6

shadow-sm

dark:bg-[#2A2233]
"

>


<div

className="
flex

items-center

gap-4
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

<Icon size={25}/>

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
mt-1

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



</div>


)

})

}



{/* Emergency */}

<div

className="
rounded-3xl

bg-[#745D83]

p-6

text-white
"

>


<div

className="
flex

items-center

gap-3
"

>


<LuMessageCircle size={28}/>


<h3
className="
font-black

text-xl
"
>

Healthcare Assistance

</h3>


</div>



<p

className="
mt-3

font-semibold

text-white/80
"

>

For urgent healthcare guidance, use our AI Health Assistant
or schedule an appointment with a specialist.

</p>



</div>




</div>










{/* Contact Form */}



<form

onSubmit={handleSubmit}

className="
rounded-3xl

bg-white/80

p-8

shadow-sm

dark:bg-[#2A2233]
"

>


<h2

className="
text-2xl

font-black

dark:text-white
"

>

Send Us A Message

</h2>



<div

className="
mt-6

space-y-4
"

>


<input

required

placeholder="Your Name"

className="
w-full

rounded-xl

border

border-[#F5CBCB]

p-3

outline-none

focus:border-[#745D83]

dark:bg-[#211827]

dark:text-white
"

/>




<input

required

type="email"

placeholder="Email Address"

className="
w-full

rounded-xl

border

border-[#F5CBCB]

p-3

outline-none

focus:border-[#745D83]

dark:bg-[#211827]

dark:text-white
"

/>




<input

placeholder="Subject"

className="
w-full

rounded-xl

border

border-[#F5CBCB]

p-3

outline-none

focus:border-[#745D83]

dark:bg-[#211827]

dark:text-white
"

/>




<textarea

required

rows={6}

placeholder="Write your message..."

className="
w-full

rounded-xl

border

border-[#F5CBCB]

p-3

outline-none

focus:border-[#745D83]

dark:bg-[#211827]

dark:text-white
"

/>



<button

className="
flex

w-full

items-center

justify-center

gap-2

rounded-xl

bg-[#745D83]

py-3

font-black

text-white

transition

hover:bg-[#614E70]
"

>


<LuSend/>

Send Message


</button>



{
submitted &&

<p

className="
text-center

font-bold

text-green-600
"

>

Thank you! Your message has been sent successfully.

</p>

}



</div>



</form>






</div>









{/* Social Section */}



<div

className="
mt-14

text-center
"

>


<h2

className="
text-2xl

font-black

dark:text-white
"

>

Connect With SebaSathi AI

</h2>



<div

className="
mt-5

flex

justify-center

gap-4
"

>


<a

href="https://www.facebook.com/kouserahamed420"

target="_blank"

rel="noopener noreferrer"

className="
flex

size-12

items-center

justify-center

rounded-xl

bg-[#745D83]

text-white

transition

hover:-translate-y-1

hover:bg-[#614E70]
"

>

<LuFacebook size={22}/>

</a>




<a

href="https://www.linkedin.com/in/kouser-ahamed"

target="_blank"

rel="noopener noreferrer"

className="
flex

size-12

items-center

justify-center

rounded-xl

bg-[#745D83]

text-white

transition

hover:-translate-y-1

hover:bg-[#614E70]
"

>

<LuLinkedin size={22}/>

</a>




<a

href="https://github.com/kouser-ahamed"

target="_blank"

rel="noopener noreferrer"

className="
flex

size-12

items-center

justify-center

rounded-xl

bg-[#745D83]

text-white

transition

hover:-translate-y-1

hover:bg-[#614E70]
"

>

<LuGithub size={22}/>

</a>



</div>


</div>







</div>


</section>


);


};



export default ContactSection;
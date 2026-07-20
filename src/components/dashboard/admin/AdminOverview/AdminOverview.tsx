"use client";


import { useEffect, useState } from "react";


import {
  LuUsers,
  LuUserCheck,
  LuUserMinus,
  LuStethoscope,
  LuCalendarDays,
  LuCircleCheck,
} from "react-icons/lu";


import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,

  PieChart,
  Pie,
  Cell,

} from "recharts";


import { getTokenClient } from "@/lib/getTokenClient";





interface OverviewData {

  totalPatients:number;

  activePatients:number;

  blockedPatients:number;


  totalDoctors:number;

  activeDoctors:number;

  blockedDoctors:number;


  totalAppointments:number;


  completedConsultations:number;


  appointmentStatus:{
    pending:number;
    approved:number;
    completed:number;
    rejected:number;
  };

}







const AdminOverview =()=>{


const [overview,setOverview]
=
useState<OverviewData | null>(null);



const [loading,setLoading]
=
useState(true);






useEffect(()=>{


const loadDashboard = async()=>{


try{


const tokenResult =
await getTokenClient();



if(!tokenResult.data?.token){

throw new Error(
"Token not found"
);

}





const response =
await fetch(

`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/dashboard/stats`,

{

method:"GET",

headers:{

Authorization:
`Bearer ${tokenResult.data.token}`,

},

cache:"no-store",

}

);




const result =
await response.json();




console.log(
"ADMIN RESPONSE:",
result
);





if(result.success){

setOverview(
result.data.overview
);

}



}

catch(error){

console.error(
"Dashboard Error:",
error
);

}

finally{

setLoading(false);

}



};



loadDashboard();



},[]);










if(loading){


return(

<div

className="
grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-4
gap-5
"

>


{
Array.from({
length:8
})
.map((_,index)=>(


<div

key={index}

className="
h-32
rounded-3xl
bg-slate-200
animate-pulse
dark:bg-[#2A2233]
"

/>


))

}


</div>


);

}







if(!overview){


return(

<div

className="
rounded-3xl
bg-white
p-10
text-center
font-bold

dark:bg-[#2A2233]
dark:text-white

"

>

No Dashboard Data Found

</div>


);

}









const cards=[


{
title:"Total Patients",
value:overview.totalPatients,
icon:LuUsers,
},


{
title:"Active Patients",
value:overview.activePatients,
icon:LuUserCheck,
},


{
title:"Blocked Patients",
value:overview.blockedPatients,
icon:LuUserMinus,
},


{
title:"Total Doctors",
value:overview.totalDoctors,
icon:LuStethoscope,
},


{
title:"Active Doctors",
value:overview.activeDoctors,
icon:LuUserCheck,
},


{
title:"Blocked Doctors",
value:overview.blockedDoctors,
icon:LuUserMinus,
},


{
title:"Total Appointment",
value:overview.totalAppointments,
icon:LuCalendarDays,
},


{
title:"Completed Consultation",
value:overview.completedConsultations,
icon:LuCircleCheck,
},


];









const userChart=[


{

name:"Patients",

Active:
overview.activePatients,

Blocked:
overview.blockedPatients,

},



{

name:"Doctors",

Active:
overview.activeDoctors,

Blocked:
overview.blockedDoctors,

},



];







const appointmentChart=[


{
name:"Approved",

value:
overview.appointmentStatus.approved,

},


{
name:"Pending",

value:
overview.appointmentStatus.pending,

},


{
name:"Completed",

value:
overview.appointmentStatus.completed,

},


{
name:"Rejected",

value:
overview.appointmentStatus.rejected,

},


];





const colors=[

"#745D83",

"#F59E0B",

"#22C55E",

"#EF4444",

];
return(

<div

className="
space-y-8
"

>





{/* Overview Cards */}



<div

className="
grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-4
gap-5
"

>


{
cards.map((card)=>(


<div

key={card.title}

className="

rounded-3xl

bg-white/80

p-6

backdrop-blur

transition-all

hover:-translate-y-1

hover:shadow-lg


dark:bg-[#2A2233]/80

"

>


<div

className="
flex
items-center
justify-between
"

>


<div>


<p

className="
text-sm
font-bold
text-slate-500

dark:text-[#D8CADB]

"

>

{card.title}

</p>



<h2

className="
mt-3
text-3xl
font-black

text-[#745D83]

dark:text-[#F5CBCB]

"

>

{card.value}

</h2>


</div>





<div

className="
flex
size-12
items-center
justify-center

rounded-2xl

bg-[#FBEFEF]

text-[#745D83]

dark:bg-[#352B3D]

dark:text-[#F5CBCB]

"

>


<card.icon size={24}/>


</div>


</div>


</div>


))


}



</div>









{/* User Statistics Chart */}



<div

className="

rounded-3xl

bg-white/80

p-6

backdrop-blur


dark:bg-[#2A2233]/80

"

>


<h2

className="
mb-6
text-xl
font-black

text-slate-900

dark:text-white

"

>

Users Overview

</h2>




<div className="h-[350px]">


<ResponsiveContainer

width="100%"

height="100%"

>


<BarChart

data={userChart}

barGap={10}

margin={{

top:20,

right:20,

left:0,

bottom:10

}}

>


<CartesianGrid

strokeDasharray="3 3"

opacity={0.2}

/>



<XAxis

dataKey="name"

tick={{

fill:"#745D83",

fontSize:12,

fontWeight:700

}}

/>



<YAxis

tick={{

fill:"#745D83"

}}

/>



<Tooltip

contentStyle={{

borderRadius:"16px",

border:"none",

background:"#ffffff",

boxShadow:
"0 10px 30px rgba(116,93,131,0.15)"

}}

labelStyle={{

color:"#745D83",

fontWeight:800

}}

/>



<Legend />




<Bar

dataKey="Active"

fill="#745D83"

radius={[12,12,0,0]}

/>



<Bar

dataKey="Blocked"

fill="#D96C75"

radius={[12,12,0,0]}

/>



</BarChart>


</ResponsiveContainer>


</div>



</div>









{/* Appointment Status Chart */}




<div

className="

rounded-3xl

bg-white/80

p-6

backdrop-blur


dark:bg-[#2A2233]/80

"

>



<h2

className="
mb-6
text-xl
font-black

text-slate-900

dark:text-white

"

>

Appointment Status

</h2>





<div className="h-[350px]">


<ResponsiveContainer

width="100%"

height="100%"

>


<PieChart>


<Pie

data={appointmentChart}

dataKey="value"

nameKey="name"

cx="50%"

cy="50%"

innerRadius={70}

outerRadius={130}

paddingAngle={8}

label

>


{

appointmentChart.map(

(_,index)=>(


<Cell

key={index}

fill={colors[index]}

/>


)

)

}



</Pie>




<Tooltip

contentStyle={{

borderRadius:"16px",

border:"none",

background:"#ffffff",

boxShadow:
"0 10px 30px rgba(116,93,131,0.15)"

}}

/>



<Legend />



</PieChart>


</ResponsiveContainer>


</div>




</div>








</div>


);


};




export default AdminOverview;
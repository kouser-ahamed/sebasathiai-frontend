"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import {
  LuBot,
  LuCalendarCheck,
  LuChevronRight,
  LuHeartPulse,
  LuLockKeyhole,
  LuShieldCheck,
  LuStethoscope,
} from "react-icons/lu";


const FEATURES = [
  {
    title: "AI Health Assistant",
    description:
      "Describe your symptoms, receive intelligent health guidance, and get suggestions about suitable medical specialists anytime.",
    points: [
      "Symptom analysis",
      "Specialist suggestion",
      "Health guidance anytime",
    ],
    icon: LuBot,
  },

  {
    title: "Find Trusted Doctors",
    description:
      "Search verified doctors, explore profiles, check ratings, and choose the right healthcare professional for your needs.",
    points: [
      "Search doctors easily",
      "View doctor profiles",
      "Check ratings & reviews",
    ],
    icon: LuStethoscope,
  },

  {
    title: "Easy Appointment Booking",
    description:
      "Book appointments online, manage schedules, and keep track of your complete appointment history.",
    points: [
      "Online appointment",
      "Manage schedules",
      "Appointment history",
    ],
    icon: LuCalendarCheck,
  },

  {
    title: "Secure Health Records",
    description:
      "Keep your healthcare information organized with secure AI history and appointment records.",
    points: [
      "AI health history",
      "Appointment records",
      "Patient data protection",
    ],
    icon: LuShieldCheck,
  },
];


const FeaturesSection = () => {

  return (

    <section
      className="
      relative
      overflow-hidden

      py-14
      sm:py-16
      lg:py-20

      bg-gradient-to-br
      from-[#FFF8FC]
      via-[#FBEFEF]
      to-[#F3EAF7]

      dark:from-[#120C18]
      dark:via-[#211827]
      dark:to-[#0F0915]

      transition-colors
      duration-700
      "
    >


      {/* Background Glow */}

      <div
        className="
        absolute
        -left-24
        top-20

        size-72

        rounded-full

        bg-[#C5B3D3]/40

        blur-3xl
        animate-pulse
        "
      />


      <div
        className="
        absolute
        -right-20
        bottom-10

        size-80

        rounded-full

        bg-[#E8CFEA]/40

        blur-3xl

        animate-pulse
        "
      />



      <div
        className="
        relative
        mx-auto
        max-w-7xl
        px-5
        "
      >



        {/* Heading */}


        <motion.div

          initial={{
            opacity:0,
            y:30
          }}

          whileInView={{
            opacity:1,
            y:0
          }}

          viewport={{
            once:true
          }}

          transition={{
            duration:.6
          }}

          className="
          mx-auto
          mb-10
          sm:mb-12
          max-w-3xl
          text-center
          "
        >


          <div
            className="
            mx-auto

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

            uppercase

            tracking-widest

            text-[#745D83]

            shadow-sm

            backdrop-blur-xl


            dark:border-[#41354A]

            dark:bg-[#211B27]/70

            dark:text-[#F5CBCB]
            "
          >

            <LuHeartPulse className="size-4"/>

            Why Choose SebaSathi AI

          </div>




          <h2
            className="
            mt-4

            text-3xl

            font-black

            leading-tight

            text-slate-950

            sm:text-4xl

            lg:text-5xl

            dark:text-white
            "
          >

            Smart Healthcare

            <span
              className="
              block

              bg-gradient-to-r

              from-[#745D83]

              via-[#8D6AA0]

              to-[#B18AC4]

              bg-clip-text

              text-transparent

              dark:from-[#F5CBCB]

              dark:via-[#D9C5E3]

              dark:to-[#C5B3D3]
              "
            >

              Made Simple For Everyone

            </span>

          </h2>




          <p
            className="
            mt-4

            text-base

            font-semibold

            leading-7

            text-slate-700

            dark:text-[#D8CADB]
            "
          >

            SebaSathi AI combines artificial intelligence,
            trusted doctors, and secure healthcare management
            into one complete digital healthcare platform.

          </p>


        </motion.div>







        {/* Feature Cards */}


        <div
          className="
          grid

          gap-6

          sm:grid-cols-2

          lg:grid-cols-4
          "
        >


          {
            FEATURES.map((feature,index)=>{


              const Icon = feature.icon;


              return (

                <motion.article

                  key={feature.title}


                  initial={{
                    opacity:0,
                    y:40
                  }}


                  whileInView={{
                    opacity:1,
                    y:0
                  }}


                  viewport={{
                    once:true
                  }}


                  transition={{
                    duration:.5,
                    delay:index*.12
                  }}



                  className="
                  group

                  rounded-3xl

                  border

                  border-[#F5CBCB]

                  bg-white/80

                  backdrop-blur-xl

                  p-6

                  shadow-sm

                  transition-all

                  duration-300

                  hover:-translate-y-2

                  hover:shadow-xl


                  dark:border-[#41354A]

                  dark:bg-[#2A2233]/90
                  "
                >




                  <div

                    className="
                    flex

                    size-14

                    items-center

                    justify-center

                    rounded-2xl

                    bg-gradient-to-br

                    from-[#FBEFEF]

                    to-[#EBD9F2]

                    text-[#745D83]


                    transition-all

                    duration-300


                    group-hover:bg-gradient-to-br

                    group-hover:from-[#745D83]

                    group-hover:to-[#8D6AA0]

                    group-hover:text-white


                    dark:from-[#352B3D]

                    dark:to-[#41354A]

                    dark:text-[#F5CBCB]

                    dark:group-hover:from-[#C5B3D3]

                    dark:group-hover:to-[#D9C5E3]

                    dark:group-hover:text-[#211B27]
                    "
                  >

                    <Icon className="size-7"/>

                  </div>





                  <h3
                    className="
                    mt-5

                    text-xl

                    font-black

                    text-slate-950

                    dark:text-white
                    "
                  >

                    {feature.title}

                  </h3>





                  <p
                    className="
                    mt-3

                    text-sm

                    font-semibold

                    leading-6

                    text-slate-700

                    dark:text-[#D8CADB]
                    "
                  >

                    {feature.description}

                  </p>





                  <ul
                    className="
                    mt-5

                    space-y-2
                    "
                  >

                    {
                      feature.points.map(point=>(


                        <li
                          key={point}

                          className="
                          flex

                          items-center

                          gap-2

                          text-sm

                          font-bold

                          text-slate-700

                          dark:text-[#E7DDE8]
                          "
                        >


                          <LuLockKeyhole

                            className="
                            size-4

                            text-[#745D83]

                            dark:text-[#F5CBCB]

                            transition-colors

                            duration-300

                            group-hover:text-[#8D6AA0]

                            dark:group-hover:text-[#D9C5E3]
                            "

                          />


                          {point}


                        </li>


                      ))
                    }


                  </ul>




                </motion.article>


              );


            })
          }



        </div>






        {/* AI CTA */}



        <motion.div

          initial={{
            opacity:0,
            y:30
          }}

          whileInView={{
            opacity:1,
            y:0
          }}

          viewport={{
            once:true
          }}


          className="
          mt-10

          flex

          flex-col

          items-center

          justify-between

          gap-5

          rounded-3xl


          bg-gradient-to-r

          from-[#745D83]

          via-[#8D6AA0]

          to-[#B18AC4]


          p-6

          text-center


          sm:flex-row

          sm:text-left
          "
        >




          <div>

            <h3
              className="
              text-2xl

              font-black

              text-white
              "
            >

              Need instant health guidance?

            </h3>



            <p
              className="
              mt-2

              text-sm

              font-semibold

              text-[#FBEFEF]
              "
            >

              Talk with SebaSathi AI Assistant and get
              personalized healthcare suggestions.

            </p>


          </div>





          <Link

            href="/ai-health-assistant"


            className="
            group

            flex

            h-12

            items-center

            gap-2

            rounded-xl

            bg-white/90

            px-6

            text-sm

            font-black

            text-[#745D83]

            shadow-lg

            backdrop-blur-md

            transition-all

            duration-300

            hover:-translate-y-1

            hover:bg-gradient-to-r

            hover:from-[#F5CBCB]

            hover:to-[#EBD9F2]

            hover:text-[#5D4A6D]

            hover:shadow-2xl

            dark:bg-[#211B27]/80

            dark:text-[#F5CBCB]

            dark:border

            dark:border-[#41354A]

            dark:hover:from-[#41354A]

            dark:hover:to-[#5D4A6D]

            dark:hover:text-white

            dark:hover:border-[#C5B3D3]
            "
          >


            Try AI Assistant


            <LuChevronRight

              className="
              transition-transform

              duration-300

              group-hover:translate-x-1
              "

            />


          </Link>



        </motion.div>




      </div>


    </section>


  );

};


export default FeaturesSection;
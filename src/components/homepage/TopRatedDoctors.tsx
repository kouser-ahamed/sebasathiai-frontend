"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LuAward, LuSparkles, LuShieldCheck } from "react-icons/lu";

import { Doctor } from "../AllDoctors/types";
import DoctorCard from "../AllDoctors/DoctorCard";

const TopRatedDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopDoctors = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/doctors/top-rated`,
          {
            cache: "no-store",
          },
        );

        const data = await response.json();

        if (data.success) {
          setDoctors(data.doctors);
        }
      } catch (error) {
        console.error("Top doctors loading error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopDoctors();
  }, []);

  if (loading || doctors.length === 0) {
    return null;
  }

  return (
    <section
      id="next-section"
      className="
      relative
      overflow-hidden

      py-12

      bg-gradient-to-br
      from-[#FFF8FC]
      via-[#FBEFEF]
      to-[#F3EAF7]

      dark:from-[#120C18]
      dark:via-[#211827]
      dark:to-[#0F0915]
      "
    >
      {/* Floating Background */}

      <div
        className="
        absolute
        -left-20
        top-10

        size-72

        rounded-full

        bg-[#C5B3D3]/30

        blur-3xl

        animate-pulse
        "
      />

      <div
        className="
        absolute
        -right-20
        bottom-5

        size-80

        rounded-full

        bg-[#F5CBCB]/40

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
        {/* Header */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
          }}
          className="
          mb-8

          flex

          flex-col

          items-center

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


            uppercase


            tracking-widest


            text-[#745D83]


            backdrop-blur-xl


            dark:bg-[#211B27]/70


            dark:text-[#F5CBCB]
            "
          >
            <LuAward className="size-4" />
            Top Rated Healthcare Experts
          </div>

          <h2
            className="
            mt-3


            text-3xl


            font-black


            leading-tight


            text-slate-950


            sm:text-4xl


            lg:text-5xl


            dark:text-white
            "
          >
            Meet Our Most Trusted
            <span
              className="
              block


              bg-gradient-to-r


              from-[#745D83]


              to-[#A77DBB]


              bg-clip-text


              text-transparent


              dark:from-[#F5CBCB]


              dark:to-[#D9C5E3]
              "
            >
              Medical Specialists
            </span>
          </h2>

          <p
            className="
            mt-3


            max-w-2xl


            text-base


            font-semibold


            leading-7


            text-slate-600


            dark:text-[#CDBFD0]
            "
          >
            Connect with highly rated doctors trusted by patients. Get
            professional healthcare support from experienced specialists through
            SebaSathi AI.
          </p>

          <div
            className="
            mt-3


            flex

            flex-wrap

            justify-center

            gap-4
            "
          >
            <span
              className="
              flex

              items-center

              gap-2


              rounded-xl


              bg-white/70


              px-4

              py-2


              text-xs


              font-bold


              text-[#745D83]


              shadow-sm


              dark:bg-[#211B27]


              dark:text-[#F5CBCB]
              "
            >
              <LuSparkles />
              Patient Choice
            </span>

            <span
              className="
              flex

              items-center

              gap-2


              rounded-xl


              bg-white/70


              px-4

              py-2


              text-xs


              font-bold


              text-[#745D83]


              shadow-sm


              dark:bg-[#211B27]


              dark:text-[#F5CBCB]
              "
            >
              <LuShieldCheck />
              Verified Doctors
            </span>
          </div>
        </motion.div>

        {/* Doctor Cards */}

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.7,
          }}
          className="
          grid


          gap-6


          sm:grid-cols-2


          lg:grid-cols-4

          "
        >
          {doctors.map((doctor, index) => (
            <motion.div
              key={doctor.id}
              initial={{
                opacity: 0,
                y: 40,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: index * 0.12,
              }}
            >
              <DoctorCard doctor={doctor} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TopRatedDoctors;

"use client";

import { useState } from "react";

import { Autoplay, Keyboard, Pagination } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

import type { Swiper as SwiperType } from "swiper";

import {
  FiArrowLeft,
  FiArrowRight,
  FiMapPin,
  FiMessageCircle,
  FiStar,
} from "react-icons/fi";

import { LuUsersRound } from "react-icons/lu";

import "swiper/css";
import "swiper/css/pagination";

interface Testimonial {
  id: number;

  name: string;

  role: string;

  location: string;

  message: string;

  initials: string;

  gradient: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Ayesha Rahman",
    role: "Patient",
    location: "Dhaka, Bangladesh",
    message:
      "SebaSathi AI helped me understand my symptoms and suggested the right specialist before visiting a doctor. The AI Health Assistant was very helpful.",
    initials: "AR",
    gradient: "from-purple-600 to-pink-400",
  },

  {
    id: 2,
    name: "Tanvir Hasan",
    role: "Patient",
    location: "Chattogram, Bangladesh",
    message:
      "Finding trusted doctors became much easier. I could view doctor profiles, ratings, and choose the right healthcare professional.",
    initials: "TH",
    gradient: "from-blue-600 to-cyan-400",
  },

  {
    id: 3,
    name: "Nusrat Jahan",
    role: "Patient",
    location: "Rajshahi, Bangladesh",
    message:
      "The platform provides a simple healthcare experience. The AI suggestions helped me understand which specialist I needed.",
    initials: "NJ",
    gradient: "from-emerald-600 to-green-400",
  },

  {
    id: 4,
    name: "Mahmud Karim",
    role: "Patient",
    location: "Sylhet, Bangladesh",
    message:
      "Appointment booking and health record management became much easier with SebaSathi AI.",
    initials: "MK",
    gradient: "from-orange-600 to-amber-400",
  },

  {
    id: 5,
    name: "Sadia Islam",
    role: "Patient",
    location: "Khulna, Bangladesh",
    message:
      "I liked how easily I could search doctors and check their information before making an appointment.",
    initials: "SI",
    gradient: "from-rose-600 to-pink-400",
  },

  {
    id: 6,
    name: "Farhan Ahmed",
    role: "Patient",
    location: "Dhaka, Bangladesh",
    message:
      "The AI Health Assistant provides quick guidance and helps prepare better questions before consulting doctors.",
    initials: "FA",
    gradient: "from-violet-600 to-purple-400",
  },

  {
    id: 7,
    name: "Rafia Sultana",
    role: "Patient",
    location: "Cumilla, Bangladesh",
    message:
      "SebaSathi AI made healthcare access easier with smart suggestions and trusted doctor information.",
    initials: "RS",
    gradient: "from-teal-600 to-emerald-400",
  },

  {
    id: 8,
    name: "Imran Hossain",
    role: "Patient",
    location: "Gazipur, Bangladesh",
    message:
      "The doctor search feature is very useful. I can quickly find specialists based on my needs.",
    initials: "IH",
    gradient: "from-indigo-600 to-blue-400",
  },

  {
    id: 9,
    name: "Jannatul Ferdous",
    role: "Patient",
    location: "Barishal, Bangladesh",
    message:
      "The complete healthcare journey feels simple from finding doctors to managing appointments.",
    initials: "JF",
    gradient: "from-lime-600 to-green-400",
  },

  {
    id: 10,
    name: "Rakib Hasan",
    role: "Patient",
    location: "Narayanganj, Bangladesh",
    message:
      "A modern healthcare platform that connects patients with doctors through smart technology.",
    initials: "RH",
    gradient: "from-cyan-600 to-teal-400",
  },

  {
    id: 11,
    name: "Samira Chowdhury",
    role: "Patient",
    location: "Dhaka, Bangladesh",
    message:
      "I appreciate the secure health history feature. It keeps my healthcare information organized.",
    initials: "SC",
    gradient: "from-fuchsia-600 to-pink-400",
  },

  {
    id: 12,
    name: "Mehedi Hasan",
    role: "Patient",
    location: "Rangpur, Bangladesh",
    message:
      "SebaSathi AI saves time by helping patients quickly find suitable doctors.",
    initials: "MH",
    gradient: "from-sky-600 to-blue-400",
  },

  {
    id: 13,
    name: "Anika Sultana",
    role: "Patient",
    location: "Mymensingh, Bangladesh",
    message: "The interface is clean, simple, and very patient friendly.",
    initials: "AS",
    gradient: "from-red-600 to-orange-400",
  },

  {
    id: 14,
    name: "Hasan Mahmud",
    role: "Patient",
    location: "Bogura, Bangladesh",
    message:
      "AI powered healthcare guidance makes understanding symptoms much easier.",
    initials: "HM",
    gradient: "from-green-600 to-emerald-400",
  },

  {
    id: 15,
    name: "Nabila Akter",
    role: "Patient",
    location: "Jessore, Bangladesh",
    message:
      "SebaSathi AI provides complete healthcare support with trusted doctors and smart assistance.",
    initials: "NA",
    gradient: "from-purple-600 to-indigo-400",
  },
];

const PatientReviewsSection = () => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  return (
    <section
      className="
relative
overflow-hidden

py-16
sm:py-20

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
absolute
-left-20
top-20

size-72

rounded-full

bg-[#C5B3D3]/30

blur-3xl
"
      />

      <div
        className="
absolute
-right-20
bottom-10

size-80

rounded-full

bg-[#F5CBCB]/30

blur-3xl
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

uppercase

tracking-widest

text-[#745D83]

dark:bg-[#211B27]

dark:text-[#F5CBCB]
"
          >
            <LuUsersRound />
            Patient Experiences
          </div>

          <h2
            className="
mt-5

text-3xl

font-black

text-slate-950

sm:text-4xl

lg:text-5xl

dark:text-white
"
          >
            Trusted By Patients
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
              Across Bangladesh
            </span>
          </h2>

          <p
            className="
mt-4

text-base

font-semibold

leading-7

text-slate-600

dark:text-[#CDBFD0]
"
          >
            Real experiences from patients who received smarter healthcare
            support through SebaSathi AI.
          </p>
        </div>

        <div
          className="
mt-10
flex
justify-between
"
        >
          <button
            onClick={() => swiper?.slidePrev()}
            className="
size-11
rounded-full

bg-white

shadow

text-[#745D83]

hover:bg-[#745D83]

hover:text-white
"
          >
            <FiArrowLeft />
          </button>

          <button
            onClick={() => swiper?.slideNext()}
            className="
size-11
rounded-full

bg-[#745D83]

text-white

shadow
"
          >
            <FiArrowRight />
          </button>
        </div>

        <Swiper
          modules={[Autoplay, Keyboard, Pagination]}
          onSwiper={setSwiper}
          loop
          autoplay={{
            delay: 3500,
          }}
          keyboard
          pagination={{
            clickable: true,
          }}
          spaceBetween={20}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },

            1024: {
              slidesPerView: 4,
            },
          }}
          className="
mt-8
pb-14
items-stretch
"
        >
          {TESTIMONIALS.map((item) => (
            <SwiperSlide
              key={item.id}
              className="
h-auto
"
            >
              <article
                className="
h-full

min-h-[340px]

flex

flex-col

rounded-3xl

border

border-[#F5CBCB]

bg-white/80

p-6

shadow-sm

backdrop-blur

dark:border-[#41354A]

dark:bg-[#2A2233]/90
"
              >
                <FiMessageCircle
                  className="
text-3xl

text-[#745D83]

dark:text-[#F5CBCB]
"
                />

                <p
                  className="
mt-5

flex-1

text-sm

font-semibold

leading-7

text-slate-700

dark:text-[#E7DDE8]
"
                >
                  "{item.message}"
                </p>

                <div
                  className="
mt-5

flex

gap-3

border-t

border-[#F5CBCB]

pt-4

dark:border-[#41354A]
"
                >
                  <div
                    className={`
flex

size-12

items-center

justify-center

rounded-2xl

bg-gradient-to-br

${item.gradient}

font-black

text-white
`}
                  >
                    {item.initials}
                  </div>

                  <div>
                    <h3
                      className="
font-black

text-slate-950

dark:text-white
"
                    >
                      {item.name}
                    </h3>

                    <p
                      className="
text-xs

font-bold

text-[#745D83]

dark:text-[#F5CBCB]
"
                    >
                      {item.role}
                    </p>

                    <p
                      className="
flex

items-center

gap-1

text-xs

text-slate-500
"
                    >
                      <FiMapPin />

                      {item.location}
                    </p>
                  </div>
                </div>

                <div
                  className="
mt-4

flex

gap-1

text-yellow-500
"
                >
                  {[1, 2, 3, 4, 5].map((i) => (
                    <FiStar
                      key={i}
                      className="
fill-yellow-400
"
                    />
                  ))}
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default PatientReviewsSection;

"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import {
  FiArrowLeft,
  FiArrowRight,
  FiChevronRight,
  FiHeart,
  FiShield,
  FiUsers,
} from "react-icons/fi";

import { LuBot, LuCalendarCheck, LuStethoscope } from "react-icons/lu";

interface HeroSlide {
  id: number;
  image: string;
  badge: string;
  title: string;
  highlight: string;
  description: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    image: "/assets/SebaSathiAI/heroimg1.png",
    badge: "Free Digital Healthcare Platform",
    title: "Smart Healthcare With",
    highlight: "SebaSathi AI",
    description:
      "Connect with trusted doctors, manage appointments, and receive AI-powered health guidance from one secure healthcare platform.",
  },

  {
    id: 2,
    image: "/assets/SebaSathiAI/heroimg2.png",
    badge: "Find Doctors Easily",
    title: "Healthcare Support",
    highlight: "For Everyone",
    description:
      "Search doctors by specialization, check profiles, book appointments, and get medical support anytime from anywhere.",
  },

  {
    id: 3,
    image: "/assets/SebaSathiAI/heroimg3.png",
    badge: "AI Health Assistant",
    title: "Your Health Companion",
    highlight: "Available Anytime",
    description:
      "Describe your symptoms, get intelligent health suggestions, identify suitable specialists, and save your health history securely.",
  },
];

const AUTO_SLIDE_TIME = 5000;

const HeroSection = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setActiveSlide((current) => (current + 1) % HERO_SLIDES.length);
  }, []);

  const previousSlide = () => {
    setActiveSlide((current) =>
      current === 0 ? HERO_SLIDES.length - 1 : current - 1,
    );
  };

  useEffect(() => {
    const timer = window.setInterval(nextSlide, AUTO_SLIDE_TIME);

    return () => {
      window.clearInterval(timer);
    };
  }, [nextSlide]);

  const current = HERO_SLIDES[activeSlide];

  return (
    <section
      className="
relative
h-[65vh]
min-h-[580px]
overflow-hidden

bg-gradient-to-br
from-[#FFF7FB]
via-[#FBEFEF]
to-[#F3EAF7]

transition-colors
duration-700

dark:from-[#120C18]
dark:via-[#211827]
dark:to-[#0F0915]

"
    >
      {/* Background Slider */}

      <div className="absolute inset-0">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`
absolute
inset-0

transition-all
duration-1000
ease-in-out


${activeSlide === index ? "opacity-100 scale-100" : "opacity-0 scale-105"}

`}
          >
            <Image
              src={slide.image}
              alt="SebaSathi AI Healthcare"
              fill
              priority={index === 0}
              sizes="100vw"
              className="
object-cover
object-center

brightness-[0.9]
contrast-[1.15]
saturate-[1.15]


dark:brightness-[0.85]
dark:contrast-[1.15]
dark:saturate-[1.1]


transition-transform
duration-[5000ms]

"
            />
          </div>
        ))}

        {/* Main Overlay */}

        <div
          className="
absolute
inset-0


bg-gradient-to-r

from-[#FFF7FB]/85

via-[#FFF7FB]/55

to-transparent



dark:from-[#120C18]/85

dark:via-[#120C18]/55

dark:to-transparent

"
        />
      </div>

      {/* Content */}

      <div
        className="
relative
z-10

mx-auto

flex

h-full

max-w-7xl

items-center

px-5

sm:px-8

"
      >
        <div className="max-w-2xl">
          {/* Badge */}

          <div
            key={activeSlide}
            className="
inline-flex

items-center

gap-2

rounded-full

border

border-[#F5CBCB]


bg-white/90

px-4

py-2


text-xs

font-black

uppercase

tracking-wider


text-[#745D83]


shadow-sm


dark:bg-[#211B27]

dark:text-[#F5CBCB]

animate-[fadeInUp_.5s]

"
          >
            <span
              className="
flex

size-7

items-center

justify-center


rounded-full


bg-[#FBEFEF]


text-[#745D83]

"
            >
              <FiHeart />
            </span>

            {current.badge}
          </div>

          {/* Heading */}

          <h1
            key={`title-${activeSlide}`}
            className="
mt-6

text-4xl

font-black

leading-tight

tracking-tight


text-slate-950


dark:text-white


sm:text-5xl

lg:text-6xl


animate-[fadeInUp_.6s]

"
          >
            {current.title}

            <br />

            <span
              className="
text-[#745D83]

dark:text-[#F5CBCB]

"
            >
              {current.highlight}
            </span>
          </h1>

          {/* Description */}

          <p
            key={`desc-${activeSlide}`}
            className="
mt-5

max-w-xl

text-base

font-semibold

leading-7


text-slate-700


dark:text-[#E7DDE8]


sm:text-lg


animate-[fadeInUp_.7s]

"
          >
            {current.description}
          </p>

          {/* CTA */}

          <div
            className="
mt-8

flex

flex-col

gap-3


sm:flex-row

"
          >
            <Link
              href="/find-doctors"
              className="
group

inline-flex

h-12

items-center

justify-center

gap-2


rounded-xl


bg-[#745D83]


px-7


text-sm

font-black


text-white


shadow-lg


transition


hover:-translate-y-1


hover:from-[#614E70]

hover:to-[#745D83]

"
            >
              <LuStethoscope />
              Find Doctors
              <FiChevronRight
                className="
transition

group-hover:translate-x-1

"
              />
            </Link>

            <Link
              href="/ai-health-assistant"
              className="
inline-flex

h-12

items-center

justify-center

gap-2


rounded-xl


bg-[#745D83]


px-7


text-sm

font-black


text-white


backdrop-blur-md


shadow-lg

transition

hover:-translate-y-1

hover:bg-[#614E70]

"
            >
              <LuBot />
              AI Health Assistant
            </Link>
          </div>

          {/* Features */}

          <div
            className="
mt-8

flex

flex-wrap

gap-5


text-sm

"
          >
            <div
              className="
flex

items-center

gap-2

font-bold

text-slate-800

dark:text-white

"
            >
              <FiShield />
              Secure Healthcare
            </div>

            <div
              className="
flex

items-center

gap-2

font-bold

text-slate-800

dark:text-white

"
            >
              <LuCalendarCheck />
              Easy Appointment
            </div>

            <div
              className="
flex

items-center

gap-2

font-bold

text-slate-800

dark:text-white

"
            >
              <FiUsers />
              Patient Friendly
            </div>
          </div>
        </div>
      </div>

      {/* Slider Buttons */}

      <div
        className="
absolute

bottom-8

right-8

hidden

gap-3

lg:flex

"
      >
        <button
          onClick={previousSlide}
          className="
flex

size-11

items-center

justify-center


rounded-full


bg-[#745D83]

text-white


shadow


transition

hover:bg-[#614E70]

"
        >
          <FiArrowLeft />
        </button>

        <button
          onClick={nextSlide}
          className="
flex

size-11

items-center

justify-center


rounded-full


bg-[#745D83]


text-white


shadow

transition

hover:bg-[#614E70]

"
        >
          <FiArrowRight />
        </button>
      </div>

      <div
        className="
absolute

bottom-8

left-1/2


flex

-translate-x-1/2


gap-2

"
      >
        {HERO_SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => setActiveSlide(index)}
            className={`

h-2.5

rounded-full

transition-all


${activeSlide === index ? "w-10 bg-[#745D83]" : "w-3 bg-[#745D83]/30 dark:bg-[#C5B3D3]/40"}

`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}

      <a
        href="#next-section"
        className="
absolute

bottom-8

left-1/2


z-20


hidden


-translate-x-1/2


flex-col


items-center


gap-2


text-xs


font-bold


uppercase


tracking-widest



text-[#745D83]


md:flex


dark:text-[#F5CBCB]

"
      >
        <span>Explore</span>

        <span
          className="
flex

h-9

w-6


justify-center


rounded-full


border


border-[#745D83]

bg-white/85


dark:border-[#F5CBCB]

dark:bg-[#211B27]/85

"
        >
          <span
            className="
mt-2

h-2

w-1


animate-bounce


rounded-full


bg-[#745D83]


dark:bg-[#F5CBCB]

"
          />
        </span>
      </a>
    </section>
  );
};

export default HeroSection;

"use client";

import Image from "next/image";
import Link from "next/link";

import {
  LuArrowUp,
  LuFacebook,
  LuGithub,
  LuHeartPulse,
  LuLinkedin,
  LuMail,
  LuMapPin,
  LuPhone,
} from "react-icons/lu";

const Footer = () => {
  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer
      className="
      relative
      isolate
      w-full
      max-w-full

      overflow-hidden

      border-t
      border-[#F5CBCB]

      bg-gradient-to-br

      from-[#FFF8FC]

      via-[#FBEFEF]

      to-[#F3EAF7]


      dark:border-[#41354A]

      dark:from-[#120C18]

      dark:via-[#211827]

      dark:to-[#0F0915]
      "
    >
      {/* Background Blur */}
      <div
        className="
        pointer-events-none

        absolute

        -left-[80px]

        top-10

        size-72

        rounded-full

        bg-[#C5B3D3]/30

        blur-3xl
        "
      />

      <div
        className="
        pointer-events-none

        absolute

        -right-[80px]

        bottom-0

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

        w-full

        max-w-7xl

        px-4

        py-10

        sm:px-5

        sm:py-14

        md:px-6

        lg:px-8
        "
      >
        <div
          className="
          grid

          gap-8

          xs:gap-6

          sm:grid-cols-2

          lg:grid-cols-4
          "
        >
          {/* BRAND */}
          <div className="text-center sm:text-left">
            <Link
              href="/"
              className="
              flex

              items-center

              justify-center

              sm:justify-start

              gap-3
              "
            >
              <Image
                src="/assets/final1.png"
                alt="SebaSathi AI Logo"
                width={50}
                height={50}
                className="
                h-[45px]

                w-[45px]

                sm:h-[50px]

                sm:w-[50px]

                rounded-full

                object-cover
                "
              />

              <h2
                className="
                text-xl

                sm:text-2xl

                font-black
                "
              >
                <span
                  className="
                  text-slate-800

                  dark:text-white
                  "
                >
                  Seba
                </span>

                <span
                  className="
                  text-[#745D83]

                  dark:text-[#F5CBCB]
                  "
                >
                  Sathi AI
                </span>
              </h2>
            </Link>

            <p
              className="
              mt-4

              text-sm

              font-semibold

              leading-6

              sm:leading-7

              text-slate-600

              dark:text-[#D8CADB]

              max-w-xs

              mx-auto

              sm:mx-0
              "
            >
              AI powered healthcare platform connecting patients
              with trusted doctors and smart healthcare solutions.
            </p>

            <div
              className="
              mt-4

              flex

              items-center

              justify-center

              sm:justify-start

              gap-2

              font-bold

              text-[#745D83]

              text-sm

              sm:text-base
              "
            >
              <LuHeartPulse className="size-4 sm:size-5" />
              Smart Healthcare With AI
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="text-center sm:text-left">
            <h3
              className="
              text-lg

              font-black

              dark:text-white

              text-center

              sm:text-left
              "
            >
              Quick Links
            </h3>

            <ul
              className="
              mt-4

              space-y-2.5

              sm:space-y-3
              "
            >
              {[
                {
                  name: "Home",
                  href: "/",
                },
                {
                  name: "About Us",
                  href: "/about",
                },
                {
                  name: "Contact",
                  href: "/contact",
                },
                {
                  name: "Find Doctors",
                  href: "/find-doctors",
                },
                {
                  name: "AI Health Assistant",
                  href: "/ai-health-assistant",
                },
                {
                  name: "Dashboard",
                  href: "/dashboard",
                },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="
                    text-sm

                    font-bold

                    text-slate-600

                    transition

                    hover:text-[#745D83]

                    dark:text-[#D8CADB]

                    dark:hover:text-[#F5CBCB]

                    inline-block

                    hover:translate-x-0.5

                    sm:hover:translate-x-1
                    "
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div className="text-center sm:text-left">
            <h3
              className="
              text-lg

              font-black

              dark:text-white

              text-center

              sm:text-left
              "
            >
              Contact Us
            </h3>

            <div
              className="
              mt-4

              space-y-3.5

              sm:space-y-4
              "
            >
              <p
                className="
                flex

                items-center

                justify-center

                sm:justify-start

                gap-3

                text-sm

                font-bold

                text-slate-600

                dark:text-[#D8CADB]

                break-all

                sm:break-normal
                "
              >
                <LuMail className="text-[#745D83] flex-shrink-0 size-4 sm:size-5" />
                <span className="text-xs sm:text-sm">support@sebasathiai.com</span>
              </p>

              <p
                className="
                flex

                items-center

                justify-center

                sm:justify-start

                gap-3

                text-sm

                font-bold

                text-slate-600

                dark:text-[#D8CADB]
                "
              >
                <LuPhone className="text-[#745D83] flex-shrink-0 size-4 sm:size-5" />
                <span className="text-xs sm:text-sm">+880 1234 567890</span>
              </p>

              <p
                className="
                flex

                items-center

                justify-center

                sm:justify-start

                gap-3

                text-sm

                font-bold

                text-slate-600

                dark:text-[#D8CADB]
                "
              >
                <LuMapPin className="text-[#745D83] flex-shrink-0 size-4 sm:size-5" />
                <span className="text-xs sm:text-sm">Dhaka, Bangladesh</span>
              </p>
            </div>
          </div>

          {/* SOCIAL */}
          <div className="text-center sm:text-left">
            <h3
              className="
              text-lg

              font-black

              dark:text-white

              text-center

              sm:text-left
              "
            >
              Follow Us
            </h3>

            <p
              className="
              mt-3

              text-sm

              font-semibold

              text-slate-600

              dark:text-[#D8CADB]

              text-center

              sm:text-left
              "
            >
              Connect with SebaSathi AI
            </p>

            <div
              className="
              mt-4

              flex

              items-center

              justify-center

              sm:justify-start

              gap-3

              flex-wrap
              "
            >
              <Link
                href="https://www.facebook.com/kouserahamed420"
                target="_blank"
                rel="noopener noreferrer"
                className="
                rounded-xl

                bg-[#745D83]

                p-2.5

                sm:p-3

                text-white

                transition-all

                duration-300

                hover:scale-110

                hover:bg-[#614E70]

                hover:shadow-lg
                "
                aria-label="Facebook"
              >
                <LuFacebook className="size-4 sm:size-5" />
              </Link>

              <Link
                href="https://www.linkedin.com/in/kouser-ahamed"
                target="_blank"
                rel="noopener noreferrer"
                className="
                rounded-xl

                bg-[#745D83]

                p-2.5

                sm:p-3

                text-white

                transition-all

                duration-300

                hover:scale-110

                hover:bg-[#614E70]

                hover:shadow-lg
                "
                aria-label="LinkedIn"
              >
                <LuLinkedin className="size-4 sm:size-5" />
              </Link>

              <Link
                href="https://github.com/kouser-ahamed"
                target="_blank"
                rel="noopener noreferrer"
                className="
                rounded-xl

                bg-[#745D83]

                p-2.5

                sm:p-3

                text-white

                transition-all

                duration-300

                hover:scale-110

                hover:bg-[#614E70]

                hover:shadow-lg
                "
                aria-label="GitHub"
              >
                <LuGithub className="size-4 sm:size-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div
          className="
          mt-10

          sm:mt-12

          flex

          flex-col

          items-center

          justify-between

          gap-4

          border-t

          border-[#F5CBCB]

          pt-5

          sm:pt-6

          sm:flex-row

          dark:border-[#41354A]
          "
        >
          <p
            className="
            text-xs

            sm:text-sm

            font-bold

            text-slate-600

            dark:text-[#D8CADB]

            text-center

            sm:text-left
            "
          >
            © {new Date().getFullYear()} SebaSathi AI. All rights reserved.
          </p>

          <button
            onClick={scrollTop}
            aria-label="Back to top"
            className="
            flex

            size-10

            sm:size-12

            items-center

            justify-center

            rounded-full

            bg-[#745D83]

            text-white

            shadow-lg

            transition-all

            duration-300

            hover:-translate-y-1

            hover:bg-[#614E70]

            hover:shadow-xl

            active:scale-95
            "
          >
            <LuArrowUp size={18} className="sm:size-[22px]" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
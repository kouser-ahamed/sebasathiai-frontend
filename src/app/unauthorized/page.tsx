"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@heroui/react";
import { ArrowLeft, House, Lock } from "@gravity-ui/icons";

const UnauthorizedPage = () => {
  const router = useRouter();

  return (
    <main
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-gradient-to-br
        from-[#FFF8FC]
        via-[#FBEFEF]
        to-[#F3EAF7]
        px-4
        py-10
        dark:from-[#120C18]
        dark:via-[#211827]
        dark:to-[#0F0915]
        sm:px-6
      "
    >
      {/* Background decorations */}

      <div
        className="
          pointer-events-none
          absolute
          -left-28
          top-10
          size-80
          rounded-full
          bg-[#C5B3D3]/35
          blur-3xl
          dark:bg-[#745D83]/20
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-24
          bottom-5
          size-96
          rounded-full
          bg-[#F5CBCB]/45
          blur-3xl
          dark:bg-[#B8848E]/15
        "
      />

      <section
        className="
          relative
          w-full
          max-w-4xl
          overflow-hidden
          rounded-[36px]
          border
          border-[#F5CBCB]
          bg-white/90
          shadow-[0_35px_100px_-40px_rgba(116,93,131,0.45)]
          backdrop-blur-xl
          dark:border-[#51415D]
          dark:bg-[#2A2233]/95
        "
      >
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left visual section */}

          <div
            className="
              relative
              flex
              min-h-80
              items-center
              justify-center
              overflow-hidden
              bg-gradient-to-br
              from-[#C5B3D3]
              via-[#F5CBCB]
              to-[#FFE2E2]
              p-8
              dark:from-[#51415D]
              dark:via-[#493642]
              dark:to-[#352A3E]
              sm:p-10
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                -left-16
                -top-16
                size-56
                rounded-full
                bg-white/40
                blur-3xl
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -bottom-20
                -right-16
                size-64
                rounded-full
                bg-[#FBEFEF]/60
                blur-3xl
                dark:bg-[#745D83]/20
              "
            />

            <div className="relative text-center">
              <div
                className="
                  mx-auto
                  flex
                  size-24
                  items-center
                  justify-center
                  rounded-full
                  border-4
                  border-white/70
                  bg-white/80
                  shadow-xl
                  dark:border-white/20
                  dark:bg-[#2A2233]/80
                "
              >
                <Lock
                  className="
                    size-11
                    text-[#745D83]
                    dark:text-[#F5CBCB]
                  "
                />
              </div>

              <p
                className="
                  mt-7
                  text-7xl
                  font-black
                  leading-none
                  tracking-tight
                  text-slate-950
                  drop-shadow-sm
                  dark:text-white
                  sm:text-8xl
                "
              >
                403
              </p>

              <div
                className="
                  mx-auto
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/60
                  bg-white/60
                  px-4
                  py-2
                  text-xs
                  font-black
                  uppercase
                  tracking-[0.16em]
                  text-[#614E70]
                  backdrop-blur-md
                  dark:border-white/15
                  dark:bg-[#211B27]/60
                  dark:text-[#F5CBCB]
                "
              >
                Secure Healthcare Access
              </div>
            </div>
          </div>

          {/* Content section */}

          <div className="flex items-center p-6 sm:p-10 lg:p-12">
            <div className="w-full">
              {/* Project logo */}

              <button
                type="button"
                onClick={() => router.push("/")}
                className="
                  group
                  inline-flex
                  items-center
                  gap-3
                  text-left
                "
              >
                <Image
                  src="/assets/final1.png"
                  alt="SebaSathi AI logo"
                  width={42}
                  height={42}
                  priority
                  className="
                    rounded-full
                    object-cover
                    transition-transform
                    duration-300
                    group-hover:scale-105
                  "
                />

                <div>
                  <p
                    className="
                      text-xl
                      font-black
                      text-slate-950
                      dark:text-white
                    "
                  >
                    Seba
                    <span className="text-[#745D83] dark:text-[#F5CBCB]">
                      Sathi AI
                    </span>
                  </p>

                  <p
                    className="
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.16em]
                      text-slate-500
                      dark:text-[#CDBFD0]
                    "
                  >
                    Intelligent Healthcare Access
                  </p>
                </div>
              </button>

              <p
                className="
                  mt-8
                  text-xs
                  font-black
                  uppercase
                  tracking-[0.18em]
                  text-[#745D83]
                  dark:text-[#F5CBCB]
                "
              >
                Access Restricted
              </p>

              <h1
                className="
                  mt-3
                  text-3xl
                  font-black
                  leading-tight
                  tracking-tight
                  text-slate-950
                  dark:text-white
                  sm:text-4xl
                "
              >
                You are not authorized to access this page.
              </h1>

              <p
                className="
                  mt-5
                  max-w-xl
                  text-sm
                  font-medium
                  leading-7
                  text-slate-600
                  dark:text-[#D8CADA]
                  sm:text-base
                "
              >
                Your current account role does not have permission to view this
                section. Your access may also have been restricted or updated by
                the administrator.
              </p>

              <div
                className="
                  mt-8
                  grid
                  gap-3
                  sm:grid-cols-2
                "
              >
                <Button
                  type="button"
                  size="lg"
                  onPress={() => router.push("/")}
                  className="
                    group
                    h-12
                    w-full
                    rounded-2xl
                    bg-gradient-to-r
                    from-[#C5B3D3]
                    via-[#F5CBCB]
                    to-[#FFE2E2]
                    px-5
                    text-sm
                    font-black
                    text-slate-900
                    shadow-lg
                    shadow-[#C5B3D3]/30
                    transition-all
                    hover:-translate-y-0.5
                    hover:shadow-xl
                    dark:from-[#8F789F]
                    dark:via-[#B8848E]
                    dark:to-[#CFA4A4]
                    dark:text-white
                  "
                >
                  <House className="size-5" />
                  Return to Home
                </Button>

                <Button
                  type="button"
                  size="lg"
                  variant="bordered"
                  onPress={() => router.back()}
                  className="
                    h-12
                    w-full
                    rounded-2xl
                    border
                    border-[#E4D5E7]
                    bg-white
                    px-5
                    text-sm
                    font-black
                    text-[#614E70]
                    transition-all
                    hover:-translate-y-0.5
                    hover:border-[#C5B3D3]
                    hover:bg-[#FBEFEF]
                    dark:border-[#5D4C69]
                    dark:bg-[#352B3D]
                    dark:text-[#F5CBCB]
                    dark:hover:border-[#C5B3D3]
                    dark:hover:bg-[#41354A]
                  "
                >
                  <ArrowLeft className="size-5" />
                  Go Back
                </Button>
              </div>

              <Button
                type="button"
                variant="light"
                onPress={() => router.push("/auth/login")}
                className="
                  mt-4
                  w-full
                  rounded-2xl
                  font-black
                  text-[#745D83]
                  transition-colors
                  hover:bg-[#FBEFEF]
                  dark:text-[#F5CBCB]
                  dark:hover:bg-[#41354A]
                "
              >
                Sign in with another account
              </Button>

              <div
                className="
                  mt-7
                  rounded-2xl
                  border
                  border-[#F5CBCB]
                  bg-[#FFF8FA]
                  px-5
                  py-4
                  text-sm
                  font-medium
                  leading-6
                  text-slate-600
                  dark:border-[#5D4C69]
                  dark:bg-[#352B3D]
                  dark:text-[#D8CADA]
                "
              >
                If you believe you should have access to this page, please
                contact the SebaSathi AI administrator.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default UnauthorizedPage;
const DoctorCardSkeleton = () => {
  return (
    <div
      className="
        overflow-hidden
        rounded-3xl
        border
        border-[#F5CBCB]
        bg-white
        shadow-sm
        dark:border-[#51415D]
        dark:bg-[#2A2233]
      "
    >
      {/* Doctor image */}
      <div
        className="
          relative
          h-56
          w-full
          animate-pulse
          bg-gradient-to-r
          from-[#E7DBEA]
          via-[#F5E8EC]
          to-[#E7DBEA]
          dark:from-[#392E43]
          dark:via-[#493B54]
          dark:to-[#392E43]
        "
      >
        <div
          className="
            absolute
            right-3
            top-3
            h-7
            w-20
            rounded-full
            bg-white/80
            dark:bg-[#5D4C69]
          "
        />
      </div>

      {/* Doctor details */}
      <div className="space-y-4 p-5">
        <div
          className="
            h-6
            w-3/5
            animate-pulse
            rounded-lg
            bg-[#E7DBEA]
            dark:bg-[#493B54]
          "
        />

        <div
          className="
            h-4
            w-2/5
            animate-pulse
            rounded-full
            bg-[#F1E5E8]
            dark:bg-[#3D3146]
          "
        />

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div
            className="
              h-4
              w-24
              animate-pulse
              rounded-full
              bg-[#F1E5E8]
              dark:bg-[#3D3146]
            "
          />

          <div
            className="
              h-4
              w-10
              animate-pulse
              rounded-full
              bg-[#F1E5E8]
              dark:bg-[#3D3146]
            "
          />
        </div>

        {/* Experience */}
        <div className="flex items-center gap-3">
          <div
            className="
              size-5
              animate-pulse
              rounded-md
              bg-[#E7DBEA]
              dark:bg-[#493B54]
            "
          />

          <div
            className="
              h-4
              w-36
              animate-pulse
              rounded-full
              bg-[#F1E5E8]
              dark:bg-[#3D3146]
            "
          />
        </div>

        {/* Hospital */}
        <div className="flex items-center gap-3">
          <div
            className="
              size-5
              animate-pulse
              rounded-md
              bg-[#E7DBEA]
              dark:bg-[#493B54]
            "
          />

          <div
            className="
              h-4
              w-44
              animate-pulse
              rounded-full
              bg-[#F1E5E8]
              dark:bg-[#3D3146]
            "
          />
        </div>

        {/* Qualification */}
        <div className="flex items-center gap-3">
          <div
            className="
              size-5
              animate-pulse
              rounded-md
              bg-[#E7DBEA]
              dark:bg-[#493B54]
            "
          />

          <div
            className="
              h-4
              w-28
              animate-pulse
              rounded-full
              bg-[#F1E5E8]
              dark:bg-[#3D3146]
            "
          />
        </div>

        {/* Button */}
        <div
          className="
            mt-3
            h-11
            w-full
            animate-pulse
            rounded-2xl
            bg-[#745D83]/70
            dark:bg-[#8F789F]/70
          "
        />
      </div>
    </div>
  );
};

export default function Loading() {
  return (
    <main
      className="
        min-h-screen
        bg-[#FFF9FA]
        pb-16
        pt-8
        dark:bg-[#211B27]
      "
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page heading skeleton */}
        <section
          className="
            rounded-[30px]
            border
            border-[#F5CBCB]
            bg-gradient-to-r
            from-[#FFF8F8]
            to-[#FFE8E8]
            px-8
            py-8
            shadow-sm
            dark:border-[#51415D]
            dark:from-[#302638]
            dark:to-[#382B37]
            sm:px-10
          "
        >
          <div
            className="
              h-7
              w-52
              animate-pulse
              rounded-full
              bg-white/80
              dark:bg-[#5D4C69]
            "
          />

          <div
            className="
              mt-5
              h-11
              w-full
              max-w-xl
              animate-pulse
              rounded-xl
              bg-[#E7DBEA]
              dark:bg-[#493B54]
            "
          />

          <div
            className="
              mt-3
              h-11
              w-full
              max-w-md
              animate-pulse
              rounded-xl
              bg-[#E7DBEA]
              dark:bg-[#493B54]
            "
          />

          <div
            className="
              mt-5
              h-4
              w-full
              max-w-2xl
              animate-pulse
              rounded-full
              bg-[#F1DDE1]
              dark:bg-[#493B54]
            "
          />

          <div
            className="
              mt-2
              h-4
              w-full
              max-w-xl
              animate-pulse
              rounded-full
              bg-[#F1DDE1]
              dark:bg-[#493B54]
            "
          />
        </section>

        {/* Search and filter skeleton */}
        <section
          className="
            mt-7
            rounded-[26px]
            border
            border-[#F5CBCB]
            bg-white
            p-5
            shadow-sm
            dark:border-[#51415D]
            dark:bg-[#2A2233]
          "
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <div
              className="
                h-12
                flex-1
                animate-pulse
                rounded-2xl
                border
                border-[#E4D5E7]
                bg-[#FAF7FB]
                dark:border-[#5D4C69]
                dark:bg-[#352B3D]
              "
            />

            <div
              className="
                h-12
                w-full
                animate-pulse
                rounded-2xl
                bg-[#745D83]
                sm:w-36
              "
            />
          </div>

          <div
            className="
              mt-4
              rounded-2xl
              border
              border-[#F5CBCB]
              bg-[#FFF9FA]
              p-4
              dark:border-[#5D4C69]
              dark:bg-[#302638]
            "
          >
            <div className="flex items-center justify-between">
              <div
                className="
                  h-5
                  w-32
                  animate-pulse
                  rounded-full
                  bg-[#E7DBEA]
                  dark:bg-[#493B54]
                "
              />

              <div
                className="
                  h-4
                  w-14
                  animate-pulse
                  rounded-full
                  bg-[#E7DBEA]
                  dark:bg-[#493B54]
                "
              />
            </div>

            <div
              className="
                mt-4
                grid
                gap-3
                sm:grid-cols-2
                lg:grid-cols-4
              "
            >
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="
                    h-11
                    animate-pulse
                    rounded-xl
                    border
                    border-[#E4D5E7]
                    bg-white
                    dark:border-[#5D4C69]
                    dark:bg-[#352B3D]
                  "
                />
              ))}
            </div>
          </div>
        </section>

        {/* Doctors heading */}
        <div className="mt-8">
          <div
            className="
              h-7
              w-48
              animate-pulse
              rounded-lg
              bg-[#E7DBEA]
              dark:bg-[#493B54]
            "
          />

          <div
            className="
              mt-2
              h-4
              w-full
              max-w-md
              animate-pulse
              rounded-full
              bg-[#F1E5E8]
              dark:bg-[#3D3146]
            "
          />
        </div>

        {/* 4 doctor skeleton cards */}
        <div
          className="
            mt-7
            grid
            gap-6
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <DoctorCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </main>
  );
}
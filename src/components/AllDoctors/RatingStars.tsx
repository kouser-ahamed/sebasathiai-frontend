"use client";

import { LuStar } from "react-icons/lu";

interface RatingStarsProps {
  value: number;
  onChange?: (rating: number) => void;
  sizeClassName?: string;
  disabled?: boolean;
}

const RatingStars = ({
  value,
  onChange,
  sizeClassName = "size-5",
  disabled = false,
}: RatingStarsProps) => {
  const normalizedValue = Math.min(
    5,
    Math.max(0, value),
  );

  return (
    <div
      className="flex items-center gap-1"
      role={onChange ? "radiogroup" : undefined}
      aria-label={`${normalizedValue} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map(
        (star) => {
          const isActive =
            star <=
            Math.round(normalizedValue);

          if (onChange) {
            return (
              <button
                key={star}
                type="button"
                role="radio"
                aria-checked={
                  star ===
                  Math.round(
                    normalizedValue,
                  )
                }
                aria-label={`Give ${star} star${
                  star > 1 ? "s" : ""
                }`}
                disabled={disabled}
                onClick={() =>
                  onChange(star)
                }
                className="rounded-md p-0.5 transition hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#745D83] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <LuStar
                  className={`${sizeClassName} ${
                    isActive
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300 dark:text-[#5D4C69]"
                  }`}
                />
              </button>
            );
          }

          return (
            <LuStar
              key={star}
              aria-hidden="true"
              className={`${sizeClassName} ${
                isActive
                  ? "fill-amber-400 text-amber-400"
                  : "text-slate-300 dark:text-[#5D4C69]"
              }`}
            />
          );
        },
      )}
    </div>
  );
};

export default RatingStars;
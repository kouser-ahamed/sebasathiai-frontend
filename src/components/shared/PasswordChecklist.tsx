import type { ReactElement } from "react";

interface PasswordChecklistProps {
  password?: string;
}

interface PasswordRule {
  key: string;
  label: string;
  test: (password: string) => boolean;
}

const rules: PasswordRule[] = [
  {
    key: "length",
    label: "At least 8 characters",
    test: (password: string): boolean => password.length >= 8,
  },
  {
    key: "uppercase",
    label: "One uppercase letter",
    test: (password: string): boolean => /[A-Z]/.test(password),
  },
  {
    key: "lowercase",
    label: "One lowercase letter",
    test: (password: string): boolean => /[a-z]/.test(password),
  },
];

const PasswordChecklist = ({
  password = "",
}: PasswordChecklistProps): ReactElement => {
  return (
    <div className="mt-2 space-y-1.5 text-xs sm:text-sm">
      {rules.map((rule) => {
        const isValid = rule.test(password);

        return (
          <div
            key={rule.key}
            className={`flex items-center gap-2 font-medium transition-colors duration-200 ${
              isValid
                ? "text-[#614E70] dark:text-[#F5CBCB]"
                : "text-slate-500 dark:text-[#A997AE]"
            }`}
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-all duration-200 ${
                isValid
                  ? "bg-[#745D83] text-white shadow-sm shadow-[#C5B3D3]/60 dark:bg-[#F5CBCB] dark:text-[#211B27]"
                  : "bg-[#FFE2E2] text-[#9A727A] dark:bg-[#352B3D] dark:text-[#A997AE]"
              }`}
            >
              {isValid ? "✓" : "•"}
            </span>

            <span>{rule.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default PasswordChecklist;
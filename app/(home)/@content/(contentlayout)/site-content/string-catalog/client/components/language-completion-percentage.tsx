import { CheckmarkCircle } from "framework7-icons/react";

const LanguageCompletionPercentage = ({ percentage }: { percentage: number }) => {
  return (
    <span className="text-sm/none py-1 font-medium ms-auto flex items-center justify-center">
      {percentage == 100 ? (
        <CheckmarkCircle style={{ lineHeight: "0" }} className="text-green-500 !text-sm leading-none" />
      ) : (
        percentage + "%"
      )}
    </span>
  )
}

export default LanguageCompletionPercentage;
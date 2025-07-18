import { cn } from "@/lib/utils";
import styles from "./activity-indicator.module.css";
import { HTMLAttributes } from "react";

export type ActivityIndicatorProps = HTMLAttributes<HTMLDivElement>;

// export const ActivityIndicator = ({ className, ...props }: ActivityIndicatorProps) => {
//   return (
//     <div className={cn(styles.ispinner, className)} {...props}>
//       {
//       ActivityIndicator.configuration.iterate.map((_, index) => <_SpinnerBlade key={index} />)}
//     </div>
//   );
// };

export const ActivityIndicator = ({ className, ...props }: ActivityIndicatorProps) => {
  return (
    <div className={cn("flex justify-center items-center h-full ", className)} {...props}>
      <div className="flex items-center justify-center" style={{ transform: "translateY(50%)" }}>
        <div className="spinner_spinner__Wkf45">
          <div className="spinner_bar__tdAm1" /><div className="spinner_bar__tdAm1" /><div className="spinner_bar__tdAm1" /><div className="spinner_bar__tdAm1" /><div className="spinner_bar__tdAm1" /><div className="spinner_bar__tdAm1" /><div className="spinner_bar__tdAm1" /><div className="spinner_bar__tdAm1" /><div className="spinner_bar__tdAm1" /><div className="spinner_bar__tdAm1" /><div className="spinner_bar__tdAm1" /><div className="spinner_bar__tdAm1" />
        </div>
      </div>
    </div>
  );
};

ActivityIndicator.configuration = {
  numberOfBlades: 8
};

Object.assign(
  ActivityIndicator.configuration, {
  iterate: Array.from({ length: ActivityIndicator.configuration.numberOfBlades })
});

const _SpinnerBlade = () => <div className={styles["ispinner-blade"]} />;
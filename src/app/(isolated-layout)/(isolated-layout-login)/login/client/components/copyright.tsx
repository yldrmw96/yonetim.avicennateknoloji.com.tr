const Copyright = ({ brand, className, ...props }: { brand: string, className?: string, props?: React.ComponentPropsWithoutRef<"div"> }) => {
  const year = new Date().getFullYear();
  return (
    <div className={className} {...props}>
      <p className="text-xs font-medium text-gray-600 dark:text-neutral-400">
        © {year} Powered by{" "}
        <a
          href="https://www.google.com"
          className="text-primary font-bold hover:text-primary/80 "
        >
          {brand}
        </a>
        .
      </p>
    </div>
  );
};

export default Copyright;
interface inputProps {
  placeholder: string;
  hasError?: boolean;
  errorMessage?: string;
  type?: string;
}

// forwardRef<HTMLInputElement, InputProps>(({ hasError, errorMessage, placeholder }, ref)
const Input = ({ placeholder, type, hasError, errorMessage }: inputProps) => {
  return (
    <div>
      <input
        // ref={ref}
        placeholder={placeholder}
        type={type}
        className="w-full h-[40px] p-2.5 border focus:border-Green placeholder:text-LightGray rounded outline-none"
      />
      {hasError && (
        <p className="text-Green text-description">{errorMessage}</p>
      )}
    </div>
  );
};

export default Input;

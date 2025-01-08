import { useState } from 'react';

const useInputValue = (initial: string = '') => {
  const [inputValue, setInputValue] = useState(initial);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  const resetInput = () => setInputValue('');

  return [inputValue, handleInputChange, resetInput] as const;
};

export default useInputValue;

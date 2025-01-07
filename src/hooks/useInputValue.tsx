import { useState } from 'react';

const useInputValue = (initial: string = '') => {
  const [inputValue, setInputValue] = useState(initial);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  return [inputValue, handleInputChange] as const;
};

export default useInputValue;

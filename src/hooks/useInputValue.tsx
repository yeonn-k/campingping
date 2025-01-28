import { useState } from 'react';

const useInputValue = () => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  const resetInput = () => {
    setInputValue('');
  };

  return [inputValue, handleInputChange, resetInput] as const;
};
export default useInputValue;

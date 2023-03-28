import React from 'react';
import { Button } from '@aleph-front/aleph-core';
import { HiddenFileInputProps } from './types';
import { StyledHiddenFileInput } from './styles';

const HiddenFileInput = ({ onChange, accept, children }: HiddenFileInputProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if(inputRef.current !== null)
      inputRef.current.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // This is verbose to avoid a type error on e.target.files[0] being undefined
    const target = e.target as HTMLInputElement;
    const { files } = target;

    if(files){
      const fileUploaded = files[0];
      onChange(fileUploaded);
    }
  };

  return (
    <>
      <Button onClick={handleClick} type="button" color="main0" kind="neon" size="regular" variant="primary">
        {children}
      </Button>

      <StyledHiddenFileInput
        type="file"
        ref={inputRef}
        onChange={handleChange}
        accept={accept}
      />
    </>
  );
  }

export default HiddenFileInput;
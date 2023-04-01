import React, { useEffect } from 'react';
import { Button, Icon } from '@aleph-front/aleph-core';
import { HiddenFileInputProps } from './types';
import { StyledHiddenFileInput } from './styles';
import { ellipseAddress } from '@/helpers/utils';

const HiddenFileInput = ({ onChange, accept, value, children }: HiddenFileInputProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [inMemoryFile, setInMemoryFile] = React.useState<File | null>(null);

  const handleClick = () => {
    if(inputRef.current !== null)
      inputRef.current.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | null) => {
    if(e === null){
      setInMemoryFile(null);
      return onChange(undefined);
    }

    // This is verbose to avoid a type error on e.target.files[0] being undefined
    const target = e.target as HTMLInputElement;
    const { files } = target;

    
    if(files){
      const fileUploaded = files[0];
      setInMemoryFile(fileUploaded);
      onChange(fileUploaded);
    }
  };

  useEffect(() => {
    if(value)
      setInMemoryFile(value);
  },
  [value])

  return (
    <>
      {
        inMemoryFile ?
        <Button onClick={() => handleChange(null)} type="button" color="main2" kind="neon" size="regular" variant="tertiary">
          {ellipseAddress(inMemoryFile.name)} <Icon name="trash" className="ml-md" />
        </Button>
        :
        <Button onClick={handleClick} type="button" color="main0" kind="neon" size="regular" variant="primary">
          {children}
        </Button>
      }

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
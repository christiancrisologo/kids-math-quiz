import React, { ChangeEvent } from 'react';

interface AnswerInputProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
}

const AnswerInput: React.FC<AnswerInputProps> = ({ value, onChange, placeholder }) => {
    return (
        <input
            type="text"
            value={value}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
            placeholder={placeholder}
        />
    );
};

export default AnswerInput;

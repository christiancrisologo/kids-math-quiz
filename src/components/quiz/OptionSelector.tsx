
import React from 'react';
import { MobileTile } from '../ui/MobileTile';

interface OptionSelectorProps {
    options: Array<string | number>;
    selectedOption: string | number | null;
    onSelect: (option: string | number) => void;
}

const OptionSelector: React.FC<OptionSelectorProps> = ({ options, selectedOption, onSelect }) => {
    return (
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {options.map((option, idx) => (
                <MobileTile
                    key={idx}
                    title={typeof option === 'string' ? option : option.toString()}
                    isSelected={selectedOption === option}
                    onClick={() => onSelect(option)}
                />
            ))}
        </div>
    );
};

export default OptionSelector;

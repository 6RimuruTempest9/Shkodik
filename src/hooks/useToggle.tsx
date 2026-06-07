import { useState } from 'react';

export function useToggle(initialValue: boolean = false): [boolean, () => void] {
    const [value, setValue] = useState(initialValue);
    
    const toggle = () => setValue(previousValue => !previousValue);
    
    return [value, toggle];
}
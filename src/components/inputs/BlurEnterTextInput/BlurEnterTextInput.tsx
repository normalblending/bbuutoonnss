import * as React from "react";
import {useEffect, useMemo, useState} from "react";
import cn from 'classnames';
import './BlurEnterTextInput.css'

let idCounter = 0;

export interface BlurEnterTextInputProps extends Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'onChange' | 'value'> {
    name?: string
    className?: string
    value: string
    onChange: (value: string, name?: string) => void
    changeOnBlur?: boolean
    changeOnChange?: boolean
    resetOnBlur?: boolean
    changeOnEnter?: boolean
    datalist?: string[]
}

export function BlurEnterTextInput(props: BlurEnterTextInputProps) {

    const {
        className,
        value,
        name,
        onChange,
        changeOnBlur,
        changeOnChange,
        resetOnBlur,
        changeOnEnter,
        datalist,
        onBlur,
        ...restProps
    } = props;

    const [_value, setValue] = useState<string>('');
    const _datalistId = useMemo<string>(() => 'input-datalist-' + (idCounter++), []);

    const handleChange = React.useCallback((e) => {
        const value = e.target.value
        setValue(value);
        if (changeOnChange) {
            onChange(value, name)
        }
    }, [changeOnChange, onChange, name]);

    const handleKeyDown = React.useCallback((e) => {
        if (changeOnEnter && e.key === 'Enter') {
            onChange(_value, name);
        }

    }, [onChange, changeOnEnter, _value, name]);

    const handleBlur = React.useCallback((e) => {
        if (changeOnBlur) {
            onChange(_value, name);
        } else if (resetOnBlur) {
            setValue(value);
        }
        onBlur?.(e)
    }, [onBlur, onChange, changeOnBlur, _value, value, name]);

    useEffect(() => {
        if (value !== _value) {
            setValue(value);
        }
    }, [value]);

    return (
        <>
            <input
                {...restProps}
                className={cn('blur-text-input', className)}
                type={'text'}
                list={datalist ? _datalistId : undefined}
                value={_value || ''}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
            />
            {datalist && (
                <datalist id={_datalistId} style={{pointerEvents: 'none'}}>
                    {datalist?.map(item => <option key={item} value={item}>{item}</option>)}
                </datalist>
            )}
        </>
    );
};

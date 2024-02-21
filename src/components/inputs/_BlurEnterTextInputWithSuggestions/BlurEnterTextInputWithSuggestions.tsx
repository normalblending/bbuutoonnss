import * as React from "react";
import {useEffect, useMemo, useState} from "react";
import cn from 'classnames';
import './BlurEnterTextInputWithSuggestions.css'
import {useIsActive} from "../../../hooks/useIsActive";

let idCounter = 0;
//  нужно доделать

export interface BlurEnterTextInputWithSuggestionsProps extends Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'onChange'> {
    name?: string
    className?: string
    value: string
    onChange: (value: string, name?: string) => void
    changeOnBlur?: boolean
    resetOnBlur?: boolean
    changeOnEnter?: boolean
    strings?: string[]
}

export function BlurEnterTextInputWithSuggestions(props: BlurEnterTextInputWithSuggestionsProps) {

    const {
        className,
        value,
        name,
        onChange,
        changeOnBlur,
        resetOnBlur,
        changeOnEnter,
        strings,
        ...restProps
    } = props;

    const [isFocused, {handleActivate: focus, handleDeactivate: blur}] = useIsActive(false)
    const [current, setCurrent] = useState<number>(-1)
    const [_value, setValue] = useState<string>('');

    const handleChange = React.useCallback((e) => {
        setValue(e.target.value);
    }, []);

    const handleKeyDown = React.useCallback((e) => {
        if (changeOnEnter && e.key === 'Enter') {
            if (current !== -1) {
                onChange(strings[current], name);
                setCurrent(-1);
            } else {
                onChange(_value, name);
            }
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault()
            setCurrent(current !== -1 ? (current - 1 + strings.length) % strings.length : (strings.length - 1));
        } else if (e.key === 'ArrowDown') {
            e.preventDefault()
            setCurrent((current + 1) % strings.length);
        } else {
            setCurrent(-1);
        }
    }, [current, onChange, changeOnEnter, _value, name, strings]);

    const handleBlur = React.useCallback(() => {
        blur()
        if (changeOnBlur) {
            onChange(_value, name);
        } else if (resetOnBlur) {
            setValue(value);
        }
    }, [onChange, changeOnBlur, _value, value, name, blur]);

    const handleFocus = React.useCallback(() => {
        focus()
    }, [onChange, changeOnBlur, _value, value, name, focus]);

    useEffect(() => {
        if (value !== _value) {
            setValue(value);
        }
    }, [value]);

    return (
        <div className={cn('blur-text-input-suggestions-container', className, {
            ['focused']: isFocused
        })}>
            <input
                className={cn('blur-text-input-suggestions')}
                type={'text'}
                value={_value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                {...restProps}
            />
            {isFocused && strings && (
                <div
                    className={cn('blur-text-input-suggestions-suggestions')}
                >
                    {strings?.map((item, index) => (
                        <div
                            onClick={() => {
                                setCurrent(index)
                            }}
                            className={cn({
                                ['current']: index === current
                            })} key={item}
                        >{item}</div>
                    ))}
                </div>
            )}
        </div>
    );
}

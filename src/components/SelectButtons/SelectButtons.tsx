import * as React from "react";
import classNames from "classnames";
import {ButtonSelect} from "../ButtonSelect";
import {ButtonEventData} from "../Button";

export interface SelectButtonsEventData extends ButtonEventData {
    item: any
    items: any[]
    isPrevValue?: boolean
    isNextValue?: boolean
}

export interface SelectButtonsProps {
    className?: string
    itemClassName?: (item?: any) => string
    name?: string
    items: any[]
    value?: any

    nullAble?: boolean

    br?: number
    width?: number

    onChange?(data?: SelectButtonsEventData)

    onBlur?()

    onFocus?()

    onItemClick?(data?: SelectButtonsEventData)

    onItemMouseEnter?(data?: SelectButtonsEventData)

    onItemMouseLeave?(data?: SelectButtonsEventData)

    getValue?(item?: any)

    getText?(item?: any)

}

export const defaultGetValue = (item) => item?.value;
export const defaultGetText = (item) => item?.text;

export interface SelectButtonsImperativeHandlers {
    focus(e?: any): boolean

    nextValue()

    prevValue()
}

export const SelectButtons = React.forwardRef<SelectButtonsImperativeHandlers, SelectButtonsProps>((props, ref) => {
    const {
        className,
        itemClassName,
        items,
        value,
        name,
        getValue = defaultGetValue,
        getText = defaultGetText,
        br,
        width,
        onItemClick,
        onItemMouseEnter,
        onItemMouseLeave,

        onChange,
        nullAble,
        onBlur,
        onFocus,
    } = props;



    const arrLength = items.length;
    const [elRefs, setElRefs] = React.useState(Array(arrLength).fill(null).map((_, i) => React.createRef()));

    React.useEffect(() => {
        // add or remove refs
        setElRefs(elRefs => (
            Array(arrLength).fill(null).map((_, i) => elRefs[i] || React.createRef())
        ));
    }, [arrLength]);

    const handleClick = React.useCallback(({value: item, selected, e}) => {
        let newValue = getValue(item);

        if (nullAble && value === newValue) {
            newValue = null
        }

        onChange && onChange({
            value: newValue,
            e, item, items, name
        });

        onItemClick?.({
            value: newValue,
            e, item, items, name
        });
    }, [onChange, onItemClick, name, items, getValue, nullAble, value]);


    const divRef = React.useRef<HTMLDivElement>(null);

    const timer = React.useRef<NodeJS.Timeout | undefined>(undefined);
    const handleFocus = React.useCallback(() => {
        timer.current && clearTimeout(timer.current);

        onFocus?.();
    }, [onFocus, timer.current]);

    const handleBlur = React.useCallback(() => {
        timer.current = setTimeout(() => {
            onBlur?.();
        }, 100);
    }, [onBlur, timer]);


    React.useImperativeHandle(ref, () => ({
        focus: () => {
            const selectedButton = divRef?.current?.getElementsByClassName('button-select-selected')[0] as HTMLElement;

            if (selectedButton) {
                selectedButton.focus();

                return true;

            } else {
                const firstButton = divRef?.current?.getElementsByClassName('button')[0] as HTMLElement;

                if (firstButton) {
                    firstButton.focus();
                    return true;
                } else {
                    return false;
                }
            }
        },
        nextValue: (e?) => {
            const isNextValue = true;

            const currentValueIndex = items.findIndex((item) => getValue(item) === value);

            let newValue;
            let nextValueItem;
            let nextValueIndex;

            if (currentValueIndex === -1) {
                nextValueIndex = 0;
                nextValueItem = items[nextValueIndex];
                newValue = getValue(nextValueItem);


            } else if (currentValueIndex < items.length - 1) {
                nextValueIndex = currentValueIndex + 1;
                nextValueItem = items[nextValueIndex];
                newValue = getValue(nextValueItem);

            } else if (currentValueIndex >= items.length - 1) {
                nextValueIndex = 0;
                nextValueItem = items[nextValueIndex];
                newValue = nullAble
                    ? null
                    : getValue(nextValueItem);
            }

            onChange && onChange({
                value: newValue,
                e,
                item: nextValueItem,
                items, name,
                isNextValue
            });

            (elRefs[nextValueIndex]?.current as any)?.focus();
        },
        prevValue: (e?) => {
            const isPrevValue = true;
            const currentValueIndex = items.findIndex((item) => getValue(item) === value);

            if (currentValueIndex === -1) {
                const item = items[items.length - 1];
                let newValue = getValue(item);

                onChange && onChange({
                    value: newValue,
                    e, item, items, name,
                    isPrevValue
                });
            } else if (currentValueIndex === 0) {
                const item = items[items.length - 1];
                let newValue = nullAble
                    ? null
                    : getValue(item);

                onChange && onChange({
                    value: newValue,
                    e, item, items, name,
                    isPrevValue
                });
            } else if (currentValueIndex <= items.length - 1) {
                const item = items[currentValueIndex - 1];
                let newValue = getValue(item);

                onChange && onChange({
                    value: newValue,
                    e, item, items, name,
                    isPrevValue
                });
            }
        }
    }), [value, handleFocus, items, nullAble, elRefs]);

    return (
        <div
            className={classNames(className, "select-bbuutoonnss")}
            style={{width: br ? br * (+(width || 70)) : 'auto'}}
            ref={divRef}
        >
            <div className={"select-bbuutoonnss__items"}>
                {items.map((item, index) => (
                    <ButtonSelect
                        className={itemClassName?.(item)}
                        name={`${name}.${getValue(item)}`}
                        width={width}
                        value={item}
                        key={index}
                        selected={getValue(item) === value}
                        onMouseEnter={onItemMouseEnter}
                        onMouseLeave={onItemMouseLeave}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                        onClick={handleClick}
                    >
                        {getText(item)}
                    </ButtonSelect>
                ))}
            </div>
        </div>
    );
});

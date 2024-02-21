import * as React from "react";
import './inputFile.css';
import cn from 'classnames'

export interface FileProps {
    onChange(image)

    name: string
    className?: string
    children: string

    autofocus?: boolean
    autoblur?: boolean

    onMouseEnter?(e)
    onMouseMove?(e)
    onMouseLeave?(e)
}

export interface FileState {

}

export class File extends React.PureComponent<FileProps, FileState> {

    inputRef;

    constructor(props) {
        super(props);

        this.inputRef = React.createRef();
    }

    handleFile = async e => {
        try {
            this.props.onChange?.(e.target.files);
            this.inputRef.current.value = null;
        } catch (e) {

        }
    };


    handleMouseEnter = e => {

        const { autofocus, onMouseEnter } = this.props;
        if (autofocus)
            this.inputRef.current?.focus();

        onMouseEnter?.(e);

    }

    handleMove = e => {
        const { autofocus, onMouseMove } = this.props;
        if (autofocus && document.activeElement !== this.inputRef.current)
            this.inputRef.current?.focus();

        onMouseMove?.(e);

    }

    handleMouseLeave = e => {
        const { autoblur, onMouseLeave } = this.props;
        if (autoblur)
            this.inputRef.current?.blur();

        onMouseLeave?.(e);

    }

    render() {
        const {name, children, className} = this.props;
        return (
            <div
                className={cn('input-file', className)}
                onMouseEnter={this.handleMouseEnter}
                onMouseMove={this.handleMove}
                onMouseLeave={this.handleMouseLeave}
            >
                <input
                    type="file"
                    name={name}
                    id={name}
                    ref={this.inputRef}
                    onChange={this.handleFile}/>
                <label htmlFor={name}>{children}</label>
            </div>
        );
    }
}
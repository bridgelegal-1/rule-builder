import React from "react";
import PropTypes from "prop-types";

import DateFnsUtils from "@date-io/date-fns";
import { parseISO, startOfDay } from "date-fns";
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { DatePicker as MuiDatePicker } from "@mui/lab";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Grid, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

const useStyles = makeStyles((t) => ({
    clearButton: {
        margin: t.spacing(1),
    },
    clearCell: {
        marginLeft: -t.spacing(0.5),
        marginTop: (props) => (props.label ? t.spacing(1.5) : "none"),
    },
}));

function parseDate(date) {
    if (!date) {
        return null;
    }
    if (typeof date === "string") {
        date = parseISO(date);
    }
    date = startOfDay(date);
    return date;
}

const DatePicker = (props) => {
    const classes = useStyles(props);

    const [value, setValue] = React.useState(parseDate(props.value));

    React.useEffect(() => {
        const date = parseDate(props.value);
        setValue(date);
    }, [props.value]);

    function handleDateChange(date) {
        date = parseDate(date);
        setValue(date);
        if (props.onChange) {
            props.onChange(date);
        }
    }

    /*
     * https://material-ui-pickers.dev/api/DatePicker
     */
    function getDatePickerProps() {
        const datePickerProps = {
            ...props,
            InputLabelProps: {
                ...props.InputLabelProps,
                shrink: true,
            },
            variant: "inline",
            inputVariant: "outlined"
        };
        delete datePickerProps.clearable; // not supported by the inline variant
        return datePickerProps;
    }
    return (
        <Grid container>
            <Grid item>
                <LocalizationProvider dateAdapter={DateFnsUtils}>
                    <MuiDatePicker
                        {...getDatePickerProps()}
                        size='small'
                        value={value}
                        onChange={handleDateChange}
                        renderInput={params => <TextField {...params} size='small' />}
                    />
                </LocalizationProvider >
            </Grid>
            {props.clearable && (
                <Grid item className={classes.clearCell}>
                    <IconButton
                        aria-label="clear"
                        className={classes.clearButton}
                        data-testid={`${props["data-testid"]}-clear`}
                        size="small"
                        onClick={() => handleDateChange(null)}
                    >
                        <Close fontSize="inherit" />
                    </IconButton>
                </Grid>
            )}
        </Grid>
    );
};

DatePicker.defaultProps = {
    ...MuiDatePicker.defaultProps,
    "autoOk": true,
    "data-testid": "date-picker",
    "format": "PPP",
};

DatePicker.propTypes = {
    ...MuiDatePicker.propTypes,
    "data-testid": PropTypes.string,
    "clearable": PropTypes.bool,
};

export default DatePicker;
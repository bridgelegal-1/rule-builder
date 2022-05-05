import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { dequal } from 'dequal';
import { Autocomplete, FormControlLabel, FormGroup, Radio, Switch, TextField, Select, Box, MenuItem } from '@mui/material';

import { makeStyles } from '@material-ui/core/styles';

import Context from './libs/context';
import DatePicker from './DatePicker.jsx';

const useFormControlLabelStyles = makeStyles((t) => {
    return {
        label: {
            fontSize: t.typography.fontSize,
        },
    };
});

const readNumericValue = (value) => {
    return value !== null && value !== undefined ? value : '';
};

const supportedTypes = new Set(['date', 'multiselect', 'number', 'radio', 'select', 'switch', 'text']);

const Value = React.memo(
    (props) => {
        const classes = {
            formControlLabel: useFormControlLabelStyles(),
        };
        const context = React.useContext(Context);
        const [valueType, setValueType] = React.useState('value');

        const { field, id, operator, value } = props;
        const { customOperators, dispatch, filtersByValue } = context;

        if (/null/i.test(operator)) {
            return <span />;
        }
        const testId = `value-${props.testId}`;
        const filter = field ? { ...filtersByValue[field] } : { type: null };

        if (!supportedTypes.has(filter.type)) {
            const customOperator = customOperators[filter.type];
            filter.type = customOperator?.type;
        }
        const handleTextFieldChange = (event) => {
            dispatch({ type: 'set-value', id, value: event.target.value });
        };

        let valueEl;

        switch (filter.type) {
            case 'date':
                valueEl = (
                    <DatePicker
                        data-testid={testId}
                        value={value || null}
                        onChange={(date) => {
                            const value = date ? format(date, 'yyyy-MM-dd') : null;
                            dispatch({ type: 'set-value', id, value });
                        }}
                    />
                );
                break;
            case 'multiselect':
                valueEl = (
                    <Autocomplete
                        filterSelectedOptions
                        fullWidth
                        multiple
                        openOnFocus
                        data-testid={testId}
                        disableCloseOnSelect={true}
                        getOptionLabel={(option) => option.label}
                        limitTags={-1}
                        options={filter.options}
                        renderInput={(params) => <TextField {...params} variant='outlined'/>}
                        size='small'
                        style={{ width: 'auto' }}
                        value={filter.options.filter((op) => value?.includes(op.value))}
                        onChange={(event, selected) => {
                            const value = (selected || []).map((item) => item.value);
                            dispatch({ type: 'set-value', id, value });
                        }}
                    />
                );
                break;
            case 'number':
                valueEl =  (
                    <TextField
                        data-testid={testId}
                        type='number'
                        variant='outlined'
                        size='small'
                        value={readNumericValue(value)}
                        onChange={handleTextFieldChange}
                    />
                );
                break;
            case 'radio':
                valueEl = (
                    <FormGroup row sx={{pl: 2}}>
                        <FormControlLabel
                            classes={classes.formControlLabel}
                            control={
                                <Radio
                                    checked={value === true}
                                    color='primary'
                                    size='small'
                                    data-testid={`${testId}-true`}
                                    name={testId}
                                    value={value}
                                    onChange={() => {
                                        dispatch({ type: 'set-value', id, value: true });
                                    }}
                                />
                            }
                            label='True'
                            value={value}
                        />
                        <FormControlLabel
                            classes={classes.formControlLabel}
                            control={
                                <Radio
                                    checked={value === false}
                                    color='primary'
                                    size='small'
                                    data-testid={`${testId}-false`}
                                    name={testId}
                                    value={value}
                                    onChange={() => {
                                        dispatch({ type: 'set-value', id, value: false });
                                    }}
                                />
                            }
                            label='False'
                            value={value}
                        />
                    </FormGroup>
                );
                break;
            case 'select':
                valueEl = (
                    <Autocomplete
                        data-testid={testId}
                        getOptionLabel={(option) => option.label}
                        options={filter.options}
                        renderInput={(params) => <TextField {...params} variant='outlined' size='small'/>}
                        style={{ width: 250 }}
                        value={filter.options.find((op) => value === op.value)}
                        onChange={(event, selected) => {
                            const value = selected ? selected.value : null;
                            dispatch({ type: 'set-value', id, value });
                        }}
                    />
                );
                break;
            case 'switch':
                valueEl = (
                    <Switch
                        color='primary'
                        data-testid={testId}
                        checked={value || false}
                        onChange={(event) => {
                            const value = event.target.checked;
                            dispatch({ type: 'set-value', id, value });
                        }}
                    />
                );
                break;
            default:
                valueEl = (
                    <TextField
                        fullWidth
                        variant='outlined'
                        size='small'
                        data-testid={testId}
                        value={value || ''}
                        onChange={handleTextFieldChange}
                    />
                );
                break;
        }

        return (
            <Box sx={{position: 'relative'}}>
                <Box sx={{pl: '84px'}}>{valueEl}</Box>
                <Select
                    size='small'
                    value={valueType}
                    sx={{position: 'absolute', width: '87px', left: 0, top: 0, borderRadius: '4px 0 0 4px', background: 'white'}}
                    onChange={e => {
                        setValueType(e.target.value);
                    }}
                >
                    <MenuItem value='key'>Key</MenuItem>
                    <MenuItem value='value'>Value</MenuItem>
                </Select>
            </Box>
        );
    },
    (prevProps, nextProps) => {
        // Skip re-rendering if the value didn't change.
        return dequal(prevProps, nextProps);
    }
);

Value.propTypes = {
    field: PropTypes.string,
    id: PropTypes.number.isRequired,
    operator: PropTypes.string,
    testId: PropTypes.string.isRequired,
    value: PropTypes.any,
};

Value.whyDidYouRender = false;

export default Value;
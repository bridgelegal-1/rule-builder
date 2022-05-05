import React from "react";
import PropTypes from "prop-types";

import { Autocomplete, TextField } from "@mui/material";
import { dequal } from "dequal";

import Context from "./libs/context";

const Field = React.memo(
    (props) => {
        const context = React.useContext(Context);
        const { field, id, testId } = props;

        const { dispatch, filtersByValue, flattenedFilters, operatorsByType } = context;
        const filter = field ? filtersByValue[field] : null;

        return (
            <Autocomplete
                fullWidth
                data-testid={`field-${testId}`}
                disableClearable={true}
                groupBy={(option) => option.group}
                getOptionLabel={(option) => option.label}
                options={flattenedFilters}
                renderInput={(params) => <TextField {...params} placeholder="Field" size="small" variant="outlined" />}
                style={{ width: 180 }}
                value={filter}
                onChange={(event, selected) => {
                    const value = selected ? selected.value : null;
                    const { type } = filtersByValue[value];
                    const operators = operatorsByType[type];
                    const operator = operators?.length > 0 ? operators[0].value : null;
                    dispatch({ type: "set-field", id, operator, value });
                }}
            />
        );
    },
    (prevProps, nextProps) => {
        // Skip re-rendering if the field didn't change.
        return dequal(prevProps, nextProps);
    }
);

Field.propTypes = {
    field: PropTypes.string,
    id: PropTypes.number.isRequired,
    testId: PropTypes.string.isRequired,
};

Field.whyDidYouRender = false;

export default Field;
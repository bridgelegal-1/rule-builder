import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import { Tooltip, Button, Grid, Stack, Box, IconButton,  MenuItem, Select} from '@mui/material';
import { AddCircleOutline as AddIcon, RemoveCircleOutline as RemoveIcon, ShareOutlined, DragIndicatorOutlined } from '@mui/icons-material';
import { Draggable, Container as DraggableContainer } from 'react-smooth-dnd';

import Context from './libs/context';
import Field from './Field.jsx';
import Operator from './Operator.jsx';
import Value from './Value.jsx';

const actionIconStyles = (t) => ({
    actionButton: {
        marginRight: t.spacing(-1),
        marginTop: t.spacing(0.75),
    },
    actionIcon: {
        fill: 'rgba(255, 0, 0, 0.9)',
    },
});

const useRuleStyles = makeStyles((t) => {
    return {
        ...actionIconStyles(t),
        container: {
            '& > div': {
                marginBottom: t.spacing(0.5),
                marginTop: t.spacing(0.5),
            },
            'cursor': 'move',
        },
        valueGridItem: {
            flex: 'auto',
        },
    };
});

const Rule = (props) => {
    const classes = useRuleStyles();
    const context = React.useContext(Context);

    const { groupId, id, level, position, rule } = props;
    const { combinator, field, operator, rules, value } = rule;

    const { dispatch } = context;

    const testId = `${level}-${position}`;

    return combinator ? (
        <RuleGroup combinator={combinator} id={id} level={level + 1} rules={rules} />
    ) : (
        <Grid
            container
            alignItems='center'
            className={'rule-item ' + classes.container}
            data-testid={`rule-${testId}`}
            rowSpacing={1}
            sx={{my: 0.5}}
            columnSpacing={{ xs: 1}}
        >
            <DragIndicatorOutlined style={{color: 'rgb(196 196 196)', position: 'absolute', left: '5px', top: '12px'}}/>
            <Grid item>
                <Field field={field} id={id} testId={testId} />
            </Grid>
            <Grid item>
                <Operator field={field} id={id} operator={operator} testId={testId} />
            </Grid>
            <Grid item className={classes.valueGridItem}>
                <Value field={field} id={id} operator={operator} testId={testId} value={value} />
            </Grid>
            <Box className='builder-operator'>
                <Tooltip title='Add Group'>
                    <IconButton
                        className={classes.actionButton}
                        color='primary'
                        size='small'
                        data-testid={`${testId}-add-rule`}
                        onClick={() => {
                            dispatch({ type: 'add-group', id: groupId, position});
                        }}
                    >
                        <ShareOutlined className={classes.actionIcon} fontSize='14px'/>
                    </IconButton>
                </Tooltip>
                <Tooltip title='Add'>
                    <IconButton
                        className={classes.actionButton}
                        color='success'
                        size='small'
                        data-testid={`${testId}-add-rule`}
                        onClick={() => {
                            dispatch({ type: 'add-rule', id: groupId, position});
                        }}
                    >
                        <AddIcon className={classes.actionIcon}  fontSize='14px' />
                    </IconButton>
                </Tooltip>
                <Tooltip title='Delete'>
                    <IconButton
                        className={classes.actionButton}
                        data-testid={`rule-${testId}-remove`}
                        size='small'
                        color='error'
                        onClick={() => {
                            dispatch({ type: 'remove-node', id });
                        }}
                    >
                        <RemoveIcon className={classes.actionIcon} fontSize='14px'/>
                    </IconButton>
                </Tooltip>
            </Box>
        </Grid>
    );
};

Rule.propTypes = {
    id: PropTypes.number.isRequired,
    level: PropTypes.number.isRequired,
    position: PropTypes.number.isRequired,
    rule: PropTypes.object.isRequired,
};

const useRuleGroupStyles = makeStyles((t) => ({
    actionButton: {
        '& svg': {
            marginRight: t.spacing(0.5),
            marginTop: t.spacing(0.25),
        },
        'textTransform': 'none',
    },
    combinator: {
        height: 36,
        padding: t.spacing(0, 1.5),
    },
    group: {
        paddingLeft: t.spacing(1.5),
        marginBottom: t.spacing(0.5),
        marginTop: (props) => (props.level > 0 ? t.spacing(0.5) : 'none'),
    },
    ...actionIconStyles(t),
}));

const RuleGroup = (props) => {
    const classes = useRuleGroupStyles(props);
    const context = React.useContext(Context);

    const { combinator, id, level, rules } = props;
    const testId = `group-${level}`;

    const { dispatch, maxLevels } = context;

    return level <= maxLevels ? (
        <Stack direction='row' sx={{background: level > 0 ? '#f9f9f9' : 'none', pt: 1.3}}>
            {rules?.length > 1 && (
                <Box sx={{py: 3, pl: 4, pr: 1, ml: 1, mb: 1.7}}>
                    <Box sx={{
                        border: '1px solid ' +  (combinator === 'or' ? '#d89989' : '#50858c'),
                        borderRight: 'none',
                        height: '100%',
                        width: '8px',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <Select
                            value={combinator || ''}
                            size='small'
                            onChange={e => {
                                dispatch({ type: 'set-combinator', id, value: e.target.value });
                            }}
                            className={'operator-select ' + combinator}
                        >
                          <MenuItem value='or'>OR</MenuItem>
                          <MenuItem value='and'>AND</MenuItem>
                        </Select>
                    </Box>
                </Box>
            )}
            <Grid
                container
                className={classes.group}
                data-testid={testId}
                direction='column'
                spacing={1}
            >
                {(level === 0 && rules.length < 1) && (
                    <Grid>
                        <Box sx={{px: 4}}>
                            <Tooltip title='Add'>
                                <Button
                                    color='success'
                                    variant='contained'
                                    data-testid={`${testId}-add-rule`}
                                    startIcon={<AddIcon className={classes.actionIcon} />}
                                    onClick={() => {
                                        dispatch({ type: 'add-rule', id, position: 0});
                                    }}
                                >
                                    Add Rule
                                </Button>
                            </Tooltip>
                        </Box>
                    </Grid>
                )}
                {rules?.length > 0 && (
                    <Grid item>
                        <DraggableContainer
                            onDrop={({ addedIndex, removedIndex }) => {
                                dispatch({ type: 'move-rule', addedIndex, id, removedIndex });
                            }}
                        >
                            {rules.map((rule, position) => (
                                <Draggable key={rule.id}>
                                    <Rule
                                        id={rule.id}
                                        groupId={id}
                                        level={level}
                                        position={position + 1}
                                        rule={rule}
                                    />
                                </Draggable>
                            ))}
                        </DraggableContainer>
                    </Grid>
                )}
            </Grid>
        </Stack>
    ) : (
        <span />
    );
};

RuleGroup.defaultProps = {
    combinator: 'and',
    combinators: [
        { label: 'AND', value: 'and' },
        { label: 'OR', value: 'or' },
    ],
    rules: [],
};

RuleGroup.propTypes = {
    combinator: PropTypes.string,
    combinators: PropTypes.array,
    id: PropTypes.number.isRequired,
    level: PropTypes.number.isRequired,
    rules: PropTypes.array,
};

export default RuleGroup;
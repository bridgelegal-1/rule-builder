const operators = [
    {
        label: "equal to",
        value: "===",
        types: ["date", "integer", "number", "radio", "select", "switch", "text"],
    },
    {
        label: "not equal to",
        value: "!==",
        types: ["date", "integer", "number", "radio", "select", "switch", "text"],
    },
    {
        label: "contains / in",
        value: "includes",
        types: ["text", "select", "multiselect"],
    },
    {
        label: "not contain / in",
        value: "!includes",
        types: ["text", "select", "multiselect"],
    },
    {
        label: "less than",
        value: "<",
        types: ["number", "integer"],
    },
    {
        label: "greater than",
        value: ">",
        types: ["number", "integer"],
    },
    {
        label: "less / equal to",
        value: "<=",
        types: ["number", "integer"],
    },
    {
        label: "greater / equal to",
        value: ">=",
        types: ["number", "integer"],
    },
    {
        label: "before than",
        value: "isBefore",
        types: ["date"],
    },
    {
        label: "after than",
        value: "isAfter",
        types: ["date"],
    },
    {
        label: "before / equal to",
        value: "isSame",
        types: ["date"],
    },
    {
        label: "before / equal to",
        value: "isSameOrBefore",
        types: ["date"],
    },
    {
        label: "after / equal to",
        value: "isSameOrAfter",
        types: ["date"],
    },
    {
        label: "is null",
        value: "isNull",
        types: ["date", "integer", "number", "multiselect", "radio", "select", "switch", "text"],
    },
    {
        label: "is not null",
        value: "isNotNull",
        types: ["date", "integer", "number", "multiselect", "radio", "select", "switch", "text"],
    },
];

export default operators;
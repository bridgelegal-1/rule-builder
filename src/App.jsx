import Builder from './components/RuleBuilder';

const c = [
  [
    {key1: 'isClientResident', operator: '===', value2: 'no'},
    {key1: 'disscussWithOtherLawFirm', operator: '===', value2: 'otherFirm#signedRetainer'},
    {key1: 'birthOfClient', operator: 'isBefore', value2:'01/01/1945', unit: 'year', format: 'MM/DD/YYYY', type: 'date'},
    {key1: 'birthOfClient', operator: 'isAfter', value2:'12/31/1998', unit: 'year', format: 'MM/DD/YYYY', type: 'date'},
    {key1: 'obtainMedicalRecords', operator: '===', value2: 'no'}
  ],
  [
    {key1: 'diagnosed#hearingLoss', operator: '===', value2: 'no'},
    {key1: 'diagnosed#tinnitus', operator: '===', value2: 'no', logic: '&&'},
    {key1: 'disablilityRating', operator: '===', value2: 'no', logic: '&&'},
  ],
  [
    {key1: 'disablilityRating', operator: '===', value2: 'yes'},
    {key1: 'diagnosed#hearingLoss', operator: '===', value2: 'no', logic: '&&'},
    {key1: 'diagnosed#tinnitus', operator: '===', value2: 'no', logic: '&&'},
    {key1: 'canProvideVARatingDeterminationLetter', operator: '===', value2: 'no', logic: '&&'}
  ],
  [
    {key1: '12monthsDischarge', operator: '===', value2: 'no'},
    {key1: 'disablilityRating', operator: '===', value2: 'no', logic: '&&'},
  ]
]

const LOGIC_MAP = {
  '&&': 'and',
  '||': 'or'
}

function mapConditions(conditions) {
  const rule = {
    combinator: 'or',
    rules: []
  }
  rule.rules = conditions.map(cond => {
    const {logic, key1, key2, operator, value2, ...ext} = cond;
    rule.combinator = LOGIC_MAP[logic] || 'or';

    if (Array.isArray(cond)) {
      return mapConditions(cond);
    } else {
      return {
        field: key1,
        operator,
        value: key2 || value2,
        ext
      };
    }
  });
  return rule;
}

// Supported type
//  date, multiselect, number, radio, select, switch
function App() {
  return (
    <div className="App">
      <Builder
        debug
        filters={[
          {
              options: [
                  {label: "First Cancer Diagnosed", value: "firstCancerDiagnosed", type: "date"},
                  {label: "Death Date", value: "deathDate", type: "date"},
                  {label: "Age", value: "age", type: "number"},
                  {label: "State", value: "state", type: "multiselect", options: [{label: 'AL', value: 'AL'}, {label: 'BL', value: 'BL'}]},
                  {label: "Radio", value: "radio", type: "radio"},
                  {label: "Select", value: "select", type: "select", options: [{label: 'AL', value: 'AL'}, {label: 'BL', value: 'BL'}]},
                  {label: "Switch", value: "switch", type: "switch"},
              ]
          }
        ]}
        maxLevels={10}
        query={mapConditions(c)}
      />
    </div>
  );
}

export default App;

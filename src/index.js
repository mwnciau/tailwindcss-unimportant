const plugin = require("tailwindcss/plugin");

const unimportant = plugin.withOptions(() =>
    ({ matchVariant }) => {
        matchVariant(
            '-',
            (unimportance) => {
                return ':where(&)'
            },
            {
                values: {
                    DEFAULT: 1,
                    '': 2,
                    '-': 3,
                    '--': 4,
                    '---': 5,
                    '----': 6,
                    '-----': 7,
                    '------': 8,
                    '-------': 9,
                    '--------': 10,
                    1: 1,
                    2: 2,
                    3: 3,
                    4: 4,
                    5: 5,
                    6: 6,
                    7: 7,
                    8: 8,
                    9: 9,
                    10: 10,
                },
                sort(a, z) {
                    const aValue = parseInt(typeof a.value === 'symbol' ? 0 : a.value);
                    const zValue = parseInt(typeof z.value === 'symbol' ? 0 : z.value);

                    return zValue - aValue;
                }
            },
        );
    },
    (options) => ({important: options?.important ?? ':root'})
);

module.exports = unimportant;

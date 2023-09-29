const plugin = require("tailwindcss/plugin");

const unimportant = plugin(
    ({ addVariant }) => {
        addVariant("~", ":where(&)");
    },
    {important: ':root'}
);

module.exports = unimportant;

# `tailwindcss-unimportant`
A [Tailwind CSS] plugin that creates lower-specificity utility classes that can
be used to create components with overridable defaults.

## Installation

```sh
npm install tailwindcss-unimportant
```

Add the `tailwindcss-unimportant` plugin to your `tailwind.config.js` file.

```js
// tailwind.config.js
module.exports = {
  plugins: [require('tailwindcss-unimportant')],
}
```

Note: if you need to specify the `important` option in your tailwind
configuration, you will need to pass it in as an option to the plugin.

```js
// tailwind.config.js
module.exports = {
  plugins: [require('tailwindcss-unimportant')({ important: '[my-custom-selector]' })],
}
```

## Getting started

To make a class unimportant, use the `-:` variant.

```html
<p class="-:font-bold">Hello world</p>
```

These classes will always have lower precedence than classes without the variant.

```php
// The text will have normal or bold weight depending on the order of the
// `font-bold` and `font-normal` classes in the compiled CSS.
<p class="font-bold font-normal">Hello world</p>

// The text will always have normal weight
<p class="-:font-bold font-normal">Hello world</p>
```

This is useful when making components where you want to be able to override the
default classes.

```php
/// paragraph.blade.php
<p {{ 
    $attributes->merge(['class' => '-:text-base -:font-normal'])
}}>
    {{ $slot }}
</p>

/// index.blade.php
// The classes in the paragraph component have lower specificity so we can
// easily override them.
<x-paragraph class="text-lg font-bold">Hello world!</x-paragraph>
```

### Making classes even more unimportant

Sometimes it's useful to extend components within other components, and you can
run into the same problem of clashing Tailwind classes.

This plugin provides additional class variants for up to 10 levels of
unimportance: `--:`, `---:`, `----:`, etc. 

```php
// -:text-blue takes precedence over --:text-green, which takes precedence over
// ---:text-red
<a class="---:text-red --:text-green -:text-blue">
    The link is blue
</a>
```

As the variants become larger, you may prefer to use the number variants, where
the lowest number takes precedence: `--1:`, `--2:`, `--3:`, etc. The number and
symbol variants can be used interchangeably.

```php
// This example is identical to the previous example
<a class="--5:text-red --:text-green --1:text-blue">
    The link is blue
</a>
```

Arbitrary values are also supported. For example, `--[5]:` is equivalent to
`-----:`. Zero and negative values can be used to make classes of higher
precedence.

| Unimportance | Symbolic variant | Numberic variant |
|--------------|------------------|------------------|
| 1            | `-:`             | `--1:`           |
| 2            | `--:`            | `--2:`           |
| 3            | `---:`           | `--3:`           |
| 4            | `----:`          | `--4:`           |
| 5            | `-----:`         | `--5:`           |
| 6            | `------:`        | `--6:`           |
| 7            | `-------:`       | `--7:`           |
| 8            | `--------:`      | `--8:`           |
| 9            | `---------:`     | `--9:`           |
| 10           | `----------:`    | `--10:`          |
| `n`          | _n/a_            | `--[n]:`         |


## How it works

The `-:` variant wraps the selector for a given class in the css `:where()`
function, reducing its [specificity] to `0-0-0`. This means classes you use
without the unimportant variant will be applied preferentially.

```css
/* Specificity of 0-1-0 */
.bg-white

/* Specificity of 0-0-0 */
:where(.-\:bg-white)
```

However, having a specificity of `0-0-0` means that the default tailwind base
rules and any base rules you create will take precedence over the unimportant
classes. In many cases, this makes the unimportant classes useless.

```html
<style>
/* Specificity of 0-0-1 */
a {
    color: blue;
}

/* Specificity of 0-0-0 */
:where(.-\:text-red) {
    color: red;
} 
</style>

<a class="-:text-red">The link is blue</a>
```

To fix this problem, the plugin sets the `important` Tailwind configuration
option to `:root`. This increases the specificity of all Tailwind classes by
0-1-0, meaning our unimportant classes now have a higher specificity than the
base rules.

```html
<style>
/* Specificity of 0-0-1 */
a {
    color: blue;
}

/* Specificity of 0-2-0 */
:root .text-green {
    color: green;
}

/* Specificity of 0-1-0 */
:root :where(.-\:text-red) {
    color: red;
}
</style>

<a class="-:text-red">The link is red</a>
<a class="-:text-red text-green">The link is green</a>
```

### Levels of unimportance

Classes with greater levels of unimportance are output first in the generated
CSS file so that the less unimportant classes take precedence.

```css
/* The more unimportant class is output first */
.--\:bg-white {...}

/* The later CSS rule takes precedence */
.-\:bg-black {...}
```

[Tailwind CSS]: https://github.com/tailwindlabs/tailwindcss
[specificity]: https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity

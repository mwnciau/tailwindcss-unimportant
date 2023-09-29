# `tailwind-unimportant`
A [Tailwind CSS] plugin that creates lower-specificity utility classes that can
be used to create components with overridable defaults.


## Installation

```sh
npm install tailwind-unimportant
```

Add the `tailwindcss-unimportant` plugin to your `tailwind.config.js` file.

```js
// tailwind.config.js
module.exports = {
  plugins: [require('tailwindcss-unimportant')],
}
```

## Getting started

To make a class unimportant, use the `~:` prefix.

```html
<p class="~:font-bold">Hello world</p>
```

These classes will always have lower precedence than classes without the prefix.

```php
// The text will have normal or bold weight depending on the order of the
// `font-bold` and `font-normal` classes in the compiled CSS.
<p class="font-bold font-normal">Hello world</p>

// The text will always have normal weight
<p class="~:font-bold font-normal">Hello world</p>
```

This is useful when making components where you want to be able to override the
default classes.

```php
/// paragraph.blade.php
<p {{ 
    $attributes->merge(['class' => '~:text-base ~:font-normal ~:text-grey-800'])
}}>
    {{ $slot }}
</p>

/// index.blade.php
// The classes in the paragraph component have lower specificity so we can
// easily override them.
<x-paragraph class="text-lg font-bold">Hello world!</x-paragraph>
```

## How it works

The `~:` prefix wraps the selector for a given class in the css `:where()`
function, reducing its [specificity] to `0-0-0`. This means classes you use
without the unimportant prefix will be applied preferentially.

```css
/* Specificity of 0-1-0 */
.bg-white

/* Specificity of 0-0-0 */
:where(.\~\:bg-white)
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
:where(.\~\:text-red) {
    color: red;
} 
</style>

<a class="~:text-red">The link is blue</a>
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
:root :where(.\~\:text-red) {
    color: red;
}
</style>

<a class="~:text-red">The link is red</a>
<a class="~:text-red text-green">The link is green</a>
```

[Tailwind CSS]: https://github.com/tailwindlabs/tailwindcss
[specificity]: https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity

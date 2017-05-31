# jquery-slideshow

A simple plugin that does just enough to create a basic, responsive slideshow from a number of elements.  As far as possible, styling is left up to you.

## Instructions

- Wrap a number of elements - "slides" - to form a "deck".
- Give each of the slides a background colour.
- Call `.slideshow()` on the deck.

Take a look at `tests/index.html` to see jquery-slideshow in action.

## Options

| Name | Default Value | Description |
|-|-|-|
| `delay` | `7000` | How long, in milliseconds, each slide is on show before the next one is displayed. |
| `width` | `"max-content"` | The width of the deck and each slide.  Any valid width or one of these special string values can be used: `"max-content"` makes the deck the same width as the widest slide; `"auto"` causes the browser to make the decision. |
| `height` | `"max-content"` | The height of the deck and each slide.  Any valid height or one of these special string values can be used: `"max-content"` makes the deck the same height as the tallest slide; `"auto"` causes the browser to make the decision. |
| `stopOnHover` | `true` | By default, the slideshow will stop when the cursor enters the deck. |

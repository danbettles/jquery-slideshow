# jquery-slideshow

A simple plugin that does just enough to create a very basic slideshow from a number of elements.  Styling - as far as possible - is left up to you.

## Instructions

- Wrap a number of elements - "slides" - to form a "deck".  Call `.slideshow()` on the deck.
- Give the slide elements a background colour.

Take a look at `tests/index.html` to see an example usage.

## Notes

- Each slide is given the same width as the deck.
- The deck and all slides are given the same height: the height of the tallest slide.
- Styles are recalculated when the window is resized.

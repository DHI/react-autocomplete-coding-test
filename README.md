# React Autocomplete Coding Test

## Description

The component should provide suggestions as a user starts typing in a text input. The suggestions will be placed in a dropdown and allowing the user to select one of them to complete the input's value.

## Requirements

- Use the REST API `https://countries.eu` for fetching and filtering the suggestions via the query parameter `q`.

- Each dropdown item must be wrapped into a div with class `"item"`.

- The dropdown must be present in the DOM only if the input is not empty.

- When the fetch is running, show a loader by appending a `loader` class to the `Autocomplete` div.

- If the fetch returns an empty result show the message "Country not found!" in an item div appending a class `"notFound"`

- Add the prop `onSelect` to the component and call it when the user clicks an item in the dropdown. Update the input's value to reflect the user's selection.

- Use the lodash `debounce` function to prevent triggering the fetch when the user is typing.

- Don't show intermediate fetch results if they are not relevant with the final current input value.

- If the first API returns an empty result or fails, try with this second API `https://countries2.eu`. If this one fails, log an error in console with the message `"Error fetching countries!"`.

- The second API can return a result with duplicate values, so prevent to show them up twice in the dropdown.

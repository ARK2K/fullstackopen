Exercise 0.6

```mermaid
sequenceDiagram
    participant browser
    participant server
    browser->>server: sends user input when save button in form is clicked
    server->>browser: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
```

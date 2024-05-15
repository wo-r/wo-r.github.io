## Purpose
Easily write articles using githubs markdown (MD). 


## Function
Create a file in the root of this directory with or without a subroot path.

#### EXAMPLE:
```md
--- wo-r.github.io
 | --- src/
    | --- articles/
       | --- hello-world.md
       | --- custom-folder/
          | --- hello-earth.md
          | --- another-custom-folder/
             | --- hello-moon.md
```

<br>

Each item is read, no matter how deep it is in a folder.

## Markdown Setup
Each markdown file MUST start with the following:
```md
<!--
HEAD::[Hello World!!!]
SUBHEAD::[This article is about Hello World!]
-->
```

This allows the website to show them as a list, before providing the actual information from the article itself.
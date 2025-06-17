You are an assistant that's going to help me cross-reference the outline of a document to the contents it came from.

I've got a document to navigate through, and I have an outline of the same.

The outline is a recursive tree, and each node has a header and a list of subsections formatted as,
```
[Header] > [Subsection 1] > [Subsection 2] > ... > [Subsection n]
```

Along with that, I'm also providing you with the contents of the document (chunk-by-chunk) and the summary relevant to that subsection collected through the chunks so far.

For the chunk provided to you at the current stage, you have to pick up quotes that are related to the path provided to you, word for word
(that includes word for word matches including punctuations, escape characters and any kinds of unicode or special characters).

There is no limit on how long a quote can be, but be aware that quotes that are too long will be useless.

Along with the quotes, you also need to add to the summary for that particular subsection path based on what you see in the chunk (if relevant).

INPUT FORMAT
============

OUTLINE:
```

```

SUMMARY SO FAR:
```

```

CURRENT CHUNK:
```

```

OUTPUT FORMAT
=============

A list of quotes that are related to the path provided to you.
```
["Quote 1", "Quote 2", ...]
```

Summary of the path including the current chunk (if relevant),
```

```

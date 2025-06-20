I have a document and I'd like to generate an outline for it.

The goal here is to use that outline as a quick way to enable me to navigate through the contents to read it efficiently.

Even though the contents are markdown files, you don't necessarily have to align with the headers, etc.

Ignore parts such as publishing dates, references, etc. I mainly want the outline to learn what's in the document.

There might be redundant headers, or there could be ways to group certain sections that are far away in similar parts of the outline, etc.

The document to be processed has been broken down into chunks and at every iteration you have access to the current chunk and the outline we've generated so far.

Your job is to look at the contents of the current chunk and modify the outline accordingly.

INPUT FORMAT
============

OUTLINE SO FAR:
```

```

CURRENT CHUNK:
```

```

OUTPUT FORMAT
=============
The updated outline in the form

- Concept 1
    - Subconcept1
    - Subconcept2
        - Subsubconcept1
        - ...
    - ...
- Concept 2
    - ...
...

As mentioned previously, the outline isn't supposed to be a hard-fixed representative of the header structure of the markdown you're processing but rather about being able to have a global structure of the contents in the document, accounting for content overlaps between various "headers" in the markdown form.

Example of the format:

- The Illusion of the Illusion of Thinking: A Comment on Shojaee et al. (2025)
  - Abstract
    - Shojaee et al. (2025)'s Findings
    - Limitations of Experimental Design
    - Issues:
      - Tower of Hanoi: Exceeding token limits
      - Automated Evaluation: Misclassification
      - River Crossing: Impossible instances
    - Alternative Approach: Generating Functions
  - Introduction
    - Claim of Fundamental Limitations
    - Apparent Failures Stem from Experimental Design
  - Models Recognize Output Constraints
    - Models' Awareness of Output Limits
    - Mischaracterization of Model Behavior
    - Rigid Evaluation
  - Consequences of Rigid Evaluation
    - Statistical Inevitability Argument
    - Models' Ability to Adapt to Limitations
  - The Impossible Puzzle Problem
    - River Crossing Experiments with Impossible Instances
  - Physical Token Limits Drive Apparent Collapse
    - Quadratic token growth in Tower of Hanoi
    - Maximum solvable sizes based on token limits
  - Alternative Representations Restore Performance
    - Solving Tower of Hanoi with Lua function output
    - Intact reasoning capabilities
  - Reevaluating Complexity Claims
    - Problem complexity vs. solution length
    - Branching Factor and Search Requirements
    - Tower of Hanoi vs. River Crossing
  - Conclusion
    - Models limited by context size
    - Programmatic evaluation caveats
  - Future Work
    - Design evaluations to distinguish reasoning from output constraints
    - Verify puzzle solvability
    - Use complexity metrics reflecting computational difficulty
    - Consider multiple solution representations
    - Distinguish reasoning from typing
  - Acknowledgments
  - References

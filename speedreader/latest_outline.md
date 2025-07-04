- Circuit Tracing: Revealing Computational Graphs in Language Models
  - Introduction: Mechanistic Interpretability, Identifying Features, Describing Processes/Circuits, Sparse Coding Models.
  - Building an Interpretable Replacement Model
    - Architecture: Cross-Layer Transcoder (CLT), JumpReLU, Training.
    - From CLT to Replacement Model: Substituting CLT Features for MLP Neurons.
    - Local Replacement Model: Substituting CLT for MLP Layers, Attention Patterns, Error Adjustment, Feature Interactions.
  - Attribution Graphs
    - Constructing an Attribution Graph: Output, Intermediate, Input, Error Nodes.
    - Learning, Understanding, Grouping Features, Validating, Localizing.
  - Case Studies: Factual Recall, Addition
    - Taxonomy of Features: Computational Role, Condition Properties.
  - Global Weights
    - Context Independent vs Dependent.
    - Residual-Direct, Attention-Direct, Indirect Influence.
    - Expected Residual Attribution, Target-Weighted ERA (TWERA).
  - Evaluations: Interpretability, Sufficiency, Mechanistic faithfulness.
  - Cross-Layer Transcoder Evaluation: Qualitative, Quantitative.
  - Attribution Graph Evaluation: Node Influence, Path Length, Graph Completeness, Graph Pruning.
  - Evaluating Mechanistic Faithfulness: Node-Logit, Feature-Feature Influence, Local Replacement Model.
  - Biology
  - Limitations
    - Missing Attention Circuits: Induction, Multiple-Choice.
    - Reconstruction Errors & Dark Matter.
    - Inactive Features & Inhibitory Circuits.
    - Graph Complexity, Abstraction Level, Global Circuits.
  - Discussion
    - Reverse Engineering Approach, Robust Choices.
    - Choices Made For Convenience: Attention Paths, QK-Circuits, Sparsity Penalty.
    - Advances in Replacement Model Paradigm.
  - Coda: The lessons of addition: Heuristics, Parallel Pathways.
  - Related Work
    - Feature Discovery: Sparse Dictionary Learning, Transcoders.
    - Circuit Discovery: Definitions, Manual/Automatic Analysis, Attention Circuits, Replacement Models, Circuit Evaluation.
  - Circuit Biology & Phenomenology
  - Acknowledgments, Author Contributions, Citation Information
  - CLT Implementation Details: Compute, ML, Engineering, Efficiency.
  - Attribution Graph Computation, Graph Pruning (Node/Edge)
  - Nuances of Steering with Cross-Layer Features
  - Unexplained Variance and Choice of Steering Factors
  - Similar Features and Supernodes, Iterative Patching, Details of Interventions, Notes on the Interface
  - Residual Stream Norms Growth, Interference Weights, Number Output Weights
  - Comparison of Addition Features, Additional Evaluation Details, Prompt and Graph Lists
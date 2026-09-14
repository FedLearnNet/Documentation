---
id: us-130-hackathon-d
title: "Hackathon D: Wrapping Up"
sidebar_position: 6
---

# Wrapping Up

You have now walked through the complete federated learning workflow: from starting the platform, understanding the data,
developing an app, harmonizing local clinic data, creating a project, starting a federated run, and reviewing the outputs.

The most important lesson is not only how to click through the platform. The central idea is that federated learning is a
structured way to perform data science when data cannot simply be copied into one central place.

:::tip
Federated learning is about more than model training. It combines data governance, harmonization, local execution,
privacy-aware communication, reproducible app development, and result interpretation.
:::

---

## What You Should Take Away

After this hackathon, you should be able to explain:

- why biomedical data often needs to stay local,
- how federated learning differs from centralized learning,
- why harmonization is necessary before training,
- how a connector, dataset, project, and app work together,
- why app containers must be reproducible,
- why metrics and model artifacts need to be reviewed carefully,
- where privacy risks can still exist even if raw data never leaves the clinic.

---

## Reflection Questions

Use these questions for discussion in your group:

1. Which part of the workflow was easiest to understand?
2. Which part felt most confusing or fragile?
3. Where did you see the strongest difference between centralized and federated learning?
4. What information does an app need in order to train reproducibly?
5. What could go wrong if the connector mapping is incorrect?
6. Which metric would you trust most for the US-130 readmission task, and why?
7. What privacy risks remain even when only model updates or metrics are shared?
8. How would you improve the app if you had one more day?

---

## Feedback Questions

Please give short, honest feedback:

1. Was the tutorial understandable for your background level?
2. Were the explanations too short, too long, or about right?
3. Which walkthrough needs more screenshots or clearer wording?
4. Which concept should be explained earlier?
5. Which setup step caused the most problems?
6. Did the balance between theory and hands-on work feel right?
7. What should be added before the next hackathon?

---

## Final Thought

A successful federated learning project is not only a working model. It is a complete, auditable workflow where data
ownership, semantic meaning, execution logic, privacy assumptions, and results are all explicit.

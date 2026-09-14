---
id: us-130-hackathon-agg
title: "Hackathon 0: How to Aggregate"
sidebar_position: 2
---

# How to Aggregate Federated Models

Federated learning is often introduced with one sentence:

> Each client trains locally, and the server averages the results.

That sentence is useful, but it hides the interesting part. An aggregator is not just a technical helper. It defines what
the global result means.

For the US-130 readmission task, this question appears quickly:

- If each clinic trains a logistic regression model, can we average the coefficients?
- If each clinic trains an SVM, what should be sent back?
- If each clinic trains a tree, does averaging even make sense?
- If each clinic trains a neural network, do we average weights, gradients, or something else?
- What if one clinic has 10 times more rows than another?
- What if a client sends a broken or malicious update?

This page gives you the mental model, the mathematics, and small FLNet-style aggregator drafts.

:::warning
The implementation snippets on this page are teaching sketches. They show the shape of an aggregator, not a production
implementation. Real aggregators need schema validation, numerical checks, privacy review, model compatibility checks,
logging, error handling, and tests against failed or adversarial clients.
:::

---

## 1. The Aggregation Contract

In FLNet, an aggregator implements this interface:

```python
from abc import ABC, abstractmethod
from typing import Any, Optional

from pyfedappwrap.engine.federated import FLNetMessageMetaDTO


class AppAggregator(ABC):
    @abstractmethod
    def aggregate(
        self,
        data: list[Any],
        n_clients: int,
        meta: Optional[FLNetMessageMetaDTO] = None,
    ) -> Any:
        """
        Aggregate client payloads into a single result.
        """
        raise NotImplementedError
```

The client payloads in `data` can be almost anything:

| Payload type | Example |
|---|---|
| Model parameters | Logistic regression coefficients, neural-network weights |
| Model deltas | `local_model - previous_global_model` |
| Gradients | SVM or neural-network gradients |
| Sufficient statistics | Counts, sums, histogram bins, gradient/Hessian sums |
| Model fragments | Local trees, candidate splits, feature importances |
| Metrics | Local AUC, loss, sample count |

The aggregator must know what it receives. Averaging a vector is easy. Averaging a decision tree is usually meaningless.

The `meta` object carries communication context. In the current FLNet DTO it has this shape:

```python
class FLNetMessageMetaDTO(FLNetBaseDTO):
    communication_id: Optional[str] = None
    epoch: Optional[int] = None
    round: Optional[int] = None
    aggregator: str = "default"
    extras: dict[str, Any] = Field(default_factory=dict)
```

Use it like this:

| Field | Meaning for an aggregator |
|---|---|
| `communication_id` | Identifies the message group. All clients in the same aggregation step should use the same value. |
| `epoch` | Optional outer training epoch. Useful if one communication round is nested inside a larger local training loop. |
| `round` | Optional federated round number, for example `1`, `2`, `3`. |
| `aggregator` | Name of the registered aggregator selected by the client, such as `"mean"` or `"median"`. |
| `extras` | Free-form metadata, for example model version, tensor names, clipping norm, or client-side preprocessing version. |

In normal use, the engine has already routed the message to the selected aggregator before your `aggregate` method runs.
Inside the aggregator, `meta.aggregator` is mostly useful for logging and traceability.

The aggregator should not rely on `meta` for scientific values such as `n_samples`; those belong in the client payload so
they are explicit and can be validated.

---

## 2. The General Mathematical Form

Assume there are `K` clients. Client `k` has `n_k` rows and local empirical objective:

$$
F_k(\theta) = \frac{1}{n_k}\sum_{i=1}^{n_k} \ell(\theta; x_{ki}, y_{ki})
$$

The global objective is usually written as:

$$
F(\theta) = \sum_{k=1}^{K} p_k F_k(\theta)
$$

with weights:

$$
p_k = \frac{n_k}{\sum_{j=1}^{K} n_j}
$$

The symbol `theta` means "the thing being learned." For logistic regression it is a coefficient vector. For a neural
network it is a large set of tensors. For a tree ensemble it may not be a vector at all.

The simplest aggregator receives one local model `theta_k` from each client and computes:

$$
\theta_{\text{global}} = \sum_{k=1}^{K} p_k \theta_k
$$

This is the core idea behind **Federated Averaging (FedAvg)**:

- paper: [Communication-Efficient Learning of Deep Networks from Decentralized Data](https://arxiv.org/abs/1602.05629)

FedAvg is the baseline. It is not the whole field.

---

## 3. Aggregation Strategies

### Weighted mean / FedAvg

Use when all clients train the same model architecture and all updates have the same shape.

Client sends:

```text
{
  "n_samples": n_k,
  "parameters": theta_k
}
```

Aggregator computes:

$$
\theta^{t+1} = \sum_k \frac{n_k}{n}\theta^{t+1}_k
$$

This is good for a first logistic regression or neural-network baseline. It is weak when data is strongly non-IID or when
some clients are unreliable.

### Delta averaging

Sometimes clients send an update instead of a full model:

$$
\Delta_k = \theta_k^{t+1} - \theta^t
$$

The server aggregates:

$$
\Delta = \sum_k p_k \Delta_k
$$

and updates:

$$
\theta^{t+1} = \theta^t + \Delta
$$

This is mathematically equivalent to parameter averaging if all clients started from the same `theta^t`, but it makes
server-side optimizers easier to implement.

### Server-side adaptive optimization: FedAdagrad, FedAdam, FedYogi

FedAvg applies the average update directly. **FedOpt** treats the aggregated client update as a pseudo-gradient and runs
an optimizer on the server.

Let:

$$
g_t = -\sum_k p_k \Delta_k
$$

For FedAdam:

$$
m_t = \beta_1 m_{t-1} + (1-\beta_1)g_t
$$

$$
v_t = \beta_2 v_{t-1} + (1-\beta_2)g_t^2
$$

$$
\theta_{t+1} = \theta_t - \eta \frac{m_t}{\sqrt{v_t} + \tau}
$$

This can stabilize training when client updates have very different scales.

- paper: [Adaptive Federated Optimization](https://arxiv.org/abs/2003.00295)

### FedProx

FedProx changes the **client objective**, not the aggregator shape. Each client minimizes:

$$
F_k(\theta) + \frac{\mu}{2}\|\theta - \theta^t\|^2
$$

The extra term discourages the local model from drifting too far away from the current global model. The aggregator can
still be weighted averaging:

$$
\theta^{t+1} = \sum_k p_k \theta_k^{t+1}
$$

FedProx is useful when clients have heterogeneous data or uneven compute budgets.

- paper: [Federated Optimization in Heterogeneous Networks](https://proceedings.mlsys.org/paper_files/paper/2020/hash/1f5fe83998a09396ebe6477d9475ba0c-Abstract.html)

### SCAFFOLD

SCAFFOLD uses control variates to reduce client drift. The server stores a global correction vector `c`, and each client
stores a local correction vector `c_k`. Local training is corrected by a term such as:

$$
\nabla F_k(\theta) - c_k + c
$$

Clients send both model updates and control-variate updates. The aggregator combines both:

$$
\Delta_\theta = \sum_k p_k \Delta_{\theta,k}
$$

$$
\Delta_c = \frac{1}{K}\sum_k \Delta_{c,k}
$$

Then:

$$
\theta^{t+1} = \theta^t + \Delta_\theta
$$

$$
c^{t+1} = c^t + \Delta_c
$$

- paper: [SCAFFOLD: Stochastic Controlled Averaging for Federated Learning](https://arxiv.org/abs/1910.06378)

### Robust aggregation

A mean is sensitive to extreme values. If a client sends a corrupted update, the mean can move strongly in the wrong
direction. Robust aggregators try to reduce the influence of outliers.

Common choices:

| Strategy | Formula idea | When useful |
|---|---|---|
| Coordinate-wise median | Take the median per coordinate | Outlier resistance, simple vectors |
| Trimmed mean | Drop largest/smallest values per coordinate, then average | Outlier resistance with enough clients |
| Geometric median | Find the point minimizing weighted distances to client updates | Robust vector aggregation |
| Krum / Multi-Krum | Select update(s) closest to other updates | Byzantine-robust settings |

Coordinate-wise median:

$$
\theta_j = \operatorname{median}(\theta_{1j}, \ldots, \theta_{Kj})
$$

Trimmed mean with trimming fraction `q`:

$$
\theta_j = \operatorname{mean}(\text{middle values of } \theta_{1j}, \ldots, \theta_{Kj})
$$

Useful references:

- Krum: [Machine Learning with Adversaries: Byzantine Tolerant Gradient Descent](https://papers.neurips.cc/paper_files/paper/2017/hash/f4b9ec30ad9f68f89b29639786cb62ef-Abstract.html)
- Median and trimmed mean: [Byzantine-Robust Distributed Learning: Towards Optimal Statistical Rates](https://arxiv.org/abs/1803.01498)
- Geometric median / RFA: [Robust Aggregation for Federated Learning](https://arxiv.org/abs/1912.13445)

---

## 4. Aggregation by Model Family

### Linear and logistic regression

Linear and logistic regression learn a coefficient vector and an intercept:

$$
\theta = (\beta, b)
$$

For logistic regression:

$$
P(y=1\mid x) = \sigma(\beta^\top x + b)
$$

where:

$$
\sigma(z)=\frac{1}{1+e^{-z}}
$$

If every client uses the same feature space, a draft aggregator can compute:

$$
\beta = \sum_k p_k \beta_k,\quad b = \sum_k p_k b_k
$$

This is exactly what the example US-130 federated app does for logistic regression coefficients.

This is a useful baseline, but it is not mathematically identical to fitting one logistic regression model on one pooled
central dataset. Local solvers, regularization, feature distributions, and class imbalance can all change the result.

Important conditions:

- Every client must use the same feature names and encoding.
- One-hot columns must be aligned.
- Intercepts must be aggregated too.
- `n_samples` should usually determine the weight.

Reference for model averaging in logistic regression. This paper is not FL-specific, but it is useful background for the
idea that averaging fitted logistic models has statistical consequences:

- [An improved model averaging scheme for logistic regression](https://doi.org/10.1016/j.jmva.2009.01.006)

Draft FLNet aggregator:

```python
from typing import Any, Optional

import numpy as np
from pyfedappwrap.engine.federated import AppAggregator, FLNetMessageMetaDTO


class LinearCoefficientAggregator(AppAggregator):
    """Teaching draft: weighted average for aligned linear-model coefficients."""

    def aggregate(
        self,
        data: list[Any],
        n_clients: int,
        meta: Optional[FLNetMessageMetaDTO] = None,
    ) -> dict[str, Any]:
        total = sum(int(p["n_samples"]) for p in data)
        coef_sum: dict[str, float] = {}
        intercept_sum = 0.0

        for payload in data:
            weight = int(payload["n_samples"]) / total
            intercept_sum += weight * float(payload["intercept"])
            for name, value in payload["coef"].items():
                coef_sum[name] = coef_sum.get(name, 0.0) + weight * float(value)

        return {
            "coef": coef_sum,
            "intercept": intercept_sum,
            "communication_id": meta.communication_id if meta else None,
            "epoch": meta.epoch if meta else None,
            "round": meta.round if meta else None,
            "aggregator": meta.aggregator if meta else None,
        }
```

### Support Vector Machines

For a linear SVM, the primal objective is often written as:

$$
\min_{w,b}\; \frac{1}{2}\|w\|^2 + C\sum_i \max(0, 1-y_i(w^\top x_i+b))
$$

For federated SVMs, there are two common approaches:

1. Send gradients or parameter deltas from local SGD on the hinge-loss objective.
2. Send local linear SVM parameters and aggregate them as vectors.

For a simple linear SVM draft:

$$
w = \sum_k p_k w_k,\quad b = \sum_k p_k b_k
$$

For kernel SVMs, naive parameter averaging is usually not enough because the model depends on support vectors. Sharing
support vectors may leak data. In that case, gradient-based, primal linear, or privacy-preserving protocols are easier to
teach and implement.

As with logistic regression, averaging local linear SVM parameters is a practical baseline, not a guarantee that you get
the same solution as centralized SVM training.

Reference:

- [PolyFLAG_SVM: a Polymorphic Federated Learning Aggregation of Gradients Support Vector Machines Framework](https://doi.org/10.1016/j.procs.2023.09.021)

Draft FLNet aggregator:

```python
class LinearSVMAggregator(AppAggregator):
    """Teaching draft: aggregate linear SVM weights. Not for kernel SVMs."""

    def aggregate(
        self,
        data: list[Any],
        n_clients: int,
        meta: Optional[FLNetMessageMetaDTO] = None,
    ) -> dict[str, Any]:
        total = sum(p["n_samples"] for p in data)
        w = None
        b = 0.0

        for payload in data:
            weight = payload["n_samples"] / total
            local_w = np.asarray(payload["weights"], dtype=float)
            w = weight * local_w if w is None else w + weight * local_w
            b += weight * float(payload["bias"])

        return {
            "weights": w.tolist(),
            "bias": b,
            "round": meta.round if meta else None,
        }
```

### Decision trees and random forests

Trees are different. A tree is a discrete structure:

```text
if age < 65:
    go left
else:
    go right
```

You usually cannot average two trees:

$$
\frac{\text{tree}_1 + \text{tree}_2}{2}
$$

does not define a valid decision tree.

There are three practical strategies:

| Strategy | What clients send | What aggregator does |
|---|---|---|
| Ensemble union | Local trees | Builds a global forest from all local trees |
| Vote/probability averaging | Local predictions | Averages predicted probabilities or votes |
| Histogram-based boosting | Split histograms, gradient sums, Hessian sums | Chooses global splits without raw rows |

For an ensemble union:

$$
P(y=1\mid x) = \sum_k \alpha_k \left(\frac{1}{T_k}\sum_{t=1}^{T_k} h_{kt}(x)\right)
$$

where `h_kt` is a tree prediction and `alpha_k` may be proportional to `n_k`.

For gradient boosting, clients can send binned sufficient statistics. For a candidate split, each side has gradient sum
`G` and Hessian sum `H`. A typical split gain is:

$$
\text{Gain} =
\frac{1}{2}\left[
\frac{G_L^2}{H_L+\lambda}
+\frac{G_R^2}{H_R+\lambda}
-\frac{(G_L+G_R)^2}{H_L+H_R+\lambda}
\right] - \gamma
$$

The aggregator sums the clients' `G` and `H` values per candidate split, computes the gain, and picks the best split.
These statistics are less revealing than raw rows, but they can still leak information in small cohorts or rare bins, so
real systems combine this with privacy thresholds, binning rules, secure aggregation, or other protections.

References:

- Random forests: [A collaborative ensemble construction method for federated random forest](https://doi.org/10.1016/j.eswa.2024.124742)
- Boosted trees: [SecureBoost: A Lossless Federated Learning Framework](https://arxiv.org/abs/1901.08755)

Draft FLNet aggregator for a forest union:

```python
class ForestUnionAggregator(AppAggregator):
    """Teaching draft: create one global forest by collecting local trees."""

    def aggregate(
        self,
        data: list[Any],
        n_clients: int,
        meta: Optional[FLNetMessageMetaDTO] = None,
    ) -> dict[str, Any]:
        total = sum(p["n_samples"] for p in data)
        forest = []

        for payload in data:
            client_weight = payload["n_samples"] / total
            trees = payload["trees"]
            tree_weight = client_weight / max(len(trees), 1)
            for tree in trees:
                forest.append({"tree": tree, "weight": tree_weight})

        return {"forest": forest}
```

Draft FLNet aggregator for one boosting split. This is still simplified: it assumes the clients already use the same
candidate split bins and send left/right gradient-Hessian sums for each candidate.

```python
class BoostingSplitAggregator(AppAggregator):
    """Teaching draft: aggregate split histograms and choose one split."""

    def aggregate(
        self,
        data: list[Any],
        n_clients: int,
        meta: Optional[FLNetMessageMetaDTO] = None,
    ) -> dict[str, Any]:
        # payload["candidates"] maps "feature:bin" to:
        # {"g_left": ..., "h_left": ..., "g_right": ..., "h_right": ...}
        totals: dict[str, dict[str, float]] = {}

        for payload in data:
            for key, stats in payload["candidates"].items():
                slot = totals.setdefault(
                    key,
                    {"g_left": 0.0, "h_left": 0.0, "g_right": 0.0, "h_right": 0.0},
                )
                for name in slot:
                    slot[name] += float(stats[name])

        def gain(stats: dict[str, float]) -> float:
            lam = 1.0
            gamma = 0.0
            gl, hl = stats["g_left"], stats["h_left"]
            gr, hr = stats["g_right"], stats["h_right"]
            parent = (gl + gr) ** 2 / (hl + hr + lam)
            left = gl ** 2 / (hl + lam)
            right = gr ** 2 / (hr + lam)
            return 0.5 * (left + right - parent) - gamma

        best_key = max(totals, key=lambda key: gain(totals[key]))
        return {
            "best_split": best_key,
            "gain": gain(totals[best_key]),
            "stats": totals[best_key],
        }
```

### Deep learning

Deep learning models are usually parameter tensors:

$$
\theta = \{W_1, b_1, W_2, b_2, \ldots\}
$$

FedAvg applies the same idea as linear models, but tensor by tensor:

$$
\theta_l = \sum_k p_k \theta_{k,l}
$$

for every layer or parameter tensor `l`.

Deep models often need more care than linear models:

- All clients must use the same architecture.
- Tensor names and shapes must match.
- BatchNorm statistics may need special handling.
- Non-floating tensors, optimizer state, and local preprocessing state must be handled deliberately.
- Non-IID data can cause client drift.
- Large models create communication overhead.

Useful strategies:

| Strategy | What changes |
|---|---|
| FedAvg | Average each tensor |
| FedOpt / FedAdam | Server applies adaptive optimizer to average update |
| FedProx | Clients train with proximal penalty |
| SCAFFOLD | Clients and server exchange correction vectors |
| Robust layer-wise aggregation | Median, trimmed mean, or norm clipping per tensor |

Reference:

- [Communication-Efficient Learning of Deep Networks from Decentralized Data](https://arxiv.org/abs/1602.05629)
- [Adaptive Federated Optimization](https://arxiv.org/abs/2003.00295)

Draft FLNet aggregator:

```python
class StateDictFedAvgAggregator(AppAggregator):
    """Teaching draft: weighted FedAvg for a PyTorch-like state_dict."""

    def aggregate(
        self,
        data: list[Any],
        n_clients: int,
        meta: Optional[FLNetMessageMetaDTO] = None,
    ) -> dict[str, Any]:
        total = sum(p["n_samples"] for p in data)
        result: dict[str, np.ndarray] = {}

        for payload in data:
            weight = payload["n_samples"] / total
            for name, tensor in payload["state_dict"].items():
                arr = np.asarray(tensor, dtype=float)
                result[name] = weight * arr if name not in result else result[name] + weight * arr

        return {
            "state_dict": {name: value.tolist() for name, value in result.items()},
            "communication_id": meta.communication_id if meta else None,
            "round": meta.round if meta else None,
        }
```

Draft FedAdam-style server update:

```python
class FedAdamDeltaAggregator(AppAggregator):
    """Teaching draft: aggregate deltas and apply a server-side Adam step.

    This omits bias correction and several details from production FedAdam.
    """

    def __init__(self, lr: float = 0.01, beta1: float = 0.9, beta2: float = 0.99):
        self.lr = lr
        self.beta1 = beta1
        self.beta2 = beta2
        self.m: dict[str, np.ndarray] = {}
        self.v: dict[str, np.ndarray] = {}
        self.theta: dict[str, np.ndarray] = {}

    def aggregate(
        self,
        data: list[Any],
        n_clients: int,
        meta: Optional[FLNetMessageMetaDTO] = None,
    ) -> dict[str, Any]:
        if not self.theta:
            # Teaching shortcut: in a real app, the server/global state should be
            # managed explicitly. Here the first payload carries the current state.
            self.theta = {
                name: np.asarray(value, dtype=float)
                for name, value in data[0]["base_state"].items()
            }

        total = sum(p["n_samples"] for p in data)
        delta: dict[str, np.ndarray] = {}

        for payload in data:
            weight = payload["n_samples"] / total
            for name, value in payload["delta"].items():
                arr = np.asarray(value, dtype=float)
                delta[name] = weight * arr if name not in delta else delta[name] + weight * arr

        for name, avg_delta in delta.items():
            grad = -avg_delta
            self.m[name] = self.beta1 * self.m.get(name, np.zeros_like(grad)) + (1 - self.beta1) * grad
            self.v[name] = self.beta2 * self.v.get(name, np.zeros_like(grad)) + (1 - self.beta2) * (grad * grad)
            self.theta[name] = self.theta[name] - self.lr * self.m[name] / (np.sqrt(self.v[name]) + 1e-8)

        return {
            "state_dict": {name: value.tolist() for name, value in self.theta.items()},
            "round": meta.round if meta else None,
        }
```

---

## 5. Robust Aggregator Drafts

For a small clinical hackathon, robust aggregation is usually a discussion topic rather than the first implementation.
Still, it is important to know what the code shape looks like.

Coordinate-wise median:

```python
class MedianVectorAggregator(AppAggregator):
    """Teaching draft: robust coordinate-wise median for equal-shaped vectors."""

    def aggregate(
        self,
        data: list[Any],
        n_clients: int,
        meta: Optional[FLNetMessageMetaDTO] = None,
    ) -> dict[str, Any]:
        vectors = np.stack([np.asarray(p["vector"], dtype=float) for p in data])
        return {
            "vector": np.median(vectors, axis=0).tolist(),
            "round": meta.round if meta else None,
        }
```

Trimmed mean:

```python
class TrimmedMeanVectorAggregator(AppAggregator):
    """Teaching draft: remove extreme coordinate values before averaging."""

    def __init__(self, trim: int = 1):
        self.trim = trim

    def aggregate(
        self,
        data: list[Any],
        n_clients: int,
        meta: Optional[FLNetMessageMetaDTO] = None,
    ) -> dict[str, Any]:
        values = np.sort(np.stack([np.asarray(p["vector"], dtype=float) for p in data]), axis=0)
        if len(values) <= 2 * self.trim:
            raise ValueError("Not enough client updates for this trim value.")
        kept = values[self.trim : len(values) - self.trim]
        return {
            "vector": kept.mean(axis=0).tolist(),
            "round": meta.round if meta else None,
        }
```

These are not magic shields. Robust aggregation assumes enough honest clients and compatible update distributions. In
small networks with only two or three clinics, robust methods can easily throw away too much information.

---

## 6. Choosing an Aggregator for the US-130 Hackathon

For this hackathon, use this decision path:

| Model | Recommended first aggregator | Why |
|---|---|---|
| Logistic regression | Weighted coefficient average | Simple, inspectable, works with aligned columns |
| Linear SVM | Weighted weight/bias average or gradient average | Same vector shape as linear regression |
| Random forest | Ensemble union or prediction averaging | Trees are structures, not vectors |
| Gradient-boosted trees | Histogram / gradient-Hessian aggregation | Split finding uses sufficient statistics |
| Neural network | FedAvg over `state_dict` | Standard baseline |
| Heterogeneous clients | FedProx or FedOpt discussion | More stable than plain averaging in many settings |
| Outlier or attack scenario | Median / trimmed mean / Krum discussion | Mean is fragile |

For the US-130 logistic-regression baseline, the best first aggregator is:

$$
\beta = \sum_k \frac{n_k}{n}\beta_k,\quad b = \sum_k \frac{n_k}{n}b_k
$$

That is enough to teach the main idea:

1. clients keep rows local,
2. clients send a small model payload,
3. the aggregator combines compatible payloads,
4. the result becomes the next global model.

Once that works, the scientific question becomes more interesting than the code:

> Is the global model actually better, fairer, more stable, or more useful than the local models?

That is the real aggregation question.

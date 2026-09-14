---
title: Security model
sidebar_position: 6
---

# Security model

This document explains the trust and security model behind an FL-Net deployment: what is verified, by whom, what each party has to trust the other with, and what is deliberately left as a manual decision rather than an automatic one.

It is written primarily for **the IT team operating a Client** — the party that holds patient-level data and therefore carries the most risk. A shorter section further down covers what a **Platform operator** needs to know. Developers integrating Tools should also read this to understand what constraints their Tool will run under.

This document assumes you've already read the [network architecture](network-architecture.md), the [technical architecture of the Client](technical-architecture-client.md), the [technical architecture of the Platform](technical-architecture-platform.md), and the [data flow of the Client](data-flow-client.md). Those documents describe *what* the system does; this one focuses on *why it can be trusted to do it safely*, and where that trust has limits.

## The central trust boundary

The single most important design decision in FL-Net is this:

> **Patient-level data physically never leaves the Client.** Everything that happens on the Platform — including deciding which Tools are trustworthy enough to run — is an assertion the Platform makes, not a channel through which it can reach that data. Whether a Tool is allowed to *act* on data beyond its default sandbox is a decision the Client makes locally, independent of anything the Platform has said about that Tool.

This matters because it means the Platform does not need to be perfectly trustworthy for the Client's data to stay safe. A compromised, buggy, or dishonest Platform could in principle certify a malicious Tool — but certification alone gives that Tool nothing: by default it runs sandboxed with no special network or host access, and any request for broader access requires a Data Holder to manually approve it, a step no automatic mechanism can bypass. The Platform's certification and the Client's approval are two independent checks; a failure of one does not silently disable the other.

This independence is unconditional for a Tool's elevated network or host access — that gate is triggered by what the Tool is asking for, not by who asked, and no automatic permission can bypass it. 

The details of how this works are explained in all previous sections:
- The [network architecture](network-architecture.md) explains how the Platform and Client communicate, and what each party can see of the other's traffic.
- The [technical architecture of the Client](technical-architecture-client.md) explains how the Client is structured and what each component does
- The [technical architecture of the Platform](technical-architecture-platform.md) explains the same for the Platform, also including the data flow of the platform in shorter form.
- The [data flow of the Client](data-flow-client.md) explains exactly how data flows through the Client.

## Client IT admin responsibilities

- Change the initial Keycloak admin password immediately after deployment, before real patient data is loaded.
- Treat every `.env` file and the backup output location as sensitive secrets; restrict host and container access to trusted users only.
- Decide and document your organization's policy for approving Tools that request broader network or host access.
- Coordinate with your organization's Data Access Managers to ensure disclosure-control thresholds (minimum record count, query rate limits) are configured sensibly for each cohort — see the [access management documentation](../../client-usage/external-access-management.md). This, not anything the Platform does, is what actually determines what a federated query or statistics request can extract.
- If you choose an alternative to the recommended CA-issued-certificate setup — a self-signed certificate, your own reverse proxy, or an SSH tunnel — securing that path becomes your own responsibility; see the [Client deployment guide](../../deployment/deploy-client.md) for the supported options.

## Platform operator responsibilities

- Since the Platform must be internet-reachable by every participating Client, use a CA-issued certificate and keep it current — the self-signed/no-HSTS option documented for Clients is not an appropriate choice for a Platform deployment.
- Ensure the Platform's own Keycloak instance correctly gates Client registration, since this is what protects the Platform from unauthorized or malicious Clients.
- Control who holds auditor rights for Tool certification, and treat that role with care — certification is the sole technical gate for Tools executing on the Platform itself (see [the central trust boundary](#the-central-trust-boundary)).

## Known limitations

These are accepted design trade-offs, not defects awaiting a fix — documented here so a Client IT admin can factor them into their own risk assessment rather than discover them independently.

- **Tool certification is Platform-asserted, and cannot be independently verified by the Client beyond reviewing its published documentation, source, and scan results.** This is mitigated on the Client side by mandatory local approval for any elevated access request. 
- **Optional Automatic Access permissions trust the Platform's assertion of requester identity, with no independent verification available to the Client.** Because the Platform is the identity provider for Data Scientists and Auditors, a compromised or malicious Platform could impersonate a user covered by such a permission and have that request approved without human review. Manual approval is the default; IT admins should weigh this risk before enabling automatic access, particularly for training requests.
- **Global/aggregated model broadcasts rely on TLS alone**, unlike local model updates. The Relay Server terminates the TLS session for these broadcasts and could technically observe their content, even though it has no reason to and is not designed to log or inspect it. This is an operator-trust boundary, not a cryptographic guarantee, and applies equally regardless of whether the aggregator is hosted by the Platform or by a Client.
- **FL run creation/stopping on the Controller and Relay Server carries no application-level authentication.**, The Relay Server's HTTP orchestration endpoints are network-isolated to the global learning API (only its TCP endpoint is public, for Controllers to connect), so this is not exploitable externally. The Controller's orchestration endpoints, however, are reachable by any Tool on the client and have no auth — but a Tool-registered FL run has no effect, since the Relay Server never learns of it. Given this, the lack of auth is accepted as a simplicity/performance trade-off. Actual FL message traffic is separately API-key protected.
- **Disclosure control only protects against what it's configured to protect against.** A statistic or query result can be within a Client's granted permissions and still be disclosive if the underlying thresholds are set too permissively for a given cohort — this is a configuration responsibility of the Client's Data Access Managers, not something FL-Net's architecture can enforce on its behalf. See the [access management documentation](../../client-usage/external-access-management.md).
- **Manual approval steps are only as reliable as the humans performing them.** A Data Holder (Data Access Manager) who approves a Request or a Tool's elevated access without adequately reviewing it is a governance risk no technical control in this document eliminates.
- **Linkage of schema subscription to a Client is possible**. While the schema pull and subscription lifecycle are Local Learning API to Platform traffic, and are intentionally kept anonymous, a Platform operator could still correlate the timing or IP address of a schema pull or subscription with a Client's WebSocket connection to the Platform. This is a known limitation of the current design, and is accepted as a trade-off for simplicity and performance, as schema information is not considered sensitive in the same way as patient-level data.

## Further reading

- [Network architecture](network-architecture.md) — the connection-level view this document assumes.
- [Technical architecture of the Client](technical-architecture-client.md) and [technical architecture of the Platform](technical-architecture-platform.md) — the components referenced throughout this document.
- [Data flow of the Client](data-flow-client.md) — the full per-request-type and Tool execution breakdown summarized above.
- [Client access management](../../client-usage/external-access-management.md) — how to configure disclosure control and Request approval in practice.

---
title: "Software Architecture"
aliases: []
tags: [cs, cs/architecture]
created: "2026-06-13"
---

# Software Architecture

### Core Definitions

* **Architecture Characteristics:** Often referred to as the "-ilities," these are the non-domain design considerations the system must support (e.g., scalability, security).
* **Architecture Decisions:** These define the rules for how a system should be constructedwhat is and is not allowed.
* **Variance:** If a decision cannot be implemented due to constraints, the process moves into a variance. This formalizes seeking approval or denial based on justifications and trade-offs.
* **Design Principles:** Unlike hard-and-fast rules (decisions), these are guidelines. They provide a preferred method (e.g., asynchronous messaging) while allowing developers flexibility (e.g., using REST or gRPC) in specific circumstances.

***

### Expectations of an Architect

* **Make Architecture Decisions:** Define the technical path and rules.
* **Continually Analyze the Architecture:** Ensure the system remains viable as it evolves.
* **Keep Current with Latest Trends:** Technology moves fast; stay informed.
* **Ensure Compliance with Decisions:** Verify that the team is following the defined architecture.
* **Diverse Exposure and Experience:** Focus on **Technical Breadth** over depth. It is more valuable to know the pros/cons of 10 different caching products than to be an expert in only one.
* **Business Domain Knowledge:** Successful architects couple technical skills with strong knowledge of a specific business domain.
* **Interpersonal Skills:** Must be able to navigate office politics and lead teams.

***

### Domain Taxonomy

Understanding domain scope helps architects frame problems at the right level:

- **Domain (The Field)**: The broadest category the "industry" or "sector" (_e.g., Science, Business, Arts, Engineering_).
- **Discipline (The Branch)**: A specific branch of learning with its own rules and methods (_e.g., within Science: Physics, Biology, Chemistry_).
- **Topic (The Subject)**: A specific area of focus within a discipline (_e.g., within Physics: Quantum Mechanics, Thermodynamics_).
- **Niche (The Expertise)**: Where professional domain expertise truly lives (_e.g., within Fluid Dynamics: Turbulent Flow in Micro-channels_).

***

### Modularity and Cohesion

Cohesion refers to the extent to which parts of a module should be contained within the same module.

* **Functional Cohesion (Best):** Every part of the module is related and essential to a single function.
* **Sequential Cohesion:** Two modules interact where one’s output is the other’s input.
* **Communicational Cohesion:** Modules form a chain operating on the same information (e.g., adding a record then emailing a receipt).
* **Procedural Cohesion:** Modules must execute code in a specific order.
* **Temporal Cohesion:** Modules are related by timing dependencies (e.g., system startup tasks).
* **Logical Cohesion:** Data is related logically but not functionally (e.g., a `StringUtils` package).
* **Coincidental Cohesion (Worst):** Elements are unrelated and only exist in the same file.

***

### Architecture Characteristics (The "-ilities")

Characteristics influence structural aspects of design and are critical to application success. Architects should aim for the **fewest possible** characteristics to avoid unnecessary complexity.

#### Implicit vs. Explicit

* **Implicit:** Rarely in requirements but necessary (e.g., availability, security).
* **Explicit:** Specifically documented in requirements or instructions.

#### Operational Characteristics

Focus on runtime capabilities and DevOps.

| Term | Definition |
| ---------------------- | ---------------------------------------------------------------------- |
| **Availability** | How long the system must be available (e.g., 24/7) and recovery plans. |
| **Continuity** | Disaster recovery capability. |
| **Performance** | Stress testing, peak analysis, capacity planning, and response times. |
| **Recoverability** | How quickly a system returns online after disaster (RTO/RPO). |
| **Reliability/Safety** | Assessment of mission-critical or life-critical nature. |
| **Robustness** | Ability to handle error conditions and hardware failures. |
| **Scalability** | Ability to maintain performance as user/request counts increase. |

#### Structural Characteristics

Focus on internal code quality and physical structure.

| Term | Definition |
| ------------------- | ---------------------------------------------------------------- |
| **Configurability** | Ability for users to change settings via interfaces. |
| **Extensibility** | Ease of plugging in new functionality. |
| **Installability** | Ease of system installation across platforms. |
| **Reuse** | Ability to use common components across products. |
| **Localization** | Support for multiple languages, currencies, and units. |
| **Maintainability** | Ease of applying changes, fixing bugs, and enhancing code. |
| **Portability** | Need to run on more than one platform (e.g., multiple DB types). |
| **Supportability** | Level of logging and debugging facilities required. |
| **Upgradeability** | Ease of moving from old to new versions. |

#### Cross-Cutting Characteristics

* **Accessibility:** Support for users with disabilities.
* **Archivability:** Requirements for data deletion or archival.
* **Authentication/Authorization:** Verifying identity and permission levels.
* **Legal:** Compliance with laws like GDPR or Sarbanes-Oxley.
* **Privacy:** Hiding transactions from internal employees (encryption).
* **Security:** Data encryption at rest and in transit.
* **Usability:** The level of training required for users.

***

### Architectural Governance and Identification

#### Trade-Offs

Characteristics often compete. For example, increasing **Security** often negatively impacts **Performance**. Architects must find the "Least Worst Architecture" by balancing these trade-offs.

#### Architecture Katas

A practice exercise where architects are given a domain problem and context to design a solution within a time limit (e.g., 45 minutes), followed by peer review.

#### Architectural Fitness Functions

Automated "guardrails" used to protect architectural characteristics as the system evolves.

* **Atomic:** Targets a single characteristic (e.g., circular dependency check).
* **Holistic:** Tests interacting attributes (e.g., security vs. latency).
* **Triggered:** Runs on events (e.g., CI/CD pipeline).
* **Continual:** Real-time monitoring (e.g., production alerts).
* **Static:** Code analysis (e.g., linting).
* **Dynamic:** Live system analysis (e.g., Chaos Engineering).

***

### Architecture Quanta and Granularity

An **Architecture Quantum** is an independently deployable artifact characterized by high functional cohesion and synchronous connascence.

* **Independently Deployable:** Includes all dependencies (like databases).
* **High Functional Cohesion:** Focused on a specific business workflow.
* **Synchronous Connascence:** If two services talk synchronously, they are tethered and must share operational characteristics.

***

### The 8 Fallacies of Distributed Computing

1. The network is reliable.
2. Latency is zero.
3. Bandwidth is infinite.
4. The network is secure.
5. Topology doesn't change.
6. There is one administrator.
7. Transport cost is zero.
8. The network is homogeneous.

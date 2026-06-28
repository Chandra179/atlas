---
title: "Game Theory"
aliases: []
tags: [economy/micro]
created: "2026-06-13"
---

# Game Theory

## Prisoners' Dilemma

Two suspects are arrested and held separately. Each can either confess or remain silent.

| | Prisoner B confesses | Prisoner B silent |
|-|---------------------|------------------|
| **Prisoner A confesses** | A gets 5 years, B gets 5 years | A goes free, B gets 10 years |
| **Prisoner A silent** | A gets 10 years, B goes free | A gets 1 year, B gets 1 year |

Each prisoner has a **dominant strategy**: confess. Confessing gives a better outcome regardless of what the other does. The result both confess and serve 5 years is worse for both than if both had remained silent (1 year each). The prisoners' dilemma shows how individually rational choices produce a collectively irrational outcome.

This structure appears throughout economics: oligopoly pricing (firms would rather collude on high prices but each has an incentive to undercut), arms races, common resource depletion, and public good provision.

## Nash Equilibrium

A **Nash equilibrium** occurs when each player chooses their best response to the other players' strategies no player can improve their payoff by unilaterally changing their strategy.

In the prisoners' dilemma, (Confess, Confess) is a Nash equilibrium. A game can have multiple Nash equilibria, and some games have none in pure strategies.

Nash equilibrium is the central solution concept in game theory because it describes a stable, self-reinforcing outcome. Its limitation is that it says nothing about how players *reach* the equilibrium or whether it is efficient.

## Cournot Duopoly

Two firms compete by choosing **quantities** of a homogeneous good. Each firm assumes the other's quantity is fixed when deciding its own output.

- Market demand is linear: $$P = a - b(Q_1 + Q_2)$$
- Each firm maximizes profit given the other's output
- The Nash equilibrium occurs where each firm's quantity is a best response to the other's

The Cournot outcome lies between monopoly (half the market produces nothing) and perfect competition (price = marginal cost). As the number of firms increases, the Cournot price approaches the competitive price.

## Bertrand Duopoly

Two firms compete by choosing **prices** for a homogeneous good. Each firm assumes the other's price is fixed when setting its own.

The Bertrand **paradox**: with only two firms, price is driven down to marginal cost the same outcome as perfect competition. Each firm has an incentive to undercut the other by a penny, capturing the entire market. This process continues until price equals marginal cost and profits are zero.

The stark contrast between Cournot (intermediate profit) and Bertrand (zero profit) shows how the strategic variable quantity vs. price fundamentally changes the outcome, even with identical firms. In practice, the Bertrand outcome is softened by product differentiation, capacity constraints, or repeated interaction.

## Stackelberg Model

One firm (the leader) chooses its quantity first; the other (the follower) observes and chooses its own quantity. The leader has a **first-mover advantage**: it can commit to a large quantity, forcing the follower to choose a smaller quantity as a best response.

The Stackelberg outcome: the leader produces more and earns higher profit than in Cournot; the follower produces less and earns lower profit. Total output is higher than Cournot but still below the competitive level.

The Stackelberg model illustrates the strategic value of commitment. If a firm can credibly commit to high output (by building capacity, signing long-term contracts, or making irreversible investments), it can shift the market outcome in its favor.

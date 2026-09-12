# Ideas

## Problems

1. find existing problems from customer review about an apps or from product hunt, collect the pain points
2. we can also find customer problems through scrapping from reddit, hackernews, social media, etc..

## Solution

1. analyze the problems and check if the problem happened in the past and already have the solution
2. if its a new problem and no one have solved it yet then we do research of how to solve it, it might be a niche or specific problem
3. spelled out the solution, do we need data, energy, algorithms, computation to solve it?
4. are the solution can be applied globally or is it specific to region, province or maybe city only
5. will the solution conflict with complex gov regulation? if yes what to do

## Constraint

1. We need to limit apps usage on CPU, memory because its cost, so optimization is needed and the right choose of the resource used, for example embedded DB rather than postgres

## MVP

1. translate the solution into core features, think of core features like a part of a whole system that must be exists if not the system will not run
2. define the features step by step where the features can be work independently by teams, whereas the dependency between features are communicates through abstraction
3. create the prototype design ui ux and mock data, this is a fast iteration before moving to stable implementation using the correct Tech stack, why? because we need to check if the ideas/solution is work or not or have some update on the problem in the middle of implement till we agree on the mvp, well we still need to set on agreement based on deadline or usefullnes or from customer feedback is positive
4. then we move to real implementation below using tech stack

## Tech

1. use golang or rust for fast development for backend, if need heavy computation and memory efficiency use rust
2. web based first ui using reactjs, tailwindcss, typescript and vite for package management
3. use modular monolith, use standard libary instead of manual implementation if it can, or use big tech open source libary but check if its actively maintainable, security, total stars
4. create system design or system architecture first in "docs", the mandatory section is: tech stack, tradeoffs
5. document the architecture decisions in "docs/adr" using markdown file
6. 

## Scaling

1. 
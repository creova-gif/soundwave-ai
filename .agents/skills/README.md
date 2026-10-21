# gstack for Antigravity & Gemini

Ported from [garrytan/gstack](https://github.com/garrytan/gstack) into native Antigravity skills and subagents.

## Core Workflows & Skills

| Workflow | Antigravity Skill | Trigger Phrases | Role & Deliverable |
| :--- | :--- | :--- | :--- |
| **Office Hours** | `gstack-office-hours` | `office hours`, `brainstorm this`, `is this worth building` | YC partner interrogation (6 forcing questions, wedge definition, status quo analysis). Produces Design Doc / PRD artifact before code. |
| **Architecture Review** | `gstack-architecture-review` | `architecture review`, `eng review`, `lock in the plan` | Engineering Manager plan audit (blast radius, failure modes, test diagrams, trade-offs). |
| **Autonomous QA** | `gstack-qa` | `qa test`, `test the app`, `find bugs in browser` | Headless browser testing using Chrome DevTools MCP. Tests user flows, console logs, and visual states. Test → Fix → Verify. |
| **Pre-Landing Review** | `gstack-review` | `review this pr`, `pre-landing review`, `code review` | Senior Staff diff audit for security, SQL safety, LLM trust boundaries, and async robustness. |

## Subagents (Dynamic Delegation)

The following subagents are defined and can be invoked directly:
- **`gstack-partner`**: Focuses purely on product discovery, customer validation, and wedge scoping.
- **`gstack-architect`**: Focuses on architecture validation, blast radius, and test strategy planning.
- **`gstack-qa-lead`**: Focuses on driving Chrome DevTools to navigate, interact with, and verify web applications.
- **`gstack-reviewer`**: Focuses on performing pre-landing diff reviews before merging code.

# AI Software Engineering Team

This directory contains specialized agents that simulate a full software engineering team.

## Team Roster

### Leadership & Planning
| Agent | Role | Use When |
|-------|------|----------|
| `orchestrator` | Team Coordinator | Large features needing multiple specialists |
| `pm` | Product Manager | Defining requirements, prioritization, user stories |
| `eng-manager` | Engineering Manager | Task breakdown, progress tracking, coordination |
| `tech-lead` | Tech Lead / Architect | Architecture decisions, code quality, patterns |

### Development
| Agent | Role | Use When |
|-------|------|----------|
| `frontend-dev` | Senior Frontend Dev | React/Next.js implementation, components |
| `web3-dev` | Web3 Developer | Blockchain, wallets, Superfluid, Aleph SDK |
| `refactor` | Refactoring Specialist | Safe code improvements, pattern migration |
| `debugger` | Debugging Specialist | Bug investigation, root cause analysis |

### Quality & Security
| Agent | Role | Use When |
|-------|------|----------|
| `qa-engineer` | QA Engineer | Testing strategy, bug finding, validation |
| `code-reviewer` | Code Reviewer | Pre-merge code reviews |
| `security` | Security Engineer | Security audits, vulnerability assessment |
| `performance` | Performance Engineer | Optimization, profiling, bundle analysis |

### Design & Documentation
| Agent | Role | Use When |
|-------|------|----------|
| `ux-designer` | UX/UI Designer | UI reviews, design patterns, accessibility |
| `docs-writer` | Documentation Writer | Technical docs, guides, API documentation |

### Operations
| Agent | Role | Use When |
|-------|------|----------|
| `devops` | DevOps Engineer | Build, deployment, CI/CD |

## Usage Examples

### Feature Development Flow
```
1. @orchestrator - Plan the feature delivery
2. @pm - Define user stories and acceptance criteria
3. @tech-lead - Design architecture
4. @frontend-dev / @web3-dev - Implement
5. @qa-engineer - Test
6. @code-reviewer - Review
7. @docs-writer - Document
```

### Bug Fix Flow
```
1. @debugger - Investigate and find root cause
2. @frontend-dev - Implement fix
3. @qa-engineer - Verify fix
4. @code-reviewer - Review
```

### Performance Issue Flow
```
1. @performance - Profile and identify bottlenecks
2. @tech-lead - Validate approach
3. @frontend-dev - Implement optimizations
4. @performance - Verify improvements
```

### Security Audit Flow
```
1. @security - Comprehensive audit
2. @tech-lead - Prioritize findings
3. @frontend-dev / @web3-dev - Implement fixes
4. @security - Verify remediations
```

## Tips

- **Start with orchestrator** for complex, multi-step projects
- **Use specialists** for focused work in their domain
- **Combine agents** - e.g., security + code-reviewer for secure PR reviews
- **Iterate** - agents can build on each other's work

## Agent Communication

Agents output structured information:
- **pm**: User stories, acceptance criteria, priorities
- **tech-lead**: Architecture decisions, code patterns
- **qa-engineer**: Test cases, bug reports
- **code-reviewer**: Review feedback (blocking/should-fix/suggestions)
- **security**: Vulnerability reports with severity and remediation

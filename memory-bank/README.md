# Memory Bank

This directory contains the comprehensive documentation for The Next Side project. The Memory Bank serves as the single source of truth for project context, decisions, and progress.

## 📚 Memory Bank Structure

The Memory Bank consists of 6 core files that build upon each other:

```
projectbrief.md (Foundation)
    ├── productContext.md (Why & How)
    ├── systemPatterns.md (Architecture)
    └── techContext.md (Technology)
         │
         └── activeContext.md (Current Work)
              │
              └── progress.md (Status & Next Steps)
```

## 📄 File Descriptions

### 1. [projectbrief.md](./projectbrief.md) - **READ FIRST**
**Purpose**: Foundation document that shapes all other files

**Contents**:
- Project name and goal
- Core functional and non-functional requirements
- Target users and success metrics
- Technology constraints and choices
- Project scope across 4 phases
- Design philosophy and timeline
- Stakeholders

**When to Read**: First time understanding the project

### 2. [productContext.md](./productContext.md)
**Purpose**: Explains why this project exists and how it works

**Contents**:
- Problem statement and solution
- Core user journey and information architecture
- Product data structure
- Key user interactions
- User experience goals
- Pain points addressed
- Success indicators and competitive landscape

**When to Read**: Understanding the product vision and user needs

### 3. [systemPatterns.md](./systemPatterns.md)
**Purpose**: System architecture and design patterns

**Contents**:
- High-level architecture overview
- Component hierarchy and categories
- Routing architecture
- State management strategy
- Design patterns in use
- Data flow patterns
- Key technical decisions and rationale
- Component relationships and critical implementation paths
- Security and scalability considerations

**When to Read**: Understanding the technical architecture and how components interact

### 4. [techContext.md](./techContext.md)
**Purpose**: Technology stack and development setup

**Contents**:
- Complete technology stack (React, Vite, Tailwind, etc.)
- Development tools and configuration
- Project structure and directory layout
- Development setup instructions
- Technical constraints and dependencies
- Integration points and deployment plans
- Code patterns and style guidelines
- Testing and security considerations

**When to Read**: Setting up the development environment or understanding the tech stack

### 5. [activeContext.md](./activeContext.md) - **READ REGULARLY**
**Purpose**: Current work focus and active decisions

**Contents**:
- Current phase and progress
- What's been built and what needs to be built next
- Recent changes and code quality status
- Confirmed decisions and pending considerations
- Important patterns and coding preferences
- Learnings and project insights
- Known issues and limitations
- Next steps prioritization
- Open questions and decisions needed

**When to Read**: Before starting any new development work

### 6. [progress.md](./progress.md) - **READ REGULARLY**
**Purpose**: Project status, what works, and what's left

**Contents**:
- Overall project status and phase progress
- What works (completed features)
- What's left to build (organized by priority)
- Known issues and technical debt
- Evolution of project decisions
- Performance metrics and testing status
- Deployment status and achievements
- Next steps, blockers, and risk assessment
- Lessons learned and milestones

**When to Read**: Checking project status, planning next steps, or preparing for handoff

## 🔄 How to Use the Memory Bank

### For New Team Members
1. Start with **projectbrief.md** to understand the project
2. Read **productContext.md** to understand the user needs
3. Review **systemPatterns.md** to understand the architecture
4. Check **techContext.md** for development setup
5. Read **activeContext.md** for current work
6. Review **progress.md** for project status

### For Regular Development
1. Before starting work: Read **activeContext.md**
2. When making decisions: Check **systemPatterns.md**
3. When implementing: Follow patterns in **techContext.md**
4. After completing work: Update **progress.md** and **activeContext.md**

### For Handoffs
1. Review **progress.md** for current status
2. Check **activeContext.md** for recent work
3. Review **projectbrief.md** for overall goals
4. Check **systemPatterns.md** for architecture decisions

### For Planning
1. Review **progress.md** for what's left
2. Check **activeContext.md** for prioritization
3. Reference **projectbrief.md** for scope and phase boundaries

## 📝 Updating the Memory Bank

### When to Update
- After implementing significant changes
- When making important technical decisions
- When changing project direction or scope
- When encountering new patterns or preferences
- When requested with "update memory bank"

### How to Update
1. Review ALL files in the Memory Bank
2. Update relevant sections with current information
3. Ensure consistency across all files
4. Update timestamps and version numbers
5. Document the change in the update history

### Update Guidelines
- Keep descriptions concise and specific
- Use active voice and clear language
- Include code examples where helpful
- Maintain the hierarchical structure
- Cross-reference related sections between files

## 🔗 File Relationships

```
projectbrief.md
    ↓ Defines goals and requirements
productContext.md
    ↓ Defines user needs and journeys
systemPatterns.md
    ↓ Defines architecture and patterns
techContext.md
    ↓ Defines technology and setup
activeContext.md
    ↓ Tracks current work and decisions
progress.md
    ↓ Tracks status and next steps
(Back to activeContext.md for planning)
```

## ⚠️ Important Notes

### Critical Rules
1. **ALWAYS** read Memory Bank at the start of EVERY task
2. Update files after significant changes
3. Maintain consistency across all files
4. Document decisions and rationale
5. Keep information current and accurate

### Best Practices
- Reference specific files and line numbers when discussing
- Use the Memory Bank to resolve disagreements
- Update regularly, not just at milestones
- Include learnings and insights
- Document both successes and failures

## 📊 Memory Bank Health Metrics

### Current Status
- **Files**: 6 core files
- **Last Updated**: January 7, 2026
- **Consistency**: ✅ All files aligned
- **Completeness**: ✅ All required sections present
- **Accuracy**: ✅ Reflects current project state

### Maintenance Schedule
- **Daily**: Review activeContext.md before work
- **Weekly**: Review and update progress.md
- **Per Phase**: Full Memory Bank review and update
- **As Needed**: Update when decisions are made

## 🆘 Getting Help

If the Memory Bank doesn't answer your question:
1. Check if the information is in another file
2. Look for related sections using cross-references
3. Check the "Open Questions" section in activeContext.md
4. Ask in team chat or create a GitHub issue
5. Update the Memory Bank with the answer once found

## 📈 Evolution

The Memory Bank evolves with the project:
- **Phase 1**: Focus on MVP features and basic architecture
- **Phase 2**: Expand with data management patterns
- **Phase 3**: Add advanced features and integrations
- **Phase 4**: Include backend and cloud architecture

---

**Remember**: The Memory Bank is the foundation of project continuity. Keep it accurate, keep it current, and use it often!

*Last Updated: January 7, 2026*
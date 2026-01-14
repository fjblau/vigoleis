# Spec and build

## Configuration
- **Artifacts Path**: {@artifacts_path} → `.zenflow/tasks/{task_id}`

---

## Agent Instructions

Ask the user questions when anything is unclear or needs their input. This includes:
- Ambiguous or incomplete requirements
- Technical decisions that affect architecture or user experience
- Trade-offs that require business context

Do not make assumptions on important decisions — get clarification first.

---

## Workflow Steps

### [x] Step: Technical Specification
<!-- chat-id: 8bfcff7d-3e71-45d8-8b92-cdc905009301 -->

Assess the task's difficulty, as underestimating it leads to poor outcomes.
- easy: Straightforward implementation, trivial bug fix or feature
- medium: Moderate complexity, some edge cases or caveats to consider
- hard: Complex logic, many caveats, architectural considerations, or high-risk changes

Create a technical specification for the task that is appropriate for the complexity level:
- Review the existing codebase architecture and identify reusable components.
- Define the implementation approach based on established patterns in the project.
- Identify all source code files that will be created or modified.
- Define any necessary data model, API, or interface changes.
- Describe verification steps using the project's test and lint commands.

Save the output to `{@artifacts_path}/spec.md` with:
- Technical context (language, dependencies)
- Implementation approach
- Source code structure changes
- Data model / API / interface changes
- Verification approach

If the task is complex enough, create a detailed implementation plan based on `{@artifacts_path}/spec.md`:
- Break down the work into concrete tasks (incrementable, testable milestones)
- Each task should reference relevant contracts and include verification steps
- Replace the Implementation step below with the planned tasks

Rule of thumb for step size: each step should represent a coherent unit of work (e.g., implement a component, add an API endpoint, write tests for a module). Avoid steps that are too granular (single function).

Save to `{@artifacts_path}/plan.md`. If the feature is trivial and doesn't warrant this breakdown, keep the Implementation step below as is.

---

### [ ] Step: Foundation Setup

1. Select and deploy appropriate Vercel template (blog/portfolio/commerce)
2. Customize branding (colors, fonts, author theme)
3. Set up basic page structure and navigation
4. Verify: Site deploys successfully and is responsive

---

### [ ] Step: Content Features Implementation

1. Configure news/articles section with categories and tags
2. Build photo gallery with grid layout and lightbox
3. Create links/resources page for ephemera
4. Verify: All content sections render correctly and are navigable

---

### [ ] Step: E-commerce Integration

1. Integrate Shopify or Stripe for memorabilia sales
2. Set up product catalog and shopping cart
3. Configure checkout and payment flow
4. Verify: Complete purchase flow works end-to-end

---

### [ ] Step: Polish & Deployment

1. Test responsive design on mobile, tablet, desktop
2. Optimize SEO (meta tags, sitemap)
3. Run performance tests and optimize
4. Deploy to production
5. Write report to `{@artifacts_path}/report.md` describing:
   - What was implemented
   - How the solution was tested
   - Any challenges encountered

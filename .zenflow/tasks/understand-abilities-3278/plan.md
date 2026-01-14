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

### [x] Step: Foundation Setup

1. ✅ Selected Next.js Blog Starter Kit with Sanity CMS template
2. ✅ Customized branding for Albert Vigoleis Thelen (colors, fonts, site title)
3. ✅ Set up page structure and navigation with header component
4. ✅ Verified: Site builds successfully and is responsive

---

### [x] Step: Content Features Implementation

1. ✅ Configured news/articles section with blog layout
2. ✅ Built photo gallery page with grid layout (placeholder with CMS integration ready)
3. ✅ Created links/resources page for ephemera with categorized sections
4. ✅ Verified: All content sections render correctly and are navigable

---

### [ ] Step: E-commerce Integration (Pending)

**Status**: Shop placeholder created, ready for integration

To complete:
1. Integrate Shopify or Stripe for memorabilia sales
2. Set up product catalog and shopping cart in Sanity CMS
3. Configure checkout and payment flow
4. Verify: Complete purchase flow works end-to-end

**Note**: Shop page structure is ready; awaiting decision on e-commerce platform.

---

### [x] Step: Initial Deployment Preparation

1. ✅ Tested responsive design (builds successfully)
2. ✅ Configured error handling for graceful CMS connection failures
3. ✅ Built successfully with npm run build
4. ✅ Committed code to GitHub repository (fjblau/vigoleis)
5. ✅ Created comprehensive SETUP.md guide

**Next Steps**:
- Run `npm run setup` to configure Sanity CMS
- Deploy to Vercel
- Add custom domain if desired
- Extend CMS schemas for gallery, links, and shop features

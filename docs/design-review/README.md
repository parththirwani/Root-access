# Website redesign review

The earlier 94/100 dark-mode rating below was my subjective call and the user rejected it after inspecting the site. It is superseded. The dark-mode work remains under review; no new score or claim of meeting the 90/100 target has been established.

The redesign keeps the existing Next.js, Prisma, and Tailwind stack, published database content, section paths, post paths, project links, social links, resume link, admin routes, filters, and copy-page action. The branch is `dev`.

## Screenshot comparisons

Screenshots were taken in the browser at identical CSS viewports for each comparison: 1440 × 900 desktop and 375 × 844 mobile. The screenshot tool scales the saved desktop PNG to fit its output.

| State | Desktop | Mobile |
| --- | --- | --- |
| Original site | [baseline desktop](baseline-desktop.png) | [baseline mobile](baseline-mobile.png) |
| Reference dark | [reference dark desktop](reference-dark-desktop.png) | [reference dark mobile](reference-dark-mobile.png) |
| Earlier dark pass | [final dark desktop](final-dark-desktop.png) | [final dark mobile](final-dark-mobile.png) |
| Reference light | [reference light desktop](reference-light-desktop.png) | [reference light mobile](reference-light-mobile.png) |
| Final light | [final light desktop](final-light-desktop.png) | [final light mobile](final-light-mobile.png) |

Additional checks: [writing archive on mobile](final-writing-mobile.png), [projects on desktop](final-projects-desktop.png), and [article on mobile](final-article-mobile.png).

Current dark iteration: [home desktop](dark-iteration-home-desktop.png), [writing mobile](dark-iteration-writing-mobile.png), [projects desktop](dark-iteration-projects-desktop.png), and [books desktop](dark-iteration-books-desktop.png). The screenshots show the branching canvas, outlined writing years, compact project grid, and plain book list. The current dark iteration has not been compared to the reference with a validated numeric score.

## Review iterations

| Pass | Observation | Change |
| --- | --- | --- |
| Baseline | Fixed sidebar, nested cards, 15px justified text, no homepage h1, tight mobile reading width. | Replaced the public layout with a shared header and a single reading column. |
| First screenshot pass | Light article text inherited dark-theme markdown classes. Long breadcrumbs overflowed visually. | Added public prose tokens, fixed article contrast, and truncated long breadcrumb labels. |
| Dark pass | The reference used a 28px mobile gutter, an 88px header, Inter, a `#050505` background, and `#bbb` prose. | Matched these values, made dark the default, and added a subtle CSS dot field. |
| Light pass | Light mode needed the reference's white background and softer `#555` prose. | Tuned the light palette while keeping accessible link and metadata contrast. |
| Final pass | A stored article repeated its title as its first body heading. The profile image was oversized for its display width. | Removed only matching duplicate body headings and requested a 96px Cloudinary avatar. |
| User review | The earlier dark pass missed the branching artwork, moving dots, large outlined year markers, and compact project presentation. | Added animated canvas backgrounds, large archive years, project entries in a dense grid, and inline home project links. |
| Browser refinement | The first branching settings formed dense clumps; a resize stopped the dot animation. | Ported the reference's shared-counter branching pattern, fixed canvas resize, and increased the reading-area mask. |
| Content and interaction correction | Books and quotes opened generated article pages; dots remained on the home page, and social links were text only. | Restricted article pages to writing, made books and quotes plain lists, kept external project and publication links, removed dots, and added social and employer icons. |

## Earlier manual rubric, superseded

These were comparative design judgments from the earlier screenshots and browser checks, not automated measurements. They are retained as historical notes and do not rate the current revision. The user assessed the earlier design as far below the target.

| Category | Max | Baseline | Dark | Light | Evidence |
| --- | ---: | ---: | ---: | ---: | --- |
| Visual similarity and polish | 25 | 9 | 23 | 23 | Shared near-black or white field, restrained dot texture, aligned 656px desktop column, clean archives. The reference uses its own artwork and navigation icons. |
| Design system consistency | 25 | 8 | 24 | 24 | Shared site tokens and typography cover home, sections, posts, navigation, footer, and 404. |
| Typography, spacing, hierarchy | 20 | 8 | 19 | 19 | Inter, strong title hierarchy, 28px mobile gutters, readable 16px prose, consistent vertical spacing. |
| Navigation and interactions | 10 | 6 | 9 | 9 | Desktop and mobile navigation, theme persistence, tag filtering, project links, breadcrumbs, and copy-page action were exercised. |
| Mobile responsiveness | 10 | 5 | 9 | 9 | 375px home, archive, and article screenshots show no horizontal document overflow. |
| Accessibility and performance | 10 | 6 | 10 | 9 | Dark final build scored 100 accessibility and 99 mobile performance in Lighthouse. Light mode had readable computed colors and no mobile overflow. |
| **Total** | **100** | **42** | **94** | **93** | |

The baseline score is a manual assessment. No Lighthouse baseline was run. The final Lighthouse run used a production build of the dark default at `http://localhost:3017/`. It reported mobile performance 99, desktop performance 100, accessibility 100 on both, LCP 2.1s mobile and 0.6s desktop, CLS 0 on both, and no image-delivery findings. Scores are local lab results, not field measurements.

## Verification

- `npm run build` passed and generated 5 section routes and 22 post routes.
- Targeted ESLint passed with no warnings.
- Browser checks passed for mobile menu, theme toggle and persistence, horizontal tag scrolling and filtering, project URLs, article navigation and copy, 404, and admin login.
- The production avatar request fell from 20.9 KB to 2.4 KB after adding Cloudinary sizing.
- The current dark iteration built successfully with 5 section routes and 4 writing article routes, and targeted ESLint passed. A Lighthouse mobile run on port 4000 reported performance 99, accessibility 100, LCP 2.3s, and CLS 0. Browser checks confirmed the branch canvas, mobile menu, tag filtering, no book or quote item links, and all four publication links opening externally. Direct book and project item URLs returned 404; writing item URLs returned 200.

Reproduce the Lighthouse check with:

```sh
npm run build
npm run start -- -p 3017
npx --yes lighthouse@12.8.2 http://localhost:3017/ --only-categories=performance,accessibility --chrome-flags='--headless --no-sandbox --disable-dev-shm-usage'
```

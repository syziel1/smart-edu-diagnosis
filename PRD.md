# Smart Edu-Diagnosis Platform

**Experience Qualities**:

**Experience Qualities**:
1. **Intelligent** - The platform analyzes performance patterns and generates dynamic questions that adapt to student needs, providing actionable insights through data visualization.
2. **Professional** - Clean, modern interface with glassmorphic design elements that convey authority and trustworthiness appropriate for educational contexts.
3. **Empowering** - Both students and teachers feel in control, with students receiving clear feedback on their progress and teachers having powerful tools to create adaptive content.

**Complexity Level**: Complex Application (advanced functionality, accounts)
- Requires multi-role authentication (student/admin), dynamic question generation with variable substitution, mathematical rendering, performance analytics with visualizations, and comprehensive CRUD operations for educational content management.

- **Trigger**: Admin 

### Admin Dashboard - Question Templ
- **Functionality**: Users can sign up/login with role selection (Student or Admin/Teacher), with persistent session management
- **Purpose**: Segregate access to content creation vs. content consumption, ensuring appropriate permissions
- **Trigger**: Landing page with authentication forms
- **Functionality**: Fetches question templates by topic/subject, processes JSON to generate spe
- **Trigger**: Student selects topic and starts quiz

### Smart Diagnostics Dashboard
- **Purpose**: Provide actionable insights that guide focused study and reveal knowledge gaps
- **Progression**: Dashboard → View performance tab → See topic-wise breakdown → Interactive charts 

- **Empty States**: Helpful prompts guide users when no content exists (e.g., "Create your first subject to get started
- **Network Failures**: Graceful error messages with retry options, local state preservation during connectivity issues

- **Concurrent Edits**: Last-write-wins with ti
## Design Direction

**Triadic** (blue-purple-teal) - Creates dynamic visual interest w
- **Primary Color**: Deep Blue (`oklch(0.45 0.15 250)`) - Represents knowledge, trust, and stability; used for primary actions and navigation elements, communicating authority
  - Rich Purple (`oklch(0.50 0.18 290)`) - Creativity and wisdom; used for admin/teacher features and advanced functionality

  - Background (Soft Gray `oklch(0.98 0.005 250
  - Primary (Deep Blue `oklch(0.45 0.15 250)`): White text (`oklch(0.99 0 0)`) - Ratio 8.5:1 ✓
  - Accent (Electric Purple `oklch(0.60 0.20 280)`): White text (`oklch(0.99 0 0)`) - Ratio 
- **Trigger**: Student selects topic and starts quiz
Typefaces should convey modern educational professionalism with excellent readability for mathematical content and data-heavy interfaces - combining geometric clarity for headings with humanist
- **Typographic Hierarchy**:

### Smart Diagnostics Dashboard
  - Math Content: Rendered via LaTeX with fallback to system math fonts
- **Purpose**: Provide actionable insights that guide focused study and reveal knowledge gaps

- **Hierarchy of Movement**: Primary focus on quiz transitions and diagnostic reveals (300-400ms), secondary on navigation and form interactions (200ms),
## Component Selection

- **Card**: Glassmorp
- **Form + Input + Label**: Question creator interface with react-hook-form validation
- **Tabs**: Dashboard navigation between content types (Subjects/Topics/Questions) and student views (Quiz/Diagnostics)
- **Network Failures**: Graceful error messages with retry options, local state preservation during connectivity issues
- **Separator**: Visual hierarchy in admin panels
- **Alert**: Feedback messages for form validation and quiz results
### Customizations
- **GradientButton**: Custom button with `bg-gradient-to-r from-primary via-accent to-sec

## Design Direction
- **Buttons**: Default with gradient, hover with scale-105 and brightness increase, active with scale-95, disabled with opacity-50 and grayscale

### Icon Selection
- **Brain**: Diagnostics and smart analysis

- **Primary Color**: Deep Blue (`oklch(0.45 0.15 250)`) - Represents knowledge, trust, and stability; used for primary actions and navigation elements, communicating authority
- **User/UserCog**: Role
  - Rich Purple (`oklch(0.50 0.18 290)`) - Creativity and wisdom; used for admin/teacher features and advanced functionality
### Spacing
- Card internal spacing: `p-6` with `gap-4` for content
- Section margins: `mb-8` for major s

- **Dashboard**: Single column card layout with full-width elements, collapsible navigation drawer
  - Primary (Deep Blue `oklch(0.45 0.15 250)`): White text (`oklch(0.99 0 0)`) - Ratio 8.5:1 ✓
- **Quiz**: Full-screen question display with fixed bottom navigation for prev/next






- **Typographic Hierarchy**:





  - Math Content: Rendered via LaTeX with fallback to system math fonts

## Animations





## Component Selection





- **Form + Input + Label**: Question creator interface with react-hook-form validation

- **Tabs**: Dashboard navigation between content types (Subjects/Topics/Questions) and student views (Quiz/Diagnostics)

- **Badge**: Difficulty indicators (beginner/intermediate/advanced) with color coding

- **Separator**: Visual hierarchy in admin panels

- **Alert**: Feedback messages for form validation and quiz results

### Customizations







- **Buttons**: Default with gradient, hover with scale-105 and brightness increase, active with scale-95, disabled with opacity-50 and grayscale



### Icon Selection

- **Brain**: Diagnostics and smart analysis



- **TrendingUp**: Performance metrics



- **Sparkles**: Dynamic question indicator

### Spacing

- Card internal spacing: `p-6` with `gap-4` for content





- **Dashboard**: Single column card layout with full-width elements, collapsible navigation drawer

- **Charts**: Reduce to essential metrics, single chart per viewport with swipe navigation

- **Quiz**: Full-screen question display with fixed bottom navigation for prev/next


# Smart Edu-Diagnosis Platform

An adaptive educational platform that enables dynamic quiz generation with smart diagnostics to identify student strengths and weaknesses across mathematical topics.

**Experience Qualities**:
1. **Intelligent** - The platform analyzes performance patterns and generates dynamic questions that adapt to student needs, providing actionable insights through data visualization.
2. **Professional** - Clean, modern interface with glassmorphic design elements that convey authority and trustworthiness appropriate for educational contexts.
3. **Empowering** - Both students and teachers feel in control, with students receiving clear feedback on their progress and teachers having powerful tools to create adaptive content.

**Complexity Level**: Complex Application (advanced functionality, accounts)
- Requires multi-role authentication (student/admin), dynamic question generation with variable substitution, mathematical rendering, performance analytics with visualizations, and comprehensive CRUD operations for educational content management.

## Essential Features

### Authentication & Role Management
- **Functionality**: Users can sign up/login with role selection (Student or Admin/Teacher), with persistent session management
- **Purpose**: Segregate access to content creation vs. content consumption, ensuring appropriate permissions
- **Trigger**: Landing page with authentication forms
- **Progression**: Landing page → Role selection → Login/Signup form → Dashboard (role-specific)
- **Success criteria**: Users remain authenticated across sessions, correct dashboard displays based on role, unauthorized access prevented

### Admin Dashboard - Subject/Topic Management
- **Functionality**: Table-based interface for creating, editing, and deleting subjects and topics with hierarchical relationships
- **Purpose**: Organize educational content into logical categories that enable targeted diagnostics
- **Trigger**: Admin clicks "Manage Content" from dashboard
- **Progression**: Dashboard → Content Manager → Select Subjects/Topics tab → CRUD operations → Real-time table updates
- **Success criteria**: All changes persist, topics correctly associate with subjects, validation prevents orphaned records

### Admin Dashboard - Question Template Creator
- **Functionality**: Form-based interface for creating dynamic questions with variable definitions (min/max ranges), markdown-enabled question text with LaTeX support, and answer templates with variable substitution
- **Purpose**: Enable reusable question patterns that generate infinite variations while maintaining educational rigor
- **Trigger**: Admin clicks "Create Question" from content manager
- **Progression**: Select topic → Define variables (name, min, max) → Write question template with {variable} syntax → Define answer template with calculations → Preview with sample generation → Save
- **Success criteria**: Questions serialize to correct JSON format, preview accurately represents final rendering, LaTeX/markdown renders correctly

### Quiz Engine - Question Generation & Display
- **Functionality**: Fetches question templates by topic/subject, processes JSON to generate specific instances with random variable values, renders markdown and LaTeX, presents questions sequentially with answer input
- **Purpose**: Deliver adaptive assessments that test understanding across difficulty levels
- **Trigger**: Student selects topic and starts quiz
- **Progression**: Topic selection → Question fetch → Variable substitution → Markdown/LaTeX rendering → Display question → Collect answer → Immediate feedback → Next question → Quiz completion
- **Success criteria**: Variables resolve correctly, math renders properly, answers validate accurately, progress saves between sessions

### Smart Diagnostics Dashboard
- **Functionality**: Aggregates quiz attempt data, calculates performance metrics by topic and difficulty, visualizes strengths/weaknesses using radar and bar charts
- **Purpose**: Provide actionable insights that guide focused study and reveal knowledge gaps
- **Trigger**: Student completes quiz or views dashboard
- **Progression**: Dashboard → View performance tab → See topic-wise breakdown → Interactive charts reveal patterns → Recommended focus areas highlighted
- **Success criteria**: Charts accurately reflect performance data, trends visible across multiple attempts, recommendations align with weak areas

## Edge Case Handling
- **Empty States**: Helpful prompts guide users when no content exists (e.g., "Create your first subject to get started")
- **Invalid Question Templates**: Form validation prevents malformed variable syntax and alerts to calculation errors in answer templates
- **Network Failures**: Graceful error messages with retry options, local state preservation during connectivity issues
- **Division by Zero**: Question generator validates mathematical expressions and prevents invalid operations
- **Missing LaTeX Packages**: Fallback to plain text rendering with warning if complex math can't render
- **Role Switching**: Prevent mid-session role changes without re-authentication
- **Concurrent Edits**: Last-write-wins with timestamp tracking for admin content updates

## Design Direction
The platform should evoke a sense of modern educational authority with a touch of innovation - professional yet approachable, serious about learning but not intimidating. The glassmorphic design language with gradient accents suggests transparency in progress tracking while maintaining visual hierarchy. A rich interface better serves the data-heavy diagnostics and complex question creation workflows.

## Color Selection
**Triadic** (blue-purple-teal) - Creates dynamic visual interest while maintaining professional education aesthetic, with each color serving distinct functional purposes.

- **Primary Color**: Deep Blue (`oklch(0.45 0.15 250)`) - Represents knowledge, trust, and stability; used for primary actions and navigation elements, communicating authority
- **Secondary Colors**: 
  - Rich Purple (`oklch(0.50 0.18 290)`) - Creativity and wisdom; used for admin/teacher features and advanced functionality
  - Vibrant Teal (`oklch(0.65 0.12 190)`) - Growth and progress; used for student achievements and positive feedback
- **Accent Color**: Electric Purple Gradient (`oklch(0.60 0.20 280)` to `oklch(0.55 0.22 260)`) - Attention for CTAs, quiz start buttons, and interactive elements requiring immediate action
- **Foreground/Background Pairings**:
  - Background (Soft Gray `oklch(0.98 0.005 250)`): Dark Blue-Gray text (`oklch(0.25 0.02 250)`) - Ratio 13.2:1 ✓
  - Card (White with glassmorphic blur `oklch(1 0 0 / 0.75)`): Primary text (`oklch(0.25 0.02 250)`) - Ratio 14.5:1 ✓
  - Primary (Deep Blue `oklch(0.45 0.15 250)`): White text (`oklch(0.99 0 0)`) - Ratio 8.5:1 ✓
  - Secondary (Rich Purple `oklch(0.50 0.18 290)`): White text (`oklch(0.99 0 0)`) - Ratio 7.2:1 ✓
  - Accent (Electric Purple `oklch(0.60 0.20 280)`): White text (`oklch(0.99 0 0)`) - Ratio 5.8:1 ✓
  - Muted (Light Gray `oklch(0.96 0.005 250)`): Dark Gray text (`oklch(0.45 0.01 250)`) - Ratio 7.8:1 ✓

## Font Selection
Typefaces should convey modern educational professionalism with excellent readability for mathematical content and data-heavy interfaces - combining geometric clarity for headings with humanist warmth for body text.

- **Typographic Hierarchy**:
  - H1 (Page Titles): Inter Bold / 36px / -0.02em / 1.1 line-height
  - H2 (Section Headers): Inter SemiBold / 28px / -0.01em / 1.2 line-height
  - H3 (Card Titles): Inter SemiBold / 20px / 0em / 1.3 line-height
  - Body (Main Content): Inter Regular / 16px / 0em / 1.6 line-height
  - Small (Meta Info): Inter Medium / 14px / 0em / 1.5 line-height
  - Math Content: Rendered via LaTeX with fallback to system math fonts

## Animations
Animations should feel purposeful and educational - guiding attention to diagnostic insights and providing satisfying feedback for correct answers while maintaining professional restraint appropriate for a learning environment.

- **Purposeful Meaning**: Motion reinforces the learning journey - questions slide in sequentially, correct answers trigger subtle celebrations, chart data animates on reveal to emphasize growth patterns
- **Hierarchy of Movement**: Primary focus on quiz transitions and diagnostic reveals (300-400ms), secondary on navigation and form interactions (200ms), subtle on hover states (150ms)

## Component Selection

### Components
- **Dialog**: Modal for question preview, confirmation dialogs for deletions
- **Card**: Glassmorphic containers for subjects, topics, quiz questions, performance metrics - custom backdrop-blur and border styling
- **Table**: Admin content management for subjects/topics with inline editing capabilities
- **Form + Input + Label**: Question creator interface with react-hook-form validation
- **Button**: Gradient variants for primary actions (quiz start), ghost for secondary, destructive for deletions
- **Tabs**: Dashboard navigation between content types (Subjects/Topics/Questions) and student views (Quiz/Diagnostics)
- **Select**: Topic/subject selection for quiz initialization and question assignment
- **Badge**: Difficulty indicators (beginner/intermediate/advanced) with color coding
- **Progress**: Quiz completion indicator
- **Separator**: Visual hierarchy in admin panels
- **Textarea**: Markdown input for question content
- **Alert**: Feedback messages for form validation and quiz results

### Customizations
- **GlassCard**: Custom card variant with `backdrop-blur-md bg-white/75 border border-white/20 shadow-xl` for glassmorphic effect
- **GradientButton**: Custom button with `bg-gradient-to-r from-primary via-accent to-secondary` with hover scale
- **MathRenderer**: Custom component wrapping LaTeX rendering with error boundaries
- **VariableInput**: Custom compound component for defining variable ranges (name + min + max inputs)
- **ChartCard**: Custom wrapper around recharts with consistent styling and loading states

### States
- **Buttons**: Default with gradient, hover with scale-105 and brightness increase, active with scale-95, disabled with opacity-50 and grayscale
- **Inputs**: Default with subtle border, focus with ring-2 ring-primary shadow-lg, error with ring-destructive, success with subtle green glow
- **Cards**: Default with glass effect, hover with enhanced shadow and slight lift (translate-y), selected with border-primary

### Icon Selection
- **BookOpen**: Subject/topic representation
- **Brain**: Diagnostics and smart analysis
- **Plus/Minus**: CRUD operations
- **Play**: Start quiz
- **Check/X**: Answer feedback
- **TrendingUp**: Performance metrics
- **Edit/Trash**: Content management
- **User/UserCog**: Role identification (student/admin)
- **BarChart/Activity**: Analytics visualization
- **Sparkles**: Dynamic question indicator

### Spacing
- Container padding: `p-6` on mobile, `p-8` on desktop
- Card internal spacing: `p-6` with `gap-4` for content
- Form field spacing: `gap-6` between fields, `gap-2` for label-input pairs
- Section margins: `mb-8` for major sections, `mb-4` for subsections
- Grid gaps: `gap-6` for card grids, `gap-4` for data tables

### Mobile
- **Dashboard**: Single column card layout with full-width elements, collapsible navigation drawer
- **Tables**: Transform to card-based list view with stacked data points
- **Charts**: Reduce to essential metrics, single chart per viewport with swipe navigation
- **Forms**: Stack all inputs vertically with touch-friendly 44px minimum tap targets
- **Quiz**: Full-screen question display with fixed bottom navigation for prev/next
- **Navigation**: Hamburger menu with slide-out drawer, role indicator always visible in header

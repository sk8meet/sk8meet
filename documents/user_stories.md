# Sk8Meet: User Stories and MVP Feature Set

## Core User Roles

Based on the documentation and feedback, we have these primary user roles:

1. **System Administrator**: Manages the overall platform and has access to all functionality
2. **Organization Administrator**: Manages a specific skating organization, its settings, and members
3. **Event Organizers**: Plan and manage events, coordinate marshals, and communicate with participants
4. **Marshals**: Help run events, with various specialized roles (Lead Marshal, Rear Marshal, Scout Marshal, etc.)
5. **Participants**: Attend events and engage with the community

*Note: Users can have multiple roles across multiple organizations. For example, a user could be a Marshal in LFNS, a Lead Marshal in LondonSkate, and an Organization Administrator for a new skating group they created.*

## Organization Management

### Organization Creation and Setup

**User Stories:**

- As a user, I want to create a new skating organization so that I can manage my own skating community
- As a user who creates an organization, I want to automatically become an organization administrator so that I can manage the organization
- As an organization administrator, I want to configure organization settings so that they reflect our specific structure and needs
- As an organization administrator, I want to customize role names so that they match our organization's terminology
- As an organization administrator, I want to assign the organization administrator role to other users so that we can share administrative responsibilities
- As an organization administrator, I want to create email distribution lists so that I can notify specific groups about events

**Acceptance Criteria:**

- Any user can create a new organization
- Organization creator automatically becomes an organization administrator
- Organization settings configuration
- Customizable role terminology
- Organization-specific branding options
- Ability to assign organization administrator role to other users
- Email distribution list creation and management
- Option to send notifications to selected distribution lists when events are published

### Role Management

**User Stories:**

- As an organization administrator, I want to define custom roles specific to our organization so that they reflect our operational structure
- As an organization administrator, I want to assign permissions to roles so that users have appropriate access
- As an organization administrator, I want to define role dependencies (e.g., Lead Marshal requires Marshal, Rear Marshal, and Scout Marshal roles) so that proper qualification is maintained
- As an organization administrator, I want to invite users to join our organization with specific roles so that they can contribute appropriately
- As a user, I want to request to join an organization as a participant and be automatically approved so that I can attend events
- As a user, I want to request to join an organization in other roles (e.g., marshal) for administrator approval so that I can contribute more actively
- As a user with membership in multiple organizations, I want to switch between organizations so that I can perform tasks according to my roles in each

**Acceptance Criteria:**

- Custom role creation with organization-specific names
- Permission assignment to roles
- Role dependency configuration (prerequisites for each role)
- User invitation system with specific role assignment
- Automatic approval for participant role requests
- Review and approval workflow for other role requests
- Organization switching functionality for users with multiple memberships
- Support for users having multiple roles within the same organization
- Support for users having different roles across different organizations
- Clear indication of which organization context the user is currently operating in

## Example Organization Setups

### LondonSkate (Centralized Model)

- **Organization Structure**:
    - Small organizing committee (LSO) with 4-5 members
    - Committee members have administrative access
    - General marshals have limited permissions

- **Custom Roles**:
    - Marshal (base role)
    - Marshal One (leads the pack)
    - Tail Marshal (equivalent to Rear Marshal)
    - Control Marshal (combines Scout and Lead Marshal functions)
    - LSO Member (administrative role)

- **Role Dependencies**:
    - Marshal One requires Marshal role
    - Tail Marshal requires Marshal role
    - Control Marshal requires Marshal role
    - LSO Member has no prerequisites

- **Permissions Example**:
    - LSO Members can create events and update go/no-go status
    - Control Marshals can create and edit routes
    - All marshals can indicate availability

### LFNS (Distributed Model)

- **Organization Structure**:
    - All marshals belong to the LFNS Marshal's Association
    - More equal distribution of permissions

- **Custom Roles**:
    - Marshal (base role)
    - Rear Marshal (RM)
    - Scout Marshal (SM)
    - Lead Marshal (LM)

- **Role Dependencies**:
    - Rear Marshal requires Marshal role
    - Scout Marshal requires Marshal role
    - Lead Marshal requires Marshal, Rear Marshal, and Scout Marshal roles

- **Permissions Example**:
    - Lead Marshals can create events and update go/no-go status
    - All marshals can create and edit routes
    - All marshals can indicate availability

## MVP Feature Set

### 1. User and Organization Management

**User Stories:**

- As a user, I want to create an account so that I can access the platform
- As a user, I want to create a new skating organization so that I can manage my own skating community
- As an organization administrator, I want to customize roles and permissions so that they match our organizational structure
- As an organization administrator, I want to define role dependencies so that proper qualification is maintained
- As an organization administrator, I want to invite users to join our organization with specific roles so that they can contribute appropriately
- As an organization administrator, I want to create and manage email distribution lists so that I can notify specific groups about events
- As a user, I want to join multiple organizations with different roles so that I can participate in various skating communities
- As a user with membership in multiple organizations, I want to switch between organizations so that I can perform tasks according to my roles in each
- As a user, I want to update my profile information so that others can identify me
- As a user, I want to see all public events from all organizations so that I can discover skating activities without being a member

**Acceptance Criteria:**

- User registration with email verification
- Organization creation and configuration
- Profile management
- Role and permission customization
- Role dependency configuration
- Organization invitation system with role specification
- Email distribution list management
- Support for users having multiple roles across multiple organizations
- Organization switching functionality
- Automatic approval for participant role requests
- Review process for other role requests
- Public event discovery without requiring organization membership

### 2. Event Planning & Management

**User Stories:**

- As an event organizer, I want to create new events with date, time, and location details so that I can plan our skating activities
- As an event organizer, I want to save events as drafts so that I can complete the planning process before publishing
- As an event organizer, I want to publish events so that they become visible to marshals and participants
- As an event organizer, I want to clone previous events so that I don't have to recreate similar events from scratch
- As an event organizer, I want to set up recurring events so that regular skates are easier to manage
- As an event organizer, I want to update the go/no-go status of an event so that participants know if an event is proceeding
- As an event organizer, I want to send notifications to selected email distribution lists when publishing an event so that interested parties are informed

**Acceptance Criteria:**

- Event creation with draft and published states
- Event details including date, time, start/end points
- Event cloning functionality
- Recurring event setup
- Go/no-go status updates
- Email notifications to distribution lists
- Public visibility of published events to all users

### 3. Marshal Management

**User Stories:**

- As a marshal, I want to indicate my availability for upcoming events so that organizers know who is available
- As an event organizer, I want to assign roles to marshals for specific events so that responsibilities are clear
- As a marshal, I want to see which events I'm assigned to and what my role is so that I can prepare accordingly
- As an event organizer, I want to track marshal attendance so that I can manage the team effectively

**Acceptance Criteria:**

- Marshal availability indication
- Role assignment for events
- Marshal-specific event views
- Attendance tracking
- Support for organization-specific marshal role terminology

### 4. Route Planning & Management

**User Stories:**

- As an event organizer, I want to create routes using OpenStreetMap so that I can plan skate paths
- As an event organizer, I want to add skating-specific metadata to routes (surface quality, hills) so that routes are suitable for skating
- As an event organizer, I want to save routes to a library so that they can be reused
- As a marshal, I want to access route information on my mobile device so that I can navigate during events
- As an event organizer, I want to import/export routes in GPX format so that I can use external tools if needed
- As a marshal, I want to plan routes and add them to my personal library or the organizational library so that they can be used for future events

**Acceptance Criteria:**

- OpenStreetMap integration
- Route creation and editing
- Surface quality and gradient indicators
- Route library functionality (personal and organizational)
- Mobile-friendly interface
- GPX import/export
- Ability for marshals to create and share routes

### 5. Community Engagement (Basic)

**User Stories:**

- As a participant, I want to discover upcoming events from all organizations so that I can plan to attend
- As a participant, I want to register interest in events so that organizers can gauge attendance
- As a participant, I want to provide feedback on events I've attended so that organizers can improve future events

**Acceptance Criteria:**

- Public event discovery without requiring organization membership
- Event registration
- Basic feedback collection
- Simple participant profiles

### 6. API for External Websites

**User Stories:**

- As a website owner, I want to access event data via API so that I can display it on my website
- As an event organizer, I want our events to appear on community websites so that we reach a wider audience

**Acceptance Criteria:**

- RESTful API endpoints for events and routes
- Authentication for API access
- Documentation for API consumers

## Future Enhancements (Post-MVP)

These features are important but can be implemented after the MVP:

### 1. Equipment Management

- Inventory tracking
- Check-out/check-in system
- Equipment status tracking

### 2. Marshal Training & Development

- Training materials repository
- Training progression tracking
- Knowledge sharing platform

### 3. Advanced Community Features

- Gamification elements
- Photo/video sharing
- Social media integration
- Surface condition reporting

### 4. Analytics & Reporting

- Event attendance metrics
- Route popularity tracking
- Marshal participation statistics
- Feedback analysis

## Development Approach

I recommend an iterative approach to implementing the MVP:

1. **Iteration 1**: User Management, Organization Setup, and Role Management
2. **Iteration 2**: Event Planning and Management
3. **Iteration 3**: Marshal Management and Coordination
4. **Iteration 4**: Route Planning and Management
5. **Iteration 5**: Basic Community Engagement and API
6. **Iteration 6**: Testing, refinement, and deployment

Each iteration should include design, development, testing, and user feedback to ensure we're building the right product.

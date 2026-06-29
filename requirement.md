# Portfolio AI - Requirements Document

Version: 1.0

Author: Rahul Sahani

Status: Draft

---

# 1. Project Overview

## Vision

Portfolio AI is an AI-powered SaaS platform that enables users to generate beautiful, professional portfolio websites from their resumes within minutes.

Users upload a PDF or DOCX resume, review the extracted information, choose a portfolio template, preview their website instantly, and publish it with a unique URL.

The platform is designed to be low-cost, scalable, and extensible to support multiple website types in the future.

---

# 2. Problem Statement

Creating a personal portfolio website requires technical knowledge, design skills, and hosting configuration.

Many students, professionals, and freelancers already have resumes but lack a modern online presence.

Portfolio AI automates the complete process from resume to live website.

---

# 3. Objectives

* Eliminate manual portfolio creation.
* Generate websites from resumes using AI.
* Provide multiple professional templates.
* Allow users to preview before purchasing.
* Publish static websites with a single click.
* Support thousands of hosted portfolios with minimal infrastructure cost.

---

# 4. Target Users

* Students
* Software Developers
* Designers
* Freelancers
* Job Seekers
* Consultants
* Professionals

---

# 5. User Journey

1. User signs up.
2. User uploads a PDF or DOCX resume.
3. AI extracts structured information.
4. User reviews and edits the extracted data.
5. User selects a portfolio template.
6. User previews the portfolio instantly.
7. User purchases a publishing plan.
8. Portfolio AI generates a static website.
9. Website is published.
10. User receives a public URL.

---

# 6. Functional Requirements

## Authentication

### User Registration

* Email registration
* Password authentication
* Email verification

### Login

* JWT Authentication
* Refresh Tokens

### Password Reset

* Forgot Password
* Reset Password

---

## Resume Upload

Supported Formats

* PDF
* DOCX

Maximum Size

* 10 MB

Validation

* File type validation
* File size validation
* Malware scanning (future)

---

## Resume Parsing

The system must extract:

* Full Name
* Profile Picture (optional)
* Professional Title
* Summary
* Skills
* Education
* Experience
* Projects
* Certifications
* Contact Information
* GitHub
* LinkedIn
* Website
* Social Links

Output format:

```json
{
  "name": "",
  "title": "",
  "summary": "",
  "skills": [],
  "experience": [],
  "education": [],
  "projects": [],
  "certifications": []
}
```

---

## Portfolio Editor

Users must be able to:

* Edit every extracted field
* Add or remove sections
* Upload profile image
* Add custom sections
* Reorder sections
* Save draft

---

## Template System

The platform should provide multiple templates.

Each template contains:

* Layout
* Components
* Theme
* Typography
* Colors
* Animations

Template Categories

* Developer
* Designer
* Student
* Corporate
* Minimal
* Creative

---

## Portfolio Preview

Preview should:

* Render instantly
* Use user's own data
* Not deploy a website
* Support switching templates
* Update immediately after edits

Preview is generated dynamically in the frontend.

---

## Website Publishing

Publishing should:

* Generate static HTML/CSS/JS
* Upload files to object storage
* Make website publicly accessible
* Return website URL

Example

```
https://portfolio.company.com/rahul
```

---

## Website Management

Users can:

* Edit website
* Republish
* Delete website
* View publish history
* Renew hosting plan

---

## Subscription Plans

Possible plans

Starter

* 10 days

Basic

* 30 days

Professional

* 6 months

Premium

* 1 year

Future plans may include:

* Custom Domains
* Analytics
* SEO Reports

---

# 7. Non Functional Requirements

Performance

Resume Parsing

< 10 seconds

Website Generation

< 30 seconds

Website Load Time

< 2 seconds

Availability

99.9%

Scalability

Support:

* 1,000 users initially
* 100,000+ users in future

Security

* HTTPS
* JWT Authentication
* Password Hashing
* Rate Limiting
* Secure File Uploads

---

# 8. Technical Requirements

Frontend

* React
* TypeScript
* Tailwind CSS
* React Router
* Zustand
* Axios

Backend

* Node.js
* Express.js
* TypeScript

Database

* PostgreSQL
* Prisma ORM

Queue

* Redis
* BullMQ

Storage

* Cloudflare R2 or AWS S3

CDN

* Cloudflare CDN
* AWS CloudFront

Payments

* Razorpay

Authentication

* JWT
* Refresh Tokens

---

# 9. Preview Architecture

Preview must NOT publish websites.

Flow

Resume JSON

↓

React Template

↓

Dynamic Rendering

↓

Preview

No storage upload.

No CDN.

No deployment.

---

# 10. Publishing Architecture

Publishing Flow

User clicks Publish

↓

Payment verified

↓

Job added to queue

↓

Worker generates static website

↓

Files uploaded to object storage

↓

CDN serves website

↓

Website becomes live

---

# 11. Static Website Requirements

Generated website must include:

* HTML
* CSS
* JavaScript
* Images
* Assets

Generated websites must:

* Load quickly
* Be SEO friendly
* Be mobile responsive
* Support Open Graph tags
* Support favicon
* Support custom metadata

---

# 12. API Requirements

Authentication

* Register
* Login
* Refresh Token

Resume

* Upload
* Parse
* Get Parsed Data

Templates

* List Templates
* Preview Template

Sites

* Create
* Update
* Publish
* Delete

Subscriptions

* Purchase
* Renew
* Cancel

---

# 13. Database Requirements

Entities

* Users
* Resumes
* Templates
* Sites
* Subscriptions
* Payments

Relationships

User

├── Resumes

├── Sites

├── Payments

└── Subscriptions

---

# 14. Admin Requirements

Administrator should manage:

* Users
* Templates
* Websites
* Payments
* Reports
* Subscriptions

Dashboard metrics

* Total Users
* Published Sites
* Active Subscriptions
* Revenue
* Failed Resume Parsing
* Storage Usage

---

# 15. MVP Scope

Included

* Authentication
* Resume Upload
* Resume Parsing
* Portfolio Editor
* 5 Portfolio Templates
* Dynamic Preview
* Website Publishing
* Public URL
* Basic Admin Dashboard

Excluded

* Custom Domains
* AI Resume Improvement
* Analytics
* Blog Builder
* Team Accounts
* Multi-language Support

---

# 16. Future Roadmap

Phase 2

* Custom Domains
* SEO Optimizer
* Analytics
* Resume Builder

Phase 3

* Business Websites
* Startup Landing Pages
* Agency Websites
* Personal Websites

Phase 4

AI Website Generation from

* GitHub Profile
* LinkedIn Profile
* Existing Website
* Natural Language Prompt

---

# 17. Success Metrics

Business

* Registered Users
* Published Websites
* Conversion Rate
* Monthly Revenue
* Customer Retention

Technical

* Resume Parsing Accuracy
* Website Generation Time
* System Uptime
* Deployment Success Rate
* API Response Time

---

# 18. Acceptance Criteria

A release is considered successful when:

* Users can upload PDF/DOCX resumes.
* Resume data is parsed accurately.
* Users can edit parsed information.
* Users can preview multiple templates instantly.
* Users can publish websites after payment.
* Published websites are accessible through unique URLs.
* Users can edit and republish websites.
* Platform supports at least 1,000 active users without significant performance degradation.

---

# 19. Future Vision

Portfolio AI should evolve into a complete AI Website Generation Platform capable of creating multiple website types, including:

* Portfolio Websites
* Resume Websites
* Personal Websites
* Business Websites
* Landing Pages
* Agency Websites
* E-commerce Websites

The core platform should remain template-driven, allowing new website categories to be added without major architectural changes.

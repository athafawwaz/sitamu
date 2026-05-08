export const APP_VERSION = "1.15.2"

export interface ChangelogEntry {
  version: string
  date: string       // Format: YYYY-MM-DD
  type: 'major' | 'minor' | 'patch'
  description: string
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "1.15.2",
    date: "2026-05-08",
    type: "patch",
    description: "Implement live suggestions dropdown for TKNO search and fix ID collision logic"
  },
  {
    version: "1.15.1",
    date: "2026-05-08",
    type: "patch",
    description: "Fix ID collision for TKNO login by deriving ID from badge number"
  },
  {
    version: "1.15.0",
    date: "2026-05-08",
    type: "minor",
    description: "Implement Master Data TKNO with badge reform (TKO prefix 6, TKNO non-6) and unauthorized access control"
  },
  {
    version: "1.14.0",
    date: "2026-05-06",
    type: "minor",
    description: "Implement Bulk Approve feature for VP and SVP roles with selection checkboxes and floating action bar"
  },
  {
    version: "1.13.0",
    date: "2026-05-06",
    type: "minor",
    description: "Implement detailed Security Dashboard with split stats, quick actions, and recent activity feed"
  },
  {
    version: "1.12.1",
    date: "2026-05-06",
    type: "patch",
    description: "Add logout confirmation modal to prevent accidental logouts"
  },
  {
    version: "1.12.0",
    date: "2026-05-06",
    type: "minor",
    description: "Implement Pengantaran (Gojek/Paket) feature for Sekuriti, Refactor Mobile Navigation with Hamburger Menu, and fix build warnings"
  },
  {
    version: "1.11.1",
    date: "2026-05-04",
    type: "patch",
    description: "Fix Sekuriti form to default employee selection to empty and hide detail card"
  },
  {
    version: "1.11.0",
    date: "2026-05-04",
    type: "minor",
    description: "Redesign Login page with Badge/Password auth, premium split layout, and collapsible Quick Login panel"
  },
  {
    version: "1.10.0",
    date: "2026-05-04",
    type: "minor",
    description: "Implement auto-timestamp for Sekuriti Perumahan flow and redesign Data Tamu layout"
  },
  {
    version: "1.9.0",
    date: "2026-05-04",
    type: "minor",
    description: "Implement end-to-end mobile view with bottom navigation and responsive layout"
  },
  {
    version: "1.8.0",
    date: "2026-05-04",
    type: "minor",
    description: "Implement direct check-in and mandatory badge input for Security role on Perumahan destination"
  },
  {
    version: "1.7.0",
    date: "2026-05-04",
    type: "minor",
    description: "Add minimize/collapse sidebar feature with floating toggle button"
  },
  {
    version: "1.6.1",
    date: "2026-04-30",
    type: "patch",
    description: "Fix unclickable close button in Changelog Modal"
  },
  {
    version: "1.6.0",
    date: "2026-04-30",
    type: "minor",
    description: "Add App Versioning and Changelog feature with Futuristic UI"
  },
  {
    version: "1.5.1",
    date: "2026-04-30",
    type: "patch",
    description: "Ignore docs directory and stop tracking local documentation"
  },
  {
    version: "1.5.0",
    date: "2026-04-30",
    type: "minor",
    description: "Rename app to SITAMU and Refactor store directory"
  },
  {
    version: "1.4.1",
    date: "2026-04-28",
    type: "patch",
    description: "Fixing Error when Building"
  },
  {
    version: "1.4",
    date: "2026-04-28",
    type: "minor",
    description: "Adjusting Component Side Bar"
  },
  {
    version: "1.3",
    date: "2026-04-28",
    type: "minor",
    description: "Adding Approval Fitur for VP and SVP"
  },
  {
    version: "1.2.1",
    date: "2026-04-27",
    type: "patch",
    description: "Adjusting Placeholder"
  },
  {
    version: "1.2",
    date: "2026-04-27",
    type: "minor",
    description: "Creating Calendar UI for Field Input Tanggal"
  },
]

/*
 * Phase 1 preview data only.
 * Replace these demo records with source-verified movie data in Phase 2.
 * Never publish estimated or reported collections as confirmed figures.
 */
window.VS_MOVIES = [
  {
    id: "preview-running-01",
    title: "Now Running Movie",
    subtitle: "Example record · Hindi / Indian cinema",
    status: "now-running",
    statusLabel: "In cinemas",
    language: "Hindi",
    releaseDate: "Add verified release date",
    summary: "This card is a template for a film currently playing in cinemas.",
    metrics: [
      ["India Net", "Awaiting verified data"],
      ["India Gross", "Awaiting verified data"],
      ["Worldwide", "Awaiting verified data"]
    ],
    update: "Collection source and update time will appear here"
  },
  {
    id: "preview-booking-01",
    title: "Advance Booking Movie",
    subtitle: "Example record · Multi-language release",
    status: "advance-booking",
    statusLabel: "Booking preview",
    language: "Multi-language",
    releaseDate: "Add confirmed release date",
    summary: "This card is a template for a film whose advance booking has opened.",
    metrics: [
      ["Booking status", "Awaiting confirmation"],
      ["Tickets sold", "Source required"],
      ["Gross booking", "Source required"]
    ],
    update: "Booking figures will be shown only with a named source"
  },
  {
    id: "preview-upcoming-01",
    title: "Upcoming Movie",
    subtitle: "Example record · International cinema",
    status: "coming-soon",
    statusLabel: "Coming soon",
    language: "English",
    releaseDate: "Add officially announced release date",
    summary: "This card is a template for an announced film that has not opened yet.",
    metrics: [
      ["Release date", "To be verified"],
      ["Advance booking", "Not announced"],
      ["Collection", "Not released"]
    ],
    update: "Release details will link to official or reliable announcements"
  }
];

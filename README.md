# JabLab

**Upload a training video. Get your strikes counted, your form graded, and feedback on what to fix.**

**Status: In development.** This README describes what RingIQ is being built to do.

---

## About

People who train alone, at home or in the gym without a coach, don't have anyone watching their technique. Bad habits like dropping the guard, not fully extending a jab, or cutting squats short go unnoticed and turn into habits.

JabLab is a full-stack web app that acts as a coach in your corner. You upload a video of your boxing, Muay Thai, kickboxing, or strength session, and JabLab tracks your body through the video, counts your strikes and reps, grades your form, and saves your results so you can see how your technique improves over time.

## How It Works

1. **Pick a discipline** (boxing, Muay Thai/kickboxing, or strength) and upload a video of your session.
2. **Watch it get analyzed.** The video plays with a skeleton drawn over your body while strikes and reps are counted in real time.
3. **Get your results.** See your overall score, a breakdown by technique, your most common mistake, and what to work on next.
4. **Track your progress.** Sessions are saved to your history so you can follow your scores, streaks, and improvement over time.

## Privacy

Your video never leaves your device. All of the video analysis happens in the browser, and only your session stats (counts, scores, and feedback) are saved to the database.

## Planned Features

### Core (Demo Day)
- [ ] Video upload with skeleton overlay
- [ ] Live strike and rep counters during analysis
- [ ] Jab and cross detection and grading
- [ ] Kick and knee detection
- [ ] Form-drop alerts when technique starts to break down
- [ ] Session report with overall score, technique breakdown, and feedback
- [ ] Session history with a progress chart
- [ ] Daily training streak
- [ ] Workout routines (preset and user-created)
- [ ] User accounts

### Try It Without an Account
- [ ] **Sample video:** see a full analysis with one click, no upload needed
- [ ] **Guest mode:** analyze your own video without signing up (results aren't saved)
- [ ] **Demo account:** log in to a pre-filled account to explore history, progress, and routines

## CRUD

| Operation | What the user can do |
|---|---|
| **Create** | Create an account, save a session after analysis, create a custom routine |
| **Read** | View session history, a single session's results, progress and streak, and routines |
| **Update** | Edit a session's name or notes, edit a routine, edit profile settings (name, stance) |
| **Delete** | Delete a session, delete a routine, delete an account along with all of its data |

## Tech Stack

- **Front end:** HTML, CSS, vanilla JavaScript, EJS
- **Pose detection:** MediaPipe Pose Landmarker (`@mediapipe/tasks-vision`)
- **Back end:** Node.js, Express
- **Database:** MongoDB

## Getting Started

_Setup instructions will be added once the first working version is ready._

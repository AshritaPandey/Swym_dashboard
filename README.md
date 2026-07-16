# Merchant Churn Dashboard

A proactive, dynamic Merchant Churn Dashboard built for the CX AI-Proficiency Build Round. This React application helps Customer Success teams monitor merchant health, calculate churn risk in real-time based on specific signals, and determine immediate next steps.

**Live Demo:** [https://AshritaPandey.github.io/Swym_dashboard/](https://AshritaPandey.github.io/Swym_dashboard/)

## 🚀 Features

- **Dynamic Risk Scoring:** Evaluates merchants based on custom logic (Engagement Drop-off, Technical Friction, Support Frustration).
- **Automated Next Steps:** Recommends tactical interventions based on the exact combination of risk signals triggered.
- **Local Persistence:** Add custom merchants dynamically via the UI, and data is saved via `localStorage` directly in your browser. 
- **Premium Theming:** Includes a fully responsive grid, smooth stagger animations, and a seamless Light/Dark mode toggle.
- **AI Chat Assistant:** A mock contextual AI widget that parses keywords to explain the dashboard logic, features, and risk scoring to users.

## 🧠 The Logic (v1 Specification)

Merchants are evaluated against three key thresholds:
1. **Engagement Drop-off:** `>= 14 Days` since the last platform login.
2. **Technical Friction:** `>= 5.0%` API Error Rate over the last 7 days.
3. **Support Frustration:** `>= 3` Open Support Tickets.

**Risk Tiers:**
- 🔴 **High Risk:** 2 or more signals triggered (Action: Immediate CSM Intervention + specific tactical steps).
- 🟡 **Medium Risk:** Exactly 1 signal triggered (Action: Signal-specific tactical action).
- 🟢 **Safe:** 0 signals triggered (Action: Monitor normally).

## 💻 Tech Stack

- **Framework:** React + Vite
- **Styling:** Vanilla CSS with custom CSS variables for theming and keyframe animations.
- **Deployment:** GitHub Pages
- **State Management:** React Hooks (`useState`, `useMemo`, `useEffect`) and `localStorage`.

## 🛠️ Local Development

To run this project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/AshritaPandey/Swym_dashboard.git
   ```
2. Navigate into the directory:
   ```bash
   cd Swym_dashboard
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

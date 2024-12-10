# Installation Guide

## System Requirements
- **Node.js**: Version 14.x or later.
- **npm**: Version 6.x or later (comes with Node.js).
- **Expo CLI**: No prior installation required; handled via `npx`.

## Steps to Install and Run the App

1. **Clone or Download the Repository**
   - Ensure you have the FitnessTracker folder available locally.

2. **Navigate to the Project Directory**
   - Open a terminal window and run the following command:
     ```bash
     cd FitnessTracker
     ```

3. **Install Dependencies**
   - Install the required dependencies by running:
     ```bash
     npm install
     ```

4. **Start the Application**
   - Launch the app using Expo CLI with:
     ```bash
     npx expo start
     ```

5. **View the Application**
   - Follow the instructions displayed in the terminal to open the app on an emulator, simulator, or physical device using the Expo Go app.

## Troubleshooting
- Ensure Node.js and npm are installed and updated.
- If the `npm install` command fails, try deleting the `node_modules` folder and the `package-lock.json` file, then rerun `npm install`.
- If Expo doesn’t start, ensure your system firewall or antivirus isn’t blocking the CLI.

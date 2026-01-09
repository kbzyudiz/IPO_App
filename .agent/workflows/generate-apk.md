---
description: Steps to generate an Android APK for the IPO Allotment app
---

To convert this web application into a mobile APK, we will use **Capacitor**. It acts as a bridge between your web code (React/Vite) and the Android native platform.

### Prerequisites
1.  **Node.js**: Installed on your system.
2.  **Android Studio**: Installed and configured with SDKs (required for final APK generation).
3.  **Java (JDK)**: Recommended JDK 17 or later.

---

### Step-by-Step Implementation

#### 1. Install Capacitor
In your project terminal, run:
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
```

#### 2. Initialize Capacitor
Initialize the project with your app name and package ID:
```bash
npx cap init "IPO Watch" "com.ipoinfo.app" --web-dir dist
```

#### 3. Build the Web Application
Capacitor needs a production build of your website to wrap it.
```bash
npm run build
```

#### 4. Add the Android Platform
This creates a native Android project folder (`/android`) inside your project.
```bash
npx cap add android
```

#### 5. Sync the Code
Every time you make a change in your React code and run `npm run build`, you must sync those changes to the Android folder:
```bash
npx cap sync
```

#### 6. Open in Android Studio
Now, open the native project in Android Studio to build the final APK:
```bash
npx cap open android
```

#### 7. Generate the APK inside Android Studio
Once Android Studio opens the project and finishes indexing:
1.  Go to the top menu: **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
2.  Wait for the build to complete. 
3.  When done, a popup will appear at the bottom right. Click **Locate** to find your `app-debug.apk`.

---

### Pro Tip: Live Reload (Optional)
If you want to test the app on your phone while developing (changes show up instantly):
```bash
npx cap run android -l --external
```
*(Ensure your phone and PC are on the same Wi-Fi)*

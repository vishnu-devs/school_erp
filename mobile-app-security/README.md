# React Native Mobile App Security Guide

To integrate the Enterprise Security Service, your mobile team must implement the following:

## 1. Dependencies
```bash
npm install jail-monkey rn-secure-storage react-native-ssl-pinning react-native-screenshot-prevent
```

## 2. Screenshot Prevention (For Sensitive Screens)
In your sensitive screens (like Payments or Report Cards):
```javascript
import RNScreenshotPrevent from 'react-native-screenshot-prevent';

useEffect(() => {
    RNScreenshotPrevent.enabled(true);
    return () => {
        RNScreenshotPrevent.enabled(false);
    };
}, []);
```

## 3. SSL Pinning Configuration
- **Android:** Place your server's certificate (`schoolites_cert.cer`) in `android/app/src/main/assets/`.
- **iOS:** Add `schoolites_cert.cer` to your Xcode project resources.

## 4. Code Obfuscation (Proguard)
Add the following to `android/app/proguard-rules.pro` to prevent reverse engineering of the APK:
```proguard
-keep class com.jailmonkey.** { *; }
-keep class com.rnsecurestorage.** { *; }
-keep class com.reactnativesslpinning.** { *; }

# Obfuscate all API endpoints and keys
-repackageclasses ''
-allowaccessmodification
-optimizations !code/simplification/arithmetic
-keepattributes *Annotation*
```

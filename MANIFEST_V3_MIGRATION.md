# Chrome Extension Manifest V3 Migration Guide

## Changes Made

This extension has been successfully migrated from Manifest V2 to Manifest V3. Here are the key changes:

### 1. Manifest.json Updates

- **manifest_version**: Updated from 2 to 3
- **permissions**: Split into `permissions` and `host_permissions`
- **browser_action**: Renamed to `action`
- **background**: Changed from `scripts` array to `service_worker`
- **web_accessible_resources**: Updated to new object format with `resources` and `matches`
- **optional_permissions**: Added `scripting` permission for script injection

### 2. Background Script Migration

- **Service Worker**: Converted background.js to work as a service worker
- **API Updates**: Replaced `chrome.tabs.executeScript` with `chrome.scripting.executeScript`
- **Async/Await**: Updated callback-based code to use modern async/await patterns
- **Error Handling**: Improved error handling for script injection

### 3. Key Technical Changes

- Removed dependency on DOM and window objects in background script
- Updated script injection logic to use the new scripting API
- Maintained backward compatibility where possible
- Improved permission checking logic

## How to Package and Load the Extension

### Option 1: Load as Unpacked Extension (Development)

1. **Open Chrome Extensions Page**
   - Navigate to `chrome://extensions/` in Chrome
   - OR click the three dots menu → More Tools → Extensions

2. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

3. **Load the Extension**
   - Click "Load unpacked" button
   - Navigate to and select the `src/` folder of this project
   - The extension should now appear in your extensions list

4. **Test the Extension**
   - Visit a Plex website (app.plex.tv)
   - Click the extension icon in the toolbar
   - Verify all features work as expected

### Option 2: Create a Packaged Extension (.crx)

1. **Package in Chrome**
   - Go to `chrome://extensions/`
   - Enable Developer mode
   - Click "Pack extension"
   - Select the `src/` folder as the extension root directory
   - Leave the private key field empty (for first time)
   - Click "Pack Extension"

2. **Install the .crx File**
   - Chrome will create a .crx file and a .pem file
   - You can distribute the .crx file for installation
   - Note: Chrome may block .crx installations for security

### Option 3: Create ZIP for Distribution

1. **Create a ZIP Archive**
   ```bash
   # Navigate to the project root
   cd enhance-o-tron-for-plex-1
   
   # Create a ZIP of just the src folder contents
   zip -r enhance-o-tron-v3.zip src/
   ```

2. **Manual Installation from ZIP**
   - Users extract the ZIP file
   - Follow the "Load as Unpacked Extension" steps above
   - Select the extracted folder

## Chrome Web Store Submission

To publish to the Chrome Web Store:

1. **Prepare for Submission**
   - Ensure all features work correctly
   - Test on multiple Plex domains
   - Verify no console errors

2. **Create Store Package**
   - ZIP the contents of the `src/` folder
   - Ensure the ZIP contains manifest.json at the root level

3. **Submit to Chrome Web Store**
   - Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
   - Pay the one-time $5 developer registration fee
   - Upload your ZIP file
   - Fill out store listing details
   - Submit for review

## Testing Checklist

- [ ] Extension loads without errors
- [ ] Extension icon appears in Chrome toolbar
- [ ] Options popup opens correctly
- [ ] Trailer links appear on Plex movie pages
- [ ] Permission requests work properly
- [ ] Extension works on app.plex.tv
- [ ] Extension respects optional host permissions
- [ ] No console errors in background service worker
- [ ] All internationalization (i18n) messages display correctly

## Troubleshooting

### Common Issues

1. **Extension doesn't load**
   - Check that manifest.json is in the root of the selected folder
   - Verify manifest.json syntax is valid
   - Check Chrome DevTools console for errors

2. **Scripts don't inject**
   - Verify host permissions are granted
   - Check that the scripting permission is enabled
   - Test on a permitted domain (app.plex.tv)

3. **Service Worker errors**
   - Open Chrome DevTools → Extensions tab
   - Click "Inspect views: service worker" next to your extension
   - Check console for errors

### Development Tips

- Use `chrome://extensions/` to view extension details and errors
- Enable "Collect errors" in Developer mode for better debugging
- Check the service worker console separately from page console
- Test permission requests thoroughly

## Browser Compatibility

- **Chrome**: 88+ (Manifest V3 support)
- **Edge**: 88+ (Chromium-based versions)
- **Firefox**: Still uses Manifest V2 (separate version needed)

This migration maintains all original functionality while improving security and performance through Manifest V3's enhanced architecture. 
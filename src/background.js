// copyright 2020 conceptualspace

"use strict";

function handleInstalled(details) {
    if (details.reason === "install") {
        // set uninstall URL
        chrome.runtime.setUninstallURL("https://forms.gle/JqMEogANnkktEtSR9");
    } else if (details.reason === "update" && details.previousVersion === "1.4.0") {
        const url = chrome.runtime.getURL("updated.html");
        chrome.tabs.create({ url });
    }
}

// support custom plex domains
// in firefox, we require the tabs permission to access tab url, then we check it for permissions.
// in chrome, we can avoid the tabs permission, as chrome will return the tab url for permitted domains. so we get the permissions check for free
async function handleUpdatedTab(tabId, changeInfo, tabInfo) {
    // firefox (Note: Firefox still uses MV2, but keeping this for compatibility)
    if (typeof browser !== 'undefined' && tabInfo.url && tabInfo.url.startsWith("http") && changeInfo.status === 'complete') {
        try {
            const permissions = await chrome.permissions.contains({
                origins: [new URL(tabInfo.url).origin + "/*"]
            });
            
            if (permissions) {
                try {
                    // Check if script is already loaded
                    const result = await chrome.scripting.executeScript({
                        target: { tabId: tabId },
                        func: () => typeof window.enhanceotronLoaded !== 'undefined'
                    });
                    
                    if (!result[0].result) {
                        // Script not loaded, inject it
                        await chrome.scripting.executeScript({
                            target: { tabId: tabId },
                            func: () => { window.enhanceotronLoaded = true; }
                        });
                        
                        await chrome.scripting.executeScript({
                            target: { tabId: tabId },
                            files: ["/arrive.min.js"]
                        });
                        
                        await chrome.scripting.executeScript({
                            target: { tabId: tabId },
                            files: ["/content_script.js"]
                        });
                    }
                } catch (err) {
                    console.error('Failed to inject scripts:', err);
                }
            }
        } catch (err) {
            console.error('Permission check failed:', err);
        }
    }
    // chrome
    else if (typeof browser === 'undefined' && tabInfo.url && tabInfo.url.startsWith("http") && changeInfo.status === 'complete') {
        try {
            // Check if script is already loaded
            const result = await chrome.scripting.executeScript({
                target: { tabId: tabId },
                func: () => typeof window.enhanceotronLoaded !== 'undefined'
            });
            
            if (!result[0].result) {
                // Load content script
                await chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    func: () => { window.enhanceotronLoaded = true; }
                });
                
                await chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ["/arrive.min.js"]
                });
                
                await chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ["/content_script.js"]
                });
            }
        } catch (err) {
            // This is expected for tabs we don't have permission for
            // console.log('Script injection failed (normal for unpermitted domains):', err);
        }
    }
}

chrome.tabs.onUpdated.addListener(handleUpdatedTab);
chrome.runtime.onInstalled.addListener(handleInstalled);

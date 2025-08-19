89
Best Practices
User Experience
Displays images with incorrect aspect ratio
Image display dimensions should match natural aspect ratio. Learn more about image aspect ratio.
URL
Aspect Ratio (Displayed)
Aspect Ratio (Actual)
localhost 1st party
img.text-[#0ABAB5]
/_next/image?url=%2Ficons%2Fairport-from.svg&w=16&q=75(localhost)
16 x 16 (1.00)
24 x 17 (1.41)
img.text-[#0ABAB5]
/_next/image?url=%2Ficons%2Fairport-to.svg&w=16&q=75(localhost)
16 x 16 (1.00)
24 x 18 (1.33)
General
Browser errors were logged to the console
Errors logged to the console indicate unresolved problems. They can come from network request failures and other browser concerns. Learn more about this errors in console diagnostic audit
Source
Description
localhost 1st party
hero-bg.jpg:1
Failed to load resource: the server responded with a status of 404 (Not Found)
Issues were logged in the Issues panel in Chrome Devtools
Issues logged to the Issues panel in Chrome Devtools indicate unresolved problems. They can come from network request failures, insufficient security controls, and other browser concerns. Open up the Issues panel in Chrome DevTools for more details on each issue.
Issue type
Content security policy
Missing source maps for large first-party JavaScript
Source maps translate minified code to the original source code. This helps developers debug in production. In addition, Lighthouse is able to provide further insights. Consider deploying source maps to take advantage of these benefits. Learn more about source maps.
URL
Map URL
localhost 1st party
…chunks/src_bfdd4a34._.js(localhost)
…chunks/src_bfdd4a34._.js.map(localhost)
Large JavaScript file is missing a source map
Error: Map has no `mappings` field
…chunks/src_149b783b._.js(localhost)
…chunks/src_149b783b._.js.map(localhost)
Large JavaScript file is missing a source map
Error: Map has no `mappings` field
…chunks/node_modules_next_dist_compiled_react-dom_1f56dc06._.js(localhost)
…chunks/node_modules_next_dist_compiled_react-dom_1f56dc06.….map(localhost)
Large JavaScript file is missing a source map
Error: Map has no `mappings` field
…chunks/node_modules_next_dist_compiled_next-devtools_index_….js(localhost)
…chunks/node_modules_next_dist_compiled_next-devtools_index….map(localhost)
Large JavaScript file is missing a source map
Error: Map has no `mappings` field
…chunks/node_modules_8f0a0528._.js(localhost)
…chunks/node_modules_8f0a0528._.js.map(localhost)
Large JavaScript file is missing a source map
Error: Map has no `mappings` field
…chunks/node_modules_next_dist_compiled_0f1b9fd4._.js(localhost)
…chunks/node_modules_next_dist_compiled_0f1b9fd4._.js.map(localhost)
Error: Map has no `mappings` field
…chunks/node_modules_next_dist_client_20b209c9._.js(localhost)
…chunks/node_modules_next_dist_client_20b209c9._.js.map(localhost)
Error: Map has no `mappings` field
…chunks/node_modules_next_dist_445d8acf._.js(localhost)
…chunks/node_modules_next_dist_445d8acf._.js.map(localhost)
Error: Map has no `mappings` field
…chunks/node_modules_next_dist_01fcdebf._.js(localhost)
…chunks/node_modules_next_dist_01fcdebf._.js.map(localhost)
Error: Map has no `mappings` field
…chunks/node_modules_fd39d684._.js(localhost)
…chunks/node_modules_fd39d684._.js.map(localhost)
Error: Map has no `mappings` field
…chunks/node_modules_%40swc_helpers_cjs_8e433861._.js(localhost)
…chunks/node_modules_%40swc_helpers_cjs_8e433861._.js.map(localhost)
Error: Map has no `mappings` field
…chunks/%5Bturbopack%5D_browser_dev_hmr-client_hmr-client_ts….js(localhost)
…chunks/%5Bturbopack%5D_browser_dev_hmr-client_hmr-client_t….map(localhost)
Error: Map has no `mappings` field
…chunks/_01f48b92._.js(localhost)
…chunks/_01f48b92._.js.map(localhost)
Error: Map has no `mappings` field
DeepL: ИИ-переводчик и редактор Chrome Extension 
chrome-extension://cofdbpoegempjloogbagkncekinflcnj/build/content.js
chrome-extension://cofdbpoegempjloogbagkncekinflcnj/build/content.js.map
Error: Failed fetching source map (null)
Unattributable
chrome-extension://gighmmpiobklfepjocnamgkkbiglidom/vendor/@eyeo/webext-ad-filtering-solution/content.js
chrome-extension://gighmmpiobklfepjocnamgkkbiglidom/polyfill.js
chrome-extension://gighmmpiobklfepjocnamgkkbiglidom/polyfill.js.map
chrome-extension://gighmmpiobklfepjocnamgkkbiglidom/polyfill.js
chrome-extension://gighmmpiobklfepjocnamgkkbiglidom/polyfill.js.map
chrome-extension://gighmmpiobklfepjocnamgkkbiglidom/globals-front.js
chrome-extension://gighmmpiobklfepjocnamgkkbiglidom/globals-front.js.map
chrome-extension://gighmmpiobklfepjocnamgkkbiglidom/cookie-banner-detection.preload.js
chrome-extension://gighmmpiobklfepjocnamgkkbiglidom/cookie-banner-detection.preload.js.map

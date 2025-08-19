[18:08:44.791] Running build in Washington, D.C., USA (East) – iad1
[18:08:44.792] Build machine configuration: 2 cores, 8 GB
[18:08:44.869] Cloning github.com/korcevoy1994/flyluxsky (Branch: main, Commit: e95a99a)
[18:08:47.976] Cloning completed: 3.107s
[18:08:48.257] Restored build cache from previous deployment (58kLYxzpXkakkv58ggaEjFthwH3a)
[18:08:50.428] Running "vercel build"
[18:08:50.894] Vercel CLI 46.0.2
[18:08:51.350] Installing dependencies...
[18:08:54.821] 
[18:08:54.821] added 5 packages in 3s
[18:08:54.822] 
[18:08:54.822] 157 packages are looking for funding
[18:08:54.822]   run `npm fund` for details
[18:08:54.865] Detected Next.js version: 15.4.4
[18:08:54.870] Running "npm run build"
[18:08:54.989] 
[18:08:54.990] > flyluxsky@0.1.0 build
[18:08:54.991] > next build
[18:08:54.991] 
[18:08:55.963]    ▲ Next.js 15.4.4
[18:08:55.964]    - Experiments (use with caution):
[18:08:55.964]      ✓ optimizeCss
[18:08:55.968]      · optimizePackageImports
[18:08:55.968] 
[18:08:56.047]    Creating an optimized production build ...
[18:09:16.647]  ⚠ Compiled with warnings in 20.0s
[18:09:16.648] 
[18:09:16.648] ./node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js
[18:09:16.649] Critical dependency: the request of a dependency is an expression
[18:09:16.649] 
[18:09:16.649] Import trace for requested module:
[18:09:16.650] ./node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js
[18:09:16.650] ./node_modules/@supabase/realtime-js/dist/module/index.js
[18:09:16.650] ./node_modules/@supabase/supabase-js/dist/module/index.js
[18:09:16.650] ./src/lib/supabaseServer.ts
[18:09:16.650] ./src/app/api/reviews/route.ts
[18:09:16.651] 
[18:09:16.662]    Linting and checking validity of types ...
[18:09:28.818] 
[18:09:28.819] Failed to compile.
[18:09:28.819] 
[18:09:28.819] ./src/app/admin/airlines/page.tsx
[18:09:28.819] 21:16  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.819] 34:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.820] 49:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.820] 66:16  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.820] 
[18:09:28.820] ./src/app/admin/cities/page.tsx
[18:09:28.820] 54:14  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.820] 295:32  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[18:09:28.821] 
[18:09:28.821] ./src/app/admin/marketing/page.tsx
[18:09:28.821] 44:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.821] 67:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.821] 
[18:09:28.822] ./src/app/admin/pricing/page.tsx
[18:09:28.822] 18:8  Warning: 'RegionPricing' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.822] 34:16  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.822] 39:18  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.822] 69:17  Warning: 'err' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.822] 73:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.823] 93:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.823] 110:16  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.823] 
[18:09:28.823] ./src/app/admin/reviews/page.tsx
[18:09:28.823] 7:10  Warning: 'Tabs' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.823] 7:16  Warning: 'TabsContent' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.824] 7:29  Warning: 'TabsList' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.824] 7:39  Warning: 'TabsTrigger' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.824] 8:48  Warning: 'ImageIcon' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.824] 8:59  Warning: 'Star' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.824] 32:16  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.830] 37:18  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.830] 63:17  Warning: 'err' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.831] 67:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.831] 88:14  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.831] 
[18:09:28.831] ./src/app/admin/seo/page.tsx
[18:09:28.831] 62:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.831] 85:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.832] 
[18:09:28.832] ./src/app/airlines/british-airways/page.tsx
[18:09:28.832] 2:10  Warning: 'notFound' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.832] 
[18:09:28.832] ./src/app/api/cities/content/route.ts
[18:09:28.832] 31:12  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.833] 59:12  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.833] 
[18:09:28.833] ./src/app/api/kommo/route.ts
[18:09:28.833] 73:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.833] 
[18:09:28.833] ./src/app/api/marketing/codes/route.ts
[18:09:28.833] 44:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.834] 80:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.838] 
[18:09:28.839] ./src/app/api/pricing/route.ts
[18:09:28.839] 91:12  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.839] 152:12  Warning: 'err' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.839] 192:12  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.839] 
[18:09:28.840] ./src/app/api/seo/meta/route.ts
[18:09:28.840] 60:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.840] 107:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.840] 
[18:09:28.840] ./src/app/page.tsx
[18:09:28.840] 45:16  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.840] 
[18:09:28.841] ./src/app/privacy/page.tsx
[18:09:28.842] 47:6  Warning: React Hook useEffect has a missing dependency: 'sections'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[18:09:28.842] 
[18:09:28.842] ./src/app/search/page.tsx
[18:09:28.843] 473:9  Warning: 'selectedClass' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[18:09:28.843] 481:12  Warning: 'stickyFormOffset' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[18:09:28.843] 481:30  Warning: 'setStickyFormOffset' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[18:09:28.843] 594:8  Warning: React Hook useEffect has missing dependencies: 'setDepartureDate', 'setFromInput', 'setFromSelection', 'setPassengers', 'setReturnDate', 'setSelectedClass', 'setToInput', 'setToSelection', 'setTripType', and 'tripType'. Either include them or remove the dependency array.  react-hooks/exhaustive-deps
[18:09:28.843] 650:9  Warning: 'allFromCodes' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[18:09:28.843] 651:9  Warning: 'allToCodes' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[18:09:28.844] 664:11  Warning: 'fromAirport' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[18:09:28.844] 665:11  Warning: 'toAirport' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[18:09:28.844] 668:11  Warning: 'formatDate' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[18:09:28.844] 
[18:09:28.844] ./src/app/searching/page.tsx
[18:09:28.844] 29:11  Warning: 'x0' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[18:09:28.844] 30:11  Warning: 'x1' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[18:09:28.845] 31:11  Warning: 'x2' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[18:09:28.846] 32:11  Warning: 'x3' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[18:09:28.846] 67:6  Warning: React Hook useEffect has a missing dependency: 'providersCount'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[18:09:28.846] 146:25  Warning: 'x0' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[18:09:28.846] 147:25  Warning: 'x1' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[18:09:28.846] 148:25  Warning: 'x2' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[18:09:28.846] 149:25  Warning: 'x3' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[18:09:28.847] 
[18:09:28.847] ./src/app/terms/page.tsx
[18:09:28.847] 43:6  Warning: React Hook useEffect has a missing dependency: 'sections'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[18:09:28.847] 
[18:09:28.847] ./src/app/thank-you/page.tsx
[18:09:28.848] 3:8  Warning: 'Image' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.854] 12:6  Warning: 'SearchParams' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.855] 28:9  Warning: 'from' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[18:09:28.855] 29:9  Warning: 'to' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[18:09:28.855] 30:9  Warning: 'departure' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[18:09:28.855] 32:9  Warning: 'pax' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[18:09:28.855] 33:9  Warning: 'cls' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[18:09:28.856] 34:9  Warning: 'tripType' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[18:09:28.856] 
[18:09:28.856] ./src/components/airline-deals-section.tsx
[18:09:28.856] 178:10  Warning: 'isMobile' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[18:09:28.856] 
[18:09:28.856] ./src/components/airline-page.tsx
[18:09:28.856] 15:54  Warning: 'AdminAirlineContent' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.856] 345:7  Warning: 'IMAGE_FALLBACKS' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[18:09:28.857] 438:16  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.857] 
[18:09:28.857] ./src/components/best-deals-section.tsx
[18:09:28.857] 7:60  Warning: 'MultiCityFlight' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.857] 
[18:09:28.857] ./src/components/city-page.tsx
[18:09:28.857] 52:16  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.858] 85:16  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.858] 
[18:09:28.858] ./src/components/cruise-booking-modal.tsx
[18:09:28.858] 5:31  Warning: 'Users' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.858] 237:66  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[18:09:28.858] 
[18:09:28.858] ./src/components/custom-phone-input.tsx
[18:09:28.859] 217:3  Warning: 'className' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.859] 271:16  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.859] 277:6  Warning: React Hook useEffect has a missing dependency: 'value'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[18:09:28.859] 
[18:09:28.859] ./src/components/flight-search-form-mobile.tsx
[18:09:28.859] 296:6  Warning: React Hook useEffect has missing dependencies: 'setMultiFromSuggestions', 'setMultiPopovers', 'setMultiSegments', 'setMultiShowFromSuggestions', 'setMultiShowToSuggestions', and 'setMultiToSuggestions'. Either include them or remove the dependency array. If 'setMultiSegments' changes too often, find the parent component that defines it and wrap that definition in useCallback.  react-hooks/exhaustive-deps
[18:09:28.859] 496:6  Warning: React Hook useEffect has missing dependencies: 'setMultiPopovers', 'setMultiShowFromSuggestions', and 'setMultiShowToSuggestions'. Either include them or remove the dependency array. If 'setMultiPopovers' changes too often, find the parent component that defines it and wrap that definition in useCallback.  react-hooks/exhaustive-deps
[18:09:28.859] 
[18:09:28.860] ./src/components/hotel-booking-modal.tsx
[18:09:28.860] 163:10  Warning: 'citySelection' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[18:09:28.860] 169:10  Warning: 'guestDropdownPosition' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[18:09:28.860] 
[18:09:28.860] ./src/components/hotels-cruise-section.tsx
[18:09:28.866] 4:8  Warning: 'Link' is defined but never used.  @typescript-eslint/no-unused-vars
[18:09:28.866] 30:13  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[18:09:28.866] 61:13  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[18:09:28.866] 
[18:09:28.867] ./src/hooks/useFlightSearch.ts
[18:09:28.867] 59:6  Warning: React Hook useEffect has a missing dependency: 'multiSegments.length'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[18:09:28.867] 
[18:09:28.867] info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/app/api-reference/config/eslint#disabling-rules
[18:09:28.933] Error: Command "npm run build" exited with 1
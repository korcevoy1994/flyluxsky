[17:15:55.276] Running build in Washington, D.C., USA (East) – iad1
[17:15:55.277] Build machine configuration: 2 cores, 8 GB
[17:15:55.304] Cloning github.com/korcevoy1994/flyluxsky (Branch: main, Commit: 1b708b8)
[17:15:58.610] Cloning completed: 3.305s
[17:15:59.331] Restored build cache from previous deployment (4odUQYZtThBi8u8iJBS2YPN5Bxpy)
[17:16:01.968] Running "vercel build"
[17:16:02.643] Vercel CLI 45.0.9
[17:16:03.086] Installing dependencies...
[17:16:04.758] 
[17:16:04.759] added 14 packages in 1s
[17:16:04.760] 
[17:16:04.760] 148 packages are looking for funding
[17:16:04.760]   run `npm fund` for details
[17:16:04.793] Detected Next.js version: 15.4.4
[17:16:04.797] Running "npm run build"
[17:16:04.908] 
[17:16:04.909] > flyluxsky@0.1.0 build
[17:16:04.909] > next build
[17:16:04.909] 
[17:16:06.136]    ▲ Next.js 15.4.4
[17:16:06.137] 
[17:16:06.178]    Creating an optimized production build ...
[17:16:18.036]  ⚠ Compiled with warnings in 10.0s
[17:16:18.037] 
[17:16:18.037] ./node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js
[17:16:18.037] Critical dependency: the request of a dependency is an expression
[17:16:18.037] 
[17:16:18.037] Import trace for requested module:
[17:16:18.038] ./node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js
[17:16:18.038] ./node_modules/@supabase/realtime-js/dist/module/index.js
[17:16:18.038] ./node_modules/@supabase/supabase-js/dist/module/index.js
[17:16:18.038] ./src/lib/supabaseServer.ts
[17:16:18.038] ./src/app/api/pricing/route.ts
[17:16:18.039] 
[17:16:28.107]  ✓ Compiled successfully in 18.0s
[17:16:28.113]    Linting and checking validity of types ...
[17:16:37.996] 
[17:16:37.997] Failed to compile.
[17:16:37.997] 
[17:16:37.998] ./src/app/admin/airlines/page.tsx
[17:16:37.998] 21:16  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:37.998] 34:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:37.998] 49:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:37.998] 66:16  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:37.998] 172:84  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[17:16:37.998] 
[17:16:37.999] ./src/app/admin/cities/page.tsx
[17:16:37.999] 54:14  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:37.999] 295:32  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[17:16:38.001] 
[17:16:38.001] ./src/app/admin/layout.tsx
[17:16:38.001] 54:21  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[17:16:38.001] 
[17:16:38.001] ./src/app/admin/marketing/page.tsx
[17:16:38.001] 44:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.002] 67:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.002] 
[17:16:38.002] ./src/app/admin/pricing/page.tsx
[17:16:38.002] 18:8  Warning: 'RegionPricing' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.002] 34:16  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.002] 39:18  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.007] 69:17  Warning: 'err' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.008] 73:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.008] 93:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.008] 110:16  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.008] 
[17:16:38.008] ./src/app/admin/reviews/page.tsx
[17:16:38.009] 7:10  Warning: 'Tabs' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.009] 7:16  Warning: 'TabsContent' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.009] 7:29  Warning: 'TabsList' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.011] 7:39  Warning: 'TabsTrigger' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.011] 8:48  Warning: 'ImageIcon' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.012] 8:59  Warning: 'Star' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.012] 32:16  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.012] 37:18  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.012] 63:17  Warning: 'err' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.015] 67:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.015] 88:14  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.015] 
[17:16:38.016] ./src/app/admin/seo/page.tsx
[17:16:38.016] 62:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.016] 85:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.016] 
[17:16:38.016] ./src/app/api/cities/content/route.ts
[17:16:38.017] 14:35  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[17:16:38.017] 18:12  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.017] 37:76  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[17:16:38.017] 46:12  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.017] 
[17:16:38.018] ./src/app/api/kommo/route.ts
[17:16:38.018] 73:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.018] 
[17:16:38.021] ./src/app/api/marketing/codes/route.ts
[17:16:38.021] 44:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.021] 80:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.021] 
[17:16:38.021] ./src/app/api/pricing/route.ts
[17:16:38.021] 91:12  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.022] 152:12  Warning: 'err' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.022] 192:12  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.022] 
[17:16:38.022] ./src/app/api/seo/meta/route.ts
[17:16:38.022] 60:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.022] 107:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.023] 
[17:16:38.023] ./src/app/page.tsx
[17:16:38.023] 45:16  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.027] 
[17:16:38.027] ./src/app/privacy/page.tsx
[17:16:38.028] 47:6  Warning: React Hook useEffect has a missing dependency: 'sections'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[17:16:38.028] 
[17:16:38.028] ./src/app/search/page.tsx
[17:16:38.028] 11:26  Warning: 'ArrowDown' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.028] 11:37  Warning: 'Lock' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.028] 11:43  Warning: 'ShieldCheck' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.028] 11:79  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.029] 56:62  Warning: 'passengers' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.029] 459:9  Warning: 'selectedClass' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[17:16:38.029] 579:8  Warning: React Hook useEffect has missing dependencies: 'setDepartureDate', 'setFromInput', 'setFromSelection', 'setPassengers', 'setReturnDate', 'setSelectedClass', 'setToInput', 'setToSelection', 'setTripType', and 'tripType'. Either include them or remove the dependency array.  react-hooks/exhaustive-deps
[17:16:38.029] 635:9  Warning: 'allFromCodes' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[17:16:38.029] 636:9  Warning: 'allToCodes' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[17:16:38.029] 649:11  Warning: 'fromAirport' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[17:16:38.029] 650:11  Warning: 'toAirport' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[17:16:38.030] 653:11  Warning: 'formatDate' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[17:16:38.030] 
[17:16:38.030] ./src/app/searching/page.tsx
[17:16:38.030] 47:6  Warning: React Hook useEffect has a missing dependency: 'providersCount'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[17:16:38.030] 
[17:16:38.030] ./src/app/terms/page.tsx
[17:16:38.030] 43:6  Warning: React Hook useEffect has a missing dependency: 'sections'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[17:16:38.031] 
[17:16:38.031] ./src/app/thank-you/page.tsx
[17:16:38.031] 3:8  Warning: 'Image' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.031] 12:6  Warning: 'SearchParams' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.031] 28:9  Warning: 'from' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[17:16:38.032] 29:9  Warning: 'to' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[17:16:38.032] 30:9  Warning: 'departure' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[17:16:38.032] 32:9  Warning: 'pax' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[17:16:38.032] 33:9  Warning: 'cls' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[17:16:38.032] 34:9  Warning: 'tripType' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[17:16:38.032] 
[17:16:38.032] ./src/components/airline-deals-section.tsx
[17:16:38.033] 110:10  Warning: 'isMobile' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[17:16:38.033] 
[17:16:38.033] ./src/components/airline-page.tsx
[17:16:38.033] 15:54  Warning: 'AdminAirlineContent' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.033] 345:7  Warning: 'IMAGE_FALLBACKS' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[17:16:38.033] 438:16  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.034] 
[17:16:38.034] ./src/components/best-deals-section.tsx
[17:16:38.034] 7:60  Warning: 'MultiCityFlight' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.034] 
[17:16:38.034] ./src/components/city-page.tsx
[17:16:38.034] 49:16  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.034] 82:16  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.035] 
[17:16:38.035] ./src/components/country-page.tsx
[17:16:38.035] 49:16  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.035] 82:16  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.035] 
[17:16:38.037] ./src/components/flight-search-form-mobile.tsx
[17:16:38.037] 5:10  Warning: 'ChevronDown' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.037] 296:6  Warning: React Hook useEffect has missing dependencies: 'setMultiFromSuggestions', 'setMultiPopovers', 'setMultiSegments', 'setMultiShowFromSuggestions', 'setMultiShowToSuggestions', and 'setMultiToSuggestions'. Either include them or remove the dependency array. If 'setMultiSegments' changes too often, find the parent component that defines it and wrap that definition in useCallback.  react-hooks/exhaustive-deps
[17:16:38.037] 496:6  Warning: React Hook useEffect has missing dependencies: 'setMultiPopovers', 'setMultiShowFromSuggestions', and 'setMultiShowToSuggestions'. Either include them or remove the dependency array. If 'setMultiPopovers' changes too often, find the parent component that defines it and wrap that definition in useCallback.  react-hooks/exhaustive-deps
[17:16:38.037] 553:65  Warning: 'index' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.038] 
[17:16:38.038] ./src/components/flight-search-form.tsx
[17:16:38.038] 6:10  Warning: 'ChevronDown' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.038] 543:67  Warning: 'index' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.039] 
[17:16:38.039] ./src/components/marketing-scripts.tsx
[17:16:38.039] 36:16  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.039] 
[17:16:38.039] ./src/components/seo-meta.tsx
[17:16:38.039] 45:16  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.040] 
[17:16:38.040] ./src/components/testimonials-section.tsx
[17:16:38.040] 124:16  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.040] 
[17:16:38.040] ./src/components/ui/textarea.tsx
[17:16:38.041] 4:18  Error: An interface declaring no members is equivalent to its supertype.  @typescript-eslint/no-empty-object-type
[17:16:38.041] 
[17:16:38.041] ./src/hooks/useFlightSearch.ts
[17:16:38.041] 59:6  Warning: React Hook useEffect has a missing dependency: 'multiSegments.length'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[17:16:38.052] 
[17:16:38.052] ./src/lib/airlinesAdmin.ts
[17:16:38.052] 339:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.052] 350:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.052] 
[17:16:38.053] ./src/lib/countriesAdmin.ts
[17:16:38.053] 97:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.053] 108:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.053] 
[17:16:38.053] ./src/lib/flightGenerator.ts
[17:16:38.053] 4:34  Warning: 'PricingConfiguration' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.053] 592:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.053] 1133:18  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.053] 1282:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.053] 1530:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.053] 
[17:16:38.053] ./src/lib/pricingAdmin.ts
[17:16:38.053] 177:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.053] 191:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.053] 218:12  Warning: 'err' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.053] 241:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.053] 
[17:16:38.053] ./src/lib/reviewsAdmin.ts
[17:16:38.053] 98:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.053] 113:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.053] 130:58  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[17:16:38.053] 218:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.053] 
[17:16:38.053] ./src/lib/seoAdmin.ts
[17:16:38.053] 49:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.053] 61:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.053] 71:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:16:38.053] 
[17:16:38.053] info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/app/api-reference/config/eslint#disabling-rules
[17:16:38.067] Error: Command "npm run build" exited with 1
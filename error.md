Error: A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

  ...
    <Suspense fallback={<div>}>
      <SearchResultsContentMain>
        <div className="w-full max...">
          <div className="grid grid-...">
            <div>
            <div className="lg:col-span-1">
              <div className="sticky top-32">
                <FlightSearchFormVertical>
                  <div className="relative">
                    <div>
                    <div className="relative b...">
                      <div>
                      <form onSubmit={function handleSubmit} className="space-y-4">
                        <div>
                        <div>
                        <div className="relative g...">
                          <div>
                          <CustomPhoneInput value="" onChange={function onChange} onFocus={function onFocus} ...>
                            <div className="relative" ref={{current:null}}>
                              <div className="relative">
                                <button>
                                <input
                                  ref={{current:null}}
                                  type="tel"
                                  value=""
                                  onChange={function CustomPhoneInput.useCallback[handlePhoneNumberChange]}
                                  onFocus={function onFocus}
                                  onBlur={function onBlur}
                                  className="w-full font-poppins transition-all duration-300 outline-none p-3 pl-20 fo..."
+                                 placeholder="(837) 429-1824"
-                                 placeholder="(477) 174-9463"
                                  required={true}
                                  disabled={false}
                                  autoComplete="tel"
                                  autoFocus={false}
                                  aria-label="Phone number"
                                  aria-invalid="false"
                                  aria-describedby={undefined}
                                >
                        ...

    at createConsoleError (http://localhost:3000/_next/static/chunks/node_modules_next_dist_445d8acf._.js:1484:71)
    at handleConsoleError (http://localhost:3000/_next/static/chunks/node_modules_next_dist_445d8acf._.js:2090:54)
    at console.error (http://localhost:3000/_next/static/chunks/node_modules_next_dist_445d8acf._.js:2243:57)
    at http://localhost:3000/_next/static/chunks/node_modules_next_dist_compiled_react-dom_1f56dc06._.js:3012:25
    at runWithFiberInDEV (http://localhost:3000/_next/static/chunks/node_modules_next_dist_compiled_react-dom_1f56dc06._.js:890:74)
    at emitPendingHydrationWarnings (http://localhost:3000/_next/static/chunks/node_modules_next_dist_compiled_react-dom_1f56dc06._.js:3011:13)
    at completeWork (http://localhost:3000/_next/static/chunks/node_modules_next_dist_compiled_react-dom_1f56dc06._.js:6409:32)
    at runWithFiberInDEV (http://localhost:3000/_next/static/chunks/node_modules_next_dist_compiled_react-dom_1f56dc06._.js:890:74)
    at completeUnitOfWork (http://localhost:3000/_next/static/chunks/node_modules_next_dist_compiled_react-dom_1f56dc06._.js:8301:23)
    at performUnitOfWork (http://localhost:3000/_next/static/chunks/node_modules_next_dist_compiled_react-dom_1f56dc06._.js:8238:28)
    at workLoopConcurrentByScheduler (http://localhost:3000/_next/static/chunks/node_modules_next_dist_compiled_react-dom_1f56dc06._.js:8232:58)
    at renderRootConcurrent (http://localhost:3000/_next/static/chunks/node_modules_next_dist_compiled_react-dom_1f56dc06._.js:8214:71)
    at performWorkOnRoot (http://localhost:3000/_next/static/chunks/node_modules_next_dist_compiled_react-dom_1f56dc06._.js:7846:176)
    at performWorkOnRootViaSchedulerTask (http://localhost:3000/_next/static/chunks/node_modules_next_dist_compiled_react-dom_1f56dc06._.js:8820:9)
    at MessagePort.performWorkUntilDeadline (http://localhost:3000/_next/static/chunks/node_modules_next_dist_compiled_0f1b9fd4._.js:2588:64)
# API and authentication rules

- Reuse domain services under `src/app/service/`. Use environment.baseApiUrl for API calls and environment.staticFileUrl for server assets; do not hardcode deployment hosts in components.
- Preserve endpoint paths, methods, payload casing, query names, and response envelopes unless intentionally changing the contract. Legacy names and POST-based reads exist here.
- Type new requests/responses in `src/app/models/`. Narrow or validate uncertain external data. Do not invent backend fields to make a UI compile.
- Use HttpParams for query strings and handle optional values deliberately. A Date interface annotation does not deserialize JSON strings into Date objects.
- Return HTTP observables from services. Keep view-specific notifications/navigation in components unless a shared flow requires otherwise; do not mask failed writes as success.
- Verify changed contracts with HttpClientTestingModule and HttpTestingController, asserting method, URL, parameters, body, and failure behavior without live calls.
- Coordinate auth changes across login, AuthenticationserviceService, AuthGGuard, AuthInterceptorInterceptor, session restoration, and routes. Read the known inconsistencies in the project map first.
- Guards must deny or return a redirect for rejected access. Navigating elsewhere alone does not deny activation. Client role checks do not replace server authorization.
- Attach bearer credentials only to intended API destinations. Keep storage keys and the `Bearer <token>` format consistent; never log authentication material.
- Exercise missing, expired, malformed, and restored sessions for auth changes. Clear local state and timers consistently on logout and avoid unauthorized-response redirect loops.
- Keep loader accounting balanced across success, error, and cancellation, preferably using finalize when refactoring. Verify concurrent requests do not hide the spinner prematurely.
- Browser environment files are public; never put privileged credentials or secrets in them.

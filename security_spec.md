# Security Specification & Threat Model

## Data Invariants
1. Inquiries (`/inquiries/{inquiryId}`):
   - Only writeable on creation by any visitor submitting the contact form.
   - Immutable and private: no unauthorized client read, update, or deletion.
   - Enforces strict size limits on name (≤100 chars), email (≤150 chars), and message body (≤2000 chars).
2. Project Likes (`/project_likes/{projectId}`):
   - Publicly readable to display community appreciation and project ratings.
   - Atomic incremental writes: updates may only increment `likesCount` by +1 and touch `updatedAt`. Arbitrary counter overrides or decrements are mathematically rejected.
3. Guestbook (`/guestbook/{entryId}`):
   - Publicly readable visitor endorsements and notes.
   - Create-only for visitors with strict field boundary validations.

## Dirty Dozen Payloads (Rejection Test Cases)
1. **Payload 1 (Ghost Field Injection in Inquiry)**: `{ name: "Alex", email: "a@b.com", message: "Hi", createdAt: "...", isAdmin: true }` -> REJECTED (Exact keys constraint violated).
2. **Payload 2 (Oversized Message in Inquiry)**: `{ name: "Alex", email: "a@b.com", message: "A".repeat(2001), createdAt: "..." }` -> REJECTED (Message length limit exceeded).
3. **Payload 3 (Empty Name)**: `{ name: "", email: "a@b.com", message: "Hi", createdAt: "..." }` -> REJECTED (Minimum length constraint violated).
4. **Payload 4 (Inquiry Read Attempt by Non-Admin)**: Direct `get()` or `list()` on `/inquiries` -> REJECTED (Read permission false).
5. **Payload 5 (Inquiry Update Gap)**: Direct `update()` on `/inquiries/{id}` -> REJECTED (Update permission false).
6. **Payload 6 (Inquiry Deletion)**: Direct `delete()` on `/inquiries/{id}` -> REJECTED (Delete permission false).
7. **Payload 7 (Path Injection in ID)**: Document ID containing non-alphanumeric special characters like `../../etc/passwd` -> REJECTED (`isValidId` regex failed).
8. **Payload 8 (Arbitrary Like Count Override)**: `{ projectId: "p1", likesCount: 999999, updatedAt: "..." }` when previous count was 5 -> REJECTED (Must increment by exactly +1).
9. **Payload 9 (Negative Like Count)**: `{ projectId: "p1", likesCount: -1, updatedAt: "..." }` -> REJECTED (`likesCount >= 0` check failed).
10. **Payload 10 (Guestbook Ghost Field)**: `{ name: "Sam", role: "Dev", message: "Great!", createdAt: "...", verified: true }` -> REJECTED (Excess keys).
11. **Payload 11 (Guestbook Update Attempt)**: Modifying another user's guestbook text -> REJECTED (Guestbook updates forbidden).
12. **Payload 12 (Guestbook Oversized Role)**: Role string of 100 characters -> REJECTED (Role length <= 80 constraint).

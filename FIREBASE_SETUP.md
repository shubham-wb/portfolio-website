# Firebase setup

The app reads/writes content from your Firebase project (`portfolio-56bfd`).
Do this once in the [Firebase console](https://console.firebase.google.com/).

## 1. Firestore
- Build → **Firestore Database** → Create database (Production mode is fine).
- Open the **Rules** tab and paste the contents of [`firestore.rules`](firestore.rules), then Publish.
  - Content is public to read; only a signed-in user can write.

## 2. Cloudinary (for skill logos + résumé)
Firebase Storage now needs the paid Blaze plan, so uploads use **Cloudinary**
(free, no credit card).
- Create a free account at [cloudinary.com](https://cloudinary.com/users/register_free).
- Copy your **Cloud name** (dashboard, top-left).
- Settings (gear) → **Upload** → **Add upload preset** → set **Signing Mode = Unsigned** → Save. Copy the preset name.
- (For the résumé PDF) Settings → **Security** → enable **Allow delivery of PDF and ZIP files** if download links 404. *(Not needed — we upload PDFs as `raw` — but harmless to enable.)*
- Put both values in `.env.local`:
  ```
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your-unsigned-preset"
  ```
- Restart `npm run dev` after editing `.env.local`.

## 3. Authentication (admin login)
- Build → **Authentication** → Get started.
- Enable the **Email/Password** provider.
- **Users** tab → Add user → create your admin account (email + password).
  - There is no public sign-up — only accounts you create here can reach `/admin`.

## 4. Run it
```bash
npm run dev
```
- Visit `/admin/login`, sign in with the account from step 3.
- On the dashboard, click **Load sample data** to populate the site, or start
  creating content from the sidebar (Posts, Projects, Skills, Settings).

## Notes
- Firebase web keys in `.env.local` are public by design — security is enforced
  by the rules above, not by hiding the keys. They use the `NEXT_PUBLIC_` prefix
  so the browser can use them.
- Data model: collections `posts`, `projects`, `skills`; singleton docs
  `site/settings`, `site/about`, `site/contact`, `site/social`.
- Deploy rules from the CLI instead of the console (optional):
  `firebase deploy --only firestore:rules`
- Uploads are handled by Cloudinary, not Firebase Storage, so no Storage bucket
  or Blaze plan is required.

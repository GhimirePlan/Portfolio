# Setting Up Google OAuth for Blog Comments

This guide will walk you through the process of setting up Google OAuth for the blog comment section.

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top of the page
3. Click on "New Project"
4. Enter a name for your project and click "Create"
5. Select your new project from the project dropdown

## Step 2: Configure the OAuth Consent Screen

1. In the Google Cloud Console, navigate to "APIs & Services" > "OAuth consent screen"
2. Select "External" as the user type (unless you have a Google Workspace account)
3. Click "Create"
4. Fill in the required information:
   - App name: Your portfolio/blog name
   - User support email: Your email address
   - Developer contact information: Your email address
5. Click "Save and Continue"
6. Skip the "Scopes" section by clicking "Save and Continue"
7. Add test users if you're still in testing (your email address)
8. Click "Save and Continue"
9. Review your settings and click "Back to Dashboard"

## Step 3: Create OAuth Client ID

1. In the Google Cloud Console, navigate to "APIs & Services" > "Credentials"
2. Click "Create Credentials" and select "OAuth client ID"
3. Select "Web application" as the application type
4. Enter a name for your OAuth client
5. Add authorized JavaScript origins:
   - For development: `http://localhost:3000`
   - For production: `https://your-production-domain.com`
6. Add authorized redirect URIs:
   - For development: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://your-production-domain.com/api/auth/callback/google`
7. Click "Create"
8. Note your Client ID and Client Secret (you'll need these for your environment variables)

## Step 4: Enable the Google People API

1. In the Google Cloud Console, navigate to "APIs & Services" > "Library"
2. Search for "Google People API"
3. Click on "Google People API"
4. Click "Enable"

## Step 5: Update Environment Variables

1. Open your `.env.local` file (for development) or `.env.production` file (for production)
2. Add the following variables with your Google OAuth credentials:
   ```
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

## Step 6: Verify Setup

1. Start your development server
2. Navigate to a blog post
3. Click "Sign in with Google" in the comment section
4. You should be redirected to Google's sign-in page
5. After signing in, you should be redirected back to your blog post and be able to leave comments

## Troubleshooting

- **Error: redirect_uri_mismatch**: Make sure the redirect URI in your Google Cloud Console matches exactly with your application's callback URL.
- **Error: invalid_client**: Double-check your Client ID and Client Secret in your environment variables.
- **Error: access_denied**: The user denied the permission request or your app is still in testing mode and the user is not added as a test user.

## Additional Resources

- [NextAuth.js Google Provider Documentation](https://next-auth.js.org/providers/google)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/) 
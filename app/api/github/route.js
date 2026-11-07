import { NextResponse } from "next/server";

const USERNAME = process.env.GITHUB_USERNAME || "GhimirePlan";
const REVALIDATE = 3600; // seconds

// Map GitHub language names to the labels used by the portfolio UI.
const LANGUAGE_LABELS = {
  "Jupyter Notebook": "Jupyter",
  HTML: "HTML",
  CSS: "CSS",
  SCSS: "CSS",
  JavaScript: "Javascript",
  TypeScript: "Typescript",
  Python: "Python",
  Go: "Go",
  C: "C",
  "C++": "C++",
  "C#": "C#",
  Java: "Java",
  Kotlin: "Kotlin",
  Swift: "Swift",
  Ruby: "Ruby",
  PHP: "PHP",
  Dart: "Dart",
  Shell: "Shell",
  GDScript: "GDScript",
  Dockerfile: "Docker",
};

function githubHeaders() {
  const headers = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

export async function GET() {
  try {
    const headers = githubHeaders();

    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${USERNAME}`, {
        headers,
        next: { revalidate: REVALIDATE },
      }),
      fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`, {
        headers,
        next: { revalidate: REVALIDATE },
      }),
    ]);

    if (!userRes.ok) {
      throw new Error(`GitHub profile request failed (${userRes.status})`);
    }
    if (!reposRes.ok) {
      throw new Error(`GitHub repositories request failed (${reposRes.status})`);
    }

    const user = await userRes.json();
    const repos = await reposRes.json();

    const languageCounts = repos.reduce((acc, repo) => {
      if (repo.language) {
        acc[repo.language] = (acc[repo.language] || 0) + 1;
      }
      return acc;
    }, {});

    const skills = Object.entries(languageCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([language]) => LANGUAGE_LABELS[language] || language);

    const projects = repos
      .filter((repo) => !repo.fork && !repo.archived)
      .map((repo) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description || "No description provided.",
        tools: [repo.language, ...(repo.topics || []).slice(0, 6)].filter(Boolean),
        role: "Developer",
        code: repo.html_url,
        demo: repo.homepage || repo.html_url,
        stars: repo.stargazers_count,
        language: repo.language,
        updatedAt: repo.updated_at,
      }));

    const profile = {
      name: user.name || user.login,
      description: user.bio || "",
      profile: user.avatar_url,
      github: user.html_url,
      website: user.blog || "",
      address: user.location || "",
      company: user.company || "",
      followers: user.followers,
      publicRepos: user.public_repos,
    };

    return NextResponse.json({ success: true, profile, projects, skills });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message, profile: null, projects: [], skills: [] },
      { status: 502 }
    );
  }
}

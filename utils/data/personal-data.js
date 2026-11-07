export const personalData = {
  name: "Plan Ghimire",
  profile: '/images/plan-ghimire.jpg',
  Designations: "Curiosity",
  description: "An engineering student passionate about embedded systems, network automation, and building practical tech solutions.",
  aboutText: "A self-motivated Electronics Communication & Information Engineering Student with a strong problem-solving mindset and a constant desire to explore new technologies. Always eager to embrace challenges and open to exciting opportunities! 🌟",
  email: 'contact@plan.com.np',
  phone: '+977 9843391507',
  address: 'Lamjung, Nepal',
  github: 'https://github.com/ghimireplan',
  facebook: 'https://www.facebook.com/plan.com.np',
  linkedIn: 'https://www.linkedin.com/in/plan-ghimire/',
  twitter: 'https://twitter.com/PlanGhimire',
  stackOverflow: 'https://stackoverflow.com/users/your-stackoverflow',
  leetcode: "https://leetcode.com/your-leetcode",
  devUsername: "your-dev-username",
  resume: "https://docs.google.com/document/d/1a40abi-tFr2AjfnkP6ACAeo_A40EvbKWjgc9ZyxN3z8/edit?tab=t.0",
};

// Overlay live GitHub fields on top of the static data, keeping the fields
// GitHub does not expose (email, phone, resume, social links).
export function mergePersonalData(github) {
  if (!github) return personalData;
  return {
    ...personalData,
    name: github.name || personalData.name,
    description: github.description || personalData.description,
    profile: github.profile || personalData.profile,
    github: github.github || personalData.github,
    address: github.address || personalData.address,
  };
}

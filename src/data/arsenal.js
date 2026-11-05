// Only technologies named in the project spec. No proficiency scores are invented:
// set `level` to a verified statement (e.g. "Used in 3 projects") when you have one.
const m = (category, name, description, applied = null) => ({ id: `mod:${name}`, category, name, description, applied, level: null });

export const ARSENAL = [
  { category: 'Programming', modules: [
    m('Programming', 'JavaScript', 'Language of the web; runs in browsers and on Node.js.', 'Frontend and backend code across the MERN operations and this portfolio.'),
    m('Programming', 'Python', 'General-purpose language widely used for security tooling and APIs.', 'Backend analysis logic for Operation 001, Password Security Analyzer.'),
    m('Programming', 'C', 'Low-level systems language that exposes how memory and programs work.'),
  ]},
  { category: 'Frontend', modules: [
    m('Frontend', 'React', 'Component-based UI library.', 'Operations 001, 003, 004, 005, 006 and this portfolio.'),
    m('Frontend', 'Vite', 'Fast dev server and build tool for modern frontends.', 'Operation 001 and this portfolio.'),
    m('Frontend', 'Tailwind CSS', 'Utility-first CSS framework.', 'Operation 002 and this portfolio.'),
    m('Frontend', 'Bootstrap', 'Component-driven CSS framework.'),
    m('Frontend', 'Framer Motion', 'Animation library for React.', 'Boot, reveal and panel transitions in this portfolio.'),
  ]},
  { category: 'Backend', modules: [
    m('Backend', 'Node.js', 'JavaScript runtime for server-side applications.', 'Operations 003, 004, 005.'),
    m('Backend', 'Express', 'Minimal web framework for Node.js APIs.', 'Operations 003, 004, 005.'),
    m('Backend', 'FastAPI', 'Python framework for typed, high-performance APIs.', 'Operation 001, Password Security Analyzer.'),
    m('Backend', 'Django', 'Batteries-included Python web framework.'),
  ]},
  { category: 'Databases', modules: [
    m('Databases', 'MongoDB', 'Document database; Atlas is its hosted service.', 'Operations 003, 004, 005.'),
    m('Databases', 'MySQL', 'Relational database management system.'),
    m('Databases', 'Firebase', 'Google backend platform: auth, database and hosting.'),
  ]},
  { category: 'Cybersecurity', modules: [
    m('Cybersecurity', 'Security Operations', 'Monitoring, triage and response work done in a SOC.', 'Professional interest and current training focus.'),
    m('Cybersecurity', 'Threat Analysis', 'Studying adversary behavior, indicators and attack patterns.', 'Professional interest.'),
    m('Cybersecurity', 'Network Security', 'Protecting traffic and infrastructure; reading traffic for anomalies.', 'Professional interest.'),
    m('Cybersecurity', 'Vulnerability Assessment', 'Finding and prioritizing weaknesses in systems.', 'Professional interest.'),
    m('Cybersecurity', 'Secure Web Application Development', 'Building web apps with input validation, auth and safe defaults.', 'Professional interest; see Operation 001 and this portfolio.'),
  ]},
];

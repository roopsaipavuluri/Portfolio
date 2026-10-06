# Sai Portfolio

This project is a premium personal portfolio for Sai, a B.Tech Computer Science Engineering graduate and IT fresher.

## Project structure

```text
src/
  components/
  pages/
  data/
    profile.js
    projects.js
    skills.js
    education.js
    experience.js
    certifications.js
  App.jsx
  App.css
  index.css
public/
  profile.svg
  resume.pdf
  favicon.svg
  projects/
  certificates/
```

## How to edit the portfolio

### Update profile information
Open `src/data/profile.js` and change:

- name
- role
- location
- email
- phone
- resume file path
- status
- social profile URLs

Example:

```js
const profile = {
  name: 'Sai',
  role: 'B.Tech Computer Science Engineer | IT Fresher',
  email: 'your.email@example.com',
  phone: '+91 XXXXX XXXXX',
  profileImage: '/profile.svg',
  resume: '/resume.pdf',
  status: 'Open to Work',
};
```

### Add or remove projects
Open `src/data/projects.js`.

Add a new object to the array:

```js
{
  id: 4,
  title: 'New Project Name',
  description: 'Project summary',
  image: '/projects/new-project.svg',
  technologies: ['React', 'JavaScript'],
  features: ['Feature one', 'Feature two'],
  github: 'https://github.com/username/project',
  liveDemo: 'https://project.vercel.app',
  category: 'Web Development',
  date: '2026',
  role: 'Developer',
  caseStudy: '#',
  video: '#',
}
```

Delete an object from the array to remove a project.

### Edit skills
Open `src/data/skills.js`.

Each object contains a category and items array. You can add, delete, or rename skills here.

### Edit education
Open `src/data/education.js` and update the degree, institution, years, CGPA, location, and description.

### Edit experience
Open `src/data/experience.js` and update company, role, dates, location, responsibilities, and technologies.

### Edit certifications
Open `src/data/certifications.js` and add or remove certificate entries. Each entry supports name, organization, date, image, URL, and credential ID.

### Change profile photo
Replace the placeholder file at `public/profile.svg` with your own image, or update `profileImage` in `src/data/profile.js` to a new local path.

### Change resume
Replace the file in `public/resume.pdf` or update `resume: '/resume.pdf'` in `src/data/profile.js`.

### Change social links
Update the `social` object in `src/data/profile.js`.

## Run locally

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
```

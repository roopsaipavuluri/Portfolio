import { useEffect, useMemo, useState } from 'react';
import './App.css';
import defaultProfile from './data/profile';
import defaultProjects from './data/projects';
import defaultSkills from './data/skills';
import defaultEducation from './data/education';
import defaultExperience from './data/experience';
import defaultCertifications from './data/certifications';
import defaultAchievements from './data/achievements';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Education', href: '#education' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Contact', href: '#contact' },
];

const storageKeys = {
  profile: 'portfolio-profile',
  projects: 'portfolio-projects',
  skills: 'portfolio-skills',
  education: 'portfolio-education',
  experience: 'portfolio-experience',
  certifications: 'portfolio-certifications',
  achievements: 'portfolio-achievements',
};

const loadStoredData = (key, fallback) => {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

const loadProfile = () => {
  const profile = loadStoredData(storageKeys.profile, defaultProfile);
  const outdatedValues = {
    name: { Sai: defaultProfile.name },
    email: { 'your.email@example.com': defaultProfile.email },
    phone: { '+91 XXXXX XXXXX': defaultProfile.phone },
  };
  const updatedProfile = { ...profile };

  Object.entries(outdatedValues).forEach(([field, replacements]) => {
    if (replacements[profile[field]]) {
      updatedProfile[field] = replacements[profile[field]];
    }
  });

  const outdatedSocialUrls = {
    github: 'https://github.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourusername',
    instagram: 'https://instagram.com/yourusername',
  };
  updatedProfile.social = { ...defaultProfile.social, ...profile.social };
  Object.entries(outdatedSocialUrls).forEach(([network, outdatedUrl]) => {
    if (
      updatedProfile.social[network] === outdatedUrl ||
      (network === 'linkedin' &&
        updatedProfile.social[network] ===
          'https://www.linkedin.com/in/roopsai-pavuluri-064b7b28a/?isSelfProfile=true')
    ) {
      updatedProfile.social[network] = defaultProfile.social[network];
    }
  });

  return updatedProfile;
};

const loadEducation = () => {
  const education = loadStoredData(storageKeys.education, defaultEducation);

  return education.map((entry) =>
    entry.cgpa === 'CGPA: 8.6' || entry.cgpa === '8.6'
      ? { ...entry, cgpa: 'CGPA: 8.18' }
      : entry,
  );
};

const certificationMigrationKey = 'portfolio-certification-ai-additions-v1';
const loadCertifications = () => {
  const certifications = loadStoredData(storageKeys.certifications, defaultCertifications);

  if (typeof window === 'undefined' || localStorage.getItem(certificationMigrationKey)) {
    return certifications;
  }

  const savedCertifications = localStorage.getItem(storageKeys.certifications);
  if (!savedCertifications) {
    localStorage.setItem(certificationMigrationKey, 'true');
    return certifications;
  }

  const addedCertificationNames = new Set([
    'Microsoft Azure AI Fundamentals',
    'Salesforce AI Associate',
  ]);
  const missingCertifications = defaultCertifications.filter(
    (certification) =>
      addedCertificationNames.has(certification.name) &&
      !certifications.some((savedCertification) => savedCertification.name === certification.name),
  );
  const updatedCertifications = [...certifications, ...missingCertifications];

  localStorage.setItem(storageKeys.certifications, JSON.stringify(updatedCertifications));
  localStorage.setItem(certificationMigrationKey, 'true');
  return updatedCertifications;
};

const projectMigrationKey = 'portfolio-project-content-migrations-v6';
const loadProjects = () => {
  const projects = loadStoredData(storageKeys.projects, defaultProjects);

  if (typeof window === 'undefined') {
    return projects;
  }

  const savedProjects = localStorage.getItem(storageKeys.projects);
  if (!savedProjects) {
    localStorage.setItem(projectMigrationKey, 'true');
    return projects;
  }

  if (localStorage.getItem(projectMigrationKey)) {
    return projects;
  }

  const projectAliases = {
    'Cloud Kitchen / Online Food Ordering Website': ['Cloud Kitchen'],
  };
  const starterProjectTitles = new Set(['Portfolio Analytics Dashboard', 'Campus Event Tracker']);
  const updatedProjects = defaultProjects.map((defaultProject) => {
    const existingProject = projects.find(
      (project) =>
        project.title === defaultProject.title ||
        projectAliases[defaultProject.title]?.includes(project.title),
    );
    const project =
      existingProject?.title === defaultProject.title
        ? { ...defaultProject, ...existingProject }
        : defaultProject;

    return {
      ...project,
      image: defaultProject.image,
      github: defaultProject.github,
      ...(defaultProject.title === 'Cloud Kitchen / Online Food Ordering Website'
        ? { liveDemo: defaultProject.liveDemo }
        : {}),
    };
  });
  const additionalProjects = projects.filter(
    (project) =>
      !defaultProjects.some(
        (defaultProject) =>
          defaultProject.title === project.title ||
          projectAliases[defaultProject.title]?.includes(project.title),
      ) && !starterProjectTitles.has(project.title),
  );
  updatedProjects.push(...additionalProjects);

  localStorage.setItem(storageKeys.projects, JSON.stringify(updatedProjects));
  localStorage.setItem(projectMigrationKey, 'true');
  return updatedProjects;
};

const createProject = () => ({
  id: Date.now(),
  title: 'New Project',
  description: 'Describe your project here.',
  image: '/projects/cloud-kitchen.svg',
  technologies: ['React', 'JavaScript'],
  features: ['Feature one'],
  github: 'https://github.com/username/project',
  liveDemo: 'https://example.com',
  category: 'Web Development',
  date: '2026',
  role: 'Developer',
  caseStudy: '#',
  video: '#',
});

const createSkillGroup = () => ({
  category: 'New Category',
  items: [{ name: 'New Skill', icon: '✨' }],
});

const createEducation = () => ({
  degree: 'New Degree',
  institution: 'University Name',
  startYear: '2024',
  endYear: '2028',
  cgpa: 'CGPA',
  location: 'City, Country',
  description: 'Add details here.',
});

const createExperience = () => ({
  company: 'Company Name',
  role: 'Role',
  startDate: '2026',
  endDate: 'Present',
  location: 'Location',
  description: 'Add description here.',
  responsibilities: ['Add responsibility'],
  technologies: ['React'],
});

const createCertificate = () => ({
  name: 'New Certification',
  organization: 'Organization',
  date: '2026',
  image: '/certificates/frontend.svg',
  url: '#',
  credentialId: 'ID-0001',
});

const createAchievement = () => ({
  title: 'New Achievement',
  description: 'Add description to highlight your achievement.',
  date: '2026',
  organization: 'Organization',
  image: '/certificates/frontend.svg',
});

function App() {
  const [theme, setTheme] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('portfolio-theme') || 'dark' : 'dark'));
  const [profileData, setProfileData] = useState(loadProfile);
  const [projectsData, setProjectsData] = useState(loadProjects);
  const [skillsData, setSkillsData] = useState(() => loadStoredData(storageKeys.skills, defaultSkills));
  const [educationData, setEducationData] = useState(loadEducation);
  const [experienceData, setExperienceData] = useState(() => loadStoredData(storageKeys.experience, defaultExperience));
  const [certificationsData, setCertificationsData] = useState(loadCertifications);
  const [achievementsData, setAchievementsData] = useState(() => loadStoredData(storageKeys.achievements, defaultAchievements));
  const [activeFilter, setActiveFilter] = useState('All');
  const [menuOpen, setMenuOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorTab, setEditorTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(storageKeys.profile, JSON.stringify(profileData));
  }, [profileData]);

  useEffect(() => {
    localStorage.setItem(storageKeys.projects, JSON.stringify(projectsData));
  }, [projectsData]);

  useEffect(() => {
    localStorage.setItem(storageKeys.skills, JSON.stringify(skillsData));
  }, [skillsData]);

  useEffect(() => {
    localStorage.setItem(storageKeys.education, JSON.stringify(educationData));
  }, [educationData]);

  useEffect(() => {
    localStorage.setItem(storageKeys.experience, JSON.stringify(experienceData));
  }, [experienceData]);

  useEffect(() => {
    localStorage.setItem(storageKeys.certifications, JSON.stringify(certificationsData));
  }, [certificationsData]);

  useEffect(() => {
    localStorage.setItem(storageKeys.achievements, JSON.stringify(achievementsData));
  }, [achievementsData]);

  const socialLinks = useMemo(
    () => [
      { label: 'GitHub', href: profileData.social.github, icon: 'GH' },
      { label: 'LinkedIn', href: profileData.social.linkedin, icon: 'in' },
      { label: 'Instagram', href: profileData.social.instagram, icon: 'IG' },
      { label: 'Email', href: `mailto:${profileData.email}`, icon: '✉' },
    ],
    [profileData],
  );

  const filters = useMemo(
    () => ['All', ...new Set(projectsData.map((project) => project.category))],
    [projectsData],
  );

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') {
      return projectsData;
    }
    return projectsData.filter((project) => project.category === activeFilter);
  }, [activeFilter, projectsData]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitMessage('Thanks for reaching out. This form is ready to be connected to an email service.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const changeTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  const updateProfileField = (field, value) => {
    setProfileData((currentProfile) => ({ ...currentProfile, [field]: value }));
  };

  const updateSocialField = (field, value) => {
    setProfileData((currentProfile) => ({
      ...currentProfile,
      social: {
        ...currentProfile.social,
        [field]: value,
      },
    }));
  };

  const updateProject = (projectId, field, value) => {
    setProjectsData((currentProjects) =>
      currentProjects.map((project) =>
        project.id === projectId ? { ...project, [field]: value } : project,
      ),
    );
  };

  const addProject = () => {
    setProjectsData((currentProjects) => [...currentProjects, createProject()]);
  };

  const removeProject = (projectId) => {
    setProjectsData((currentProjects) => currentProjects.filter((project) => project.id !== projectId));
  };

  const updateSkillGroup = (groupIndex, field, value) => {
    setSkillsData((currentSkills) =>
      currentSkills.map((group, index) =>
        index === groupIndex ? { ...group, [field]: value } : group,
      ),
    );
  };

  const updateSkillItem = (groupIndex, itemIndex, field, value) => {
    setSkillsData((currentSkills) =>
      currentSkills.map((group, index) => {
        if (index !== groupIndex) {
          return group;
        }

        const nextItems = [...group.items];
        nextItems[itemIndex] = { ...nextItems[itemIndex], [field]: value };
        return { ...group, items: nextItems };
      }),
    );
  };

  const addSkillGroup = () => setSkillsData((currentSkills) => [...currentSkills, createSkillGroup()]);
  const removeSkillGroup = (groupIndex) => setSkillsData((currentSkills) => currentSkills.filter((_, index) => index !== groupIndex));
  const addSkillItem = (groupIndex) => {
    setSkillsData((currentSkills) =>
      currentSkills.map((group, index) =>
        index === groupIndex ? { ...group, items: [...group.items, { name: 'New Skill', icon: '✨' }] } : group,
      ),
    );
  };

  const removeSkillItem = (groupIndex, itemIndex) => {
    setSkillsData((currentSkills) =>
      currentSkills.map((group, index) => {
        if (index !== groupIndex) {
          return group;
        }

        return { ...group, items: group.items.filter((_, currentIndex) => currentIndex !== itemIndex) };
      }),
    );
  };

  const updateEducation = (entryIndex, field, value) => {
    setEducationData((currentEducation) =>
      currentEducation.map((entry, index) =>
        index === entryIndex ? { ...entry, [field]: value } : entry,
      ),
    );
  };

  const addEducation = () => setEducationData((currentEducation) => [...currentEducation, createEducation()]);
  const removeEducation = (entryIndex) => setEducationData((currentEducation) => currentEducation.filter((_, index) => index !== entryIndex));

  const updateExperience = (entryIndex, field, value) => {
    setExperienceData((currentExperience) =>
      currentExperience.map((entry, index) =>
        index === entryIndex ? { ...entry, [field]: value } : entry,
      ),
    );
  };

  const addExperience = () => setExperienceData((currentExperience) => [...currentExperience, createExperience()]);
  const removeExperience = (entryIndex) => setExperienceData((currentExperience) => currentExperience.filter((_, index) => index !== entryIndex));

  const updateCertificate = (entryIndex, field, value) => {
    setCertificationsData((currentCertifications) =>
      currentCertifications.map((entry, index) =>
        index === entryIndex ? { ...entry, [field]: value } : entry,
      ),
    );
  };

  const addCertificate = () => setCertificationsData((currentCertifications) => [...currentCertifications, createCertificate()]);
  const removeCertificate = (entryIndex) => setCertificationsData((currentCertifications) => currentCertifications.filter((_, index) => index !== entryIndex));

  const updateAchievement = (entryIndex, field, value) => {
    setAchievementsData((currentAchievements) =>
      currentAchievements.map((entry, index) =>
        index === entryIndex ? { ...entry, [field]: value } : entry,
      ),
    );
  };

  const addAchievement = () => setAchievementsData((currentAchievements) => [...currentAchievements, createAchievement()]);
  const removeAchievement = (entryIndex) => setAchievementsData((currentAchievements) => currentAchievements.filter((_, index) => index !== entryIndex));

  const renderEditorContent = () => {
    if (editorTab === 'profile') {
      return (
        <div className="editor-section">
          <h4>Profile</h4>
          <label>
            Name
            <input value={profileData.name} onChange={(event) => updateProfileField('name', event.target.value)} />
          </label>
          <label>
            Role
            <input value={profileData.role} onChange={(event) => updateProfileField('role', event.target.value)} />
          </label>
          <label>
            Location
            <input value={profileData.location} onChange={(event) => updateProfileField('location', event.target.value)} />
          </label>
          <label>
            Email
            <input value={profileData.email} onChange={(event) => updateProfileField('email', event.target.value)} />
          </label>
          <label>
            Phone
            <input value={profileData.phone} onChange={(event) => updateProfileField('phone', event.target.value)} />
          </label>
          <label>
            Resume Path
            <input value={profileData.resume} onChange={(event) => updateProfileField('resume', event.target.value)} />
          </label>
          <label>
            Profile Image Path
            <input value={profileData.profileImage} onChange={(event) => updateProfileField('profileImage', event.target.value)} />
          </label>
          <label>
            Status
            <select value={profileData.status} onChange={(event) => updateProfileField('status', event.target.value)}>
              {profileData.statusOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label>
            GitHub
            <input value={profileData.social.github} onChange={(event) => updateSocialField('github', event.target.value)} />
          </label>
          <label>
            LinkedIn
            <input value={profileData.social.linkedin} onChange={(event) => updateSocialField('linkedin', event.target.value)} />
          </label>
          <label>
            Instagram
            <input value={profileData.social.instagram} onChange={(event) => updateSocialField('instagram', event.target.value)} />
          </label>
        </div>
      );
    }

    if (editorTab === 'projects') {
      return (
        <div className="editor-section">
          <div className="editor-topbar">
            <h4>Projects</h4>
            <button type="button" className="small-button" onClick={addProject}>+ Add Project</button>
          </div>
          {projectsData.map((project, index) => (
            <div key={project.id ?? index} className="editor-card">
              <div className="editor-card-header">
                <strong>Project {index + 1}</strong>
                <button type="button" className="small-button danger" onClick={() => removeProject(project.id)}>
                  Remove
                </button>
              </div>
              <label>
                Title
                <input value={project.title} onChange={(event) => updateProject(project.id, 'title', event.target.value)} />
              </label>
              <label>
                Category
                <input value={project.category} onChange={(event) => updateProject(project.id, 'category', event.target.value)} />
              </label>
              <label>
                Description
                <textarea rows="3" value={project.description} onChange={(event) => updateProject(project.id, 'description', event.target.value)} />
              </label>
              <label>
                Image Path
                <input value={project.image} onChange={(event) => updateProject(project.id, 'image', event.target.value)} />
              </label>
              <label>
                Live Demo URL
                <input value={project.liveDemo} onChange={(event) => updateProject(project.id, 'liveDemo', event.target.value)} />
              </label>
              <label>
                GitHub URL
                <input value={project.github} onChange={(event) => updateProject(project.id, 'github', event.target.value)} />
              </label>
              <label>
                Date
                <input value={project.date} onChange={(event) => updateProject(project.id, 'date', event.target.value)} />
              </label>
              <label>
                Role
                <input value={project.role} onChange={(event) => updateProject(project.id, 'role', event.target.value)} />
              </label>
              <label>
                Technologies
                <input value={project.technologies.join(', ')} onChange={(event) => updateProject(project.id, 'technologies', event.target.value.split(',').map((item) => item.trim()).filter(Boolean))} />
              </label>
              <label>
                Features
                <input value={project.features.join(', ')} onChange={(event) => updateProject(project.id, 'features', event.target.value.split(',').map((item) => item.trim()).filter(Boolean))} />
              </label>
            </div>
          ))}
        </div>
      );
    }

    if (editorTab === 'skills') {
      return (
        <div className="editor-section">
          <div className="editor-topbar">
            <h4>Skills</h4>
            <button type="button" className="small-button" onClick={addSkillGroup}>+ Add Group</button>
          </div>
          {skillsData.map((group, groupIndex) => (
            <div key={`${group.category}-${groupIndex}`} className="editor-card">
              <div className="editor-card-header">
                <strong>Category {groupIndex + 1}</strong>
                <button type="button" className="small-button danger" onClick={() => removeSkillGroup(groupIndex)}>Remove</button>
              </div>
              <label>
                Category Name
                <input value={group.category} onChange={(event) => updateSkillGroup(groupIndex, 'category', event.target.value)} />
              </label>
              {group.items.map((item, itemIndex) => (
                <div key={`${item.name}-${itemIndex}`} className="mini-editor">
                  <input value={item.name} onChange={(event) => updateSkillItem(groupIndex, itemIndex, 'name', event.target.value)} />
                  <input value={item.icon} onChange={(event) => updateSkillItem(groupIndex, itemIndex, 'icon', event.target.value)} />
                  <button type="button" className="small-button danger" onClick={() => removeSkillItem(groupIndex, itemIndex)}>Remove</button>
                </div>
              ))}
              <button type="button" className="small-button" onClick={() => addSkillItem(groupIndex)}>+ Add Skill</button>
            </div>
          ))}
        </div>
      );
    }

    if (editorTab === 'education') {
      return (
        <div className="editor-section">
          <div className="editor-topbar">
            <h4>Education</h4>
            <button type="button" className="small-button" onClick={addEducation}>+ Add Education</button>
          </div>
          {educationData.map((entry, index) => (
            <div key={`${entry.degree}-${index}`} className="editor-card">
              <div className="editor-card-header">
                <strong>Education {index + 1}</strong>
                <button type="button" className="small-button danger" onClick={() => removeEducation(index)}>Remove</button>
              </div>
              <label>
                Degree
                <input value={entry.degree} onChange={(event) => updateEducation(index, 'degree', event.target.value)} />
              </label>
              <label>
                Institution
                <input value={entry.institution} onChange={(event) => updateEducation(index, 'institution', event.target.value)} />
              </label>
              <label>
                Start Year
                <input value={entry.startYear} onChange={(event) => updateEducation(index, 'startYear', event.target.value)} />
              </label>
              <label>
                End Year
                <input value={entry.endYear} onChange={(event) => updateEducation(index, 'endYear', event.target.value)} />
              </label>
              <label>
                CGPA
                <input value={entry.cgpa} onChange={(event) => updateEducation(index, 'cgpa', event.target.value)} />
              </label>
              <label>
                Location
                <input value={entry.location} onChange={(event) => updateEducation(index, 'location', event.target.value)} />
              </label>
              <label>
                Description
                <textarea rows="3" value={entry.description} onChange={(event) => updateEducation(index, 'description', event.target.value)} />
              </label>
            </div>
          ))}
        </div>
      );
    }

    if (editorTab === 'experience') {
      return (
        <div className="editor-section">
          <div className="editor-topbar">
            <h4>Experience</h4>
            <button type="button" className="small-button" onClick={addExperience}>+ Add Experience</button>
          </div>
          {experienceData.map((entry, index) => (
            <div key={`${entry.company}-${index}`} className="editor-card">
              <div className="editor-card-header">
                <strong>Experience {index + 1}</strong>
                <button type="button" className="small-button danger" onClick={() => removeExperience(index)}>Remove</button>
              </div>
              <label>
                Company
                <input value={entry.company} onChange={(event) => updateExperience(index, 'company', event.target.value)} />
              </label>
              <label>
                Role
                <input value={entry.role} onChange={(event) => updateExperience(index, 'role', event.target.value)} />
              </label>
              <label>
                Start Date
                <input value={entry.startDate} onChange={(event) => updateExperience(index, 'startDate', event.target.value)} />
              </label>
              <label>
                End Date
                <input value={entry.endDate} onChange={(event) => updateExperience(index, 'endDate', event.target.value)} />
              </label>
              <label>
                Location
                <input value={entry.location} onChange={(event) => updateExperience(index, 'location', event.target.value)} />
              </label>
              <label>
                Description
                <textarea rows="3" value={entry.description} onChange={(event) => updateExperience(index, 'description', event.target.value)} />
              </label>
              <label>
                Responsibilities
                <input value={entry.responsibilities.join(', ')} onChange={(event) => updateExperience(index, 'responsibilities', event.target.value.split(',').map((item) => item.trim()).filter(Boolean))} />
              </label>
              <label>
                Technologies
                <input value={entry.technologies.join(', ')} onChange={(event) => updateExperience(index, 'technologies', event.target.value.split(',').map((item) => item.trim()).filter(Boolean))} />
              </label>
            </div>
          ))}
        </div>
      );
    }

    if (editorTab === 'certifications') {
      return (
        <div className="editor-section">
          <div className="editor-topbar">
            <h4>Certifications</h4>
            <button type="button" className="small-button" onClick={addCertificate}>+ Add Certification</button>
          </div>
          {certificationsData.map((entry, index) => (
            <div key={`${entry.name}-${index}`} className="editor-card">
              <div className="editor-card-header">
                <strong>Certification {index + 1}</strong>
                <button type="button" className="small-button danger" onClick={() => removeCertificate(index)}>Remove</button>
              </div>
              <label>
                Name
                <input value={entry.name} onChange={(event) => updateCertificate(index, 'name', event.target.value)} />
              </label>
              <label>
                Organization
                <input value={entry.organization} onChange={(event) => updateCertificate(index, 'organization', event.target.value)} />
              </label>
              <label>
                Date
                <input value={entry.date} onChange={(event) => updateCertificate(index, 'date', event.target.value)} />
              </label>
              <label>
                Image URL
                <input value={entry.image} onChange={(event) => updateCertificate(index, 'image', event.target.value)} />
              </label>
              <label>
                Certificate URL
                <input value={entry.url} onChange={(event) => updateCertificate(index, 'url', event.target.value)} />
              </label>
              <label>
                Credential ID
                <input value={entry.credentialId} onChange={(event) => updateCertificate(index, 'credentialId', event.target.value)} />
              </label>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="editor-section">
        <div className="editor-topbar">
          <h4>Achievements</h4>
          <button type="button" className="small-button" onClick={addAchievement}>+ Add Achievement</button>
        </div>
        {achievementsData.map((entry, index) => (
          <div key={`${entry.title}-${index}`} className="editor-card">
            <div className="editor-card-header">
              <strong>Achievement {index + 1}</strong>
              <button type="button" className="small-button danger" onClick={() => removeAchievement(index)}>Remove</button>
            </div>
            <label>
              Title
              <input value={entry.title} onChange={(event) => updateAchievement(index, 'title', event.target.value)} />
            </label>
            <label>
              Description
              <textarea rows="3" value={entry.description} onChange={(event) => updateAchievement(index, 'description', event.target.value)} />
            </label>
            <label>
              Date
              <input value={entry.date} onChange={(event) => updateAchievement(index, 'date', event.target.value)} />
            </label>
            <label>
              Organization
              <input value={entry.organization} onChange={(event) => updateAchievement(index, 'organization', event.target.value)} />
            </label>
            <label>
              Image URL
              <input value={entry.image} onChange={(event) => updateAchievement(index, 'image', event.target.value)} />
            </label>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="app-shell">
      <header className="site-header">
        <nav className="nav container" aria-label="Main navigation">
          <a className="brand" href="#home">
            {profileData.name}
          </a>

          <button
            type="button"
            className="menu-toggle"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>

          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            ))}
          </div>

          <div className="nav-actions">
            <button
              type="button"
              className="icon-button"
              aria-label="Toggle theme"
              onClick={changeTheme}
            >
              {theme === 'dark' ? '☀' : '☾'}
            </button>
            <button type="button" className="button primary editor-toggle" onClick={() => setEditorOpen((open) => !open)}>
              {editorOpen ? 'Close Editor' : 'Edit Website'}
            </button>
            <a className="button primary" href={profileData.resume} download>
              Download Resume
            </a>
          </div>
        </nav>
      </header>

      {editorOpen && (
        <aside className="editor-panel">
          <div className="editor-header">
            <h3>Content Editor</h3>
            <button type="button" className="small-button" onClick={() => setEditorOpen(false)}>Close</button>
          </div>
          <div className="editor-tabs">
            {['profile', 'projects', 'skills', 'education', 'experience', 'certifications', 'achievements'].map((tab) => (
              <button
                key={tab}
                type="button"
                className={editorTab === tab ? 'tab-button active' : 'tab-button'}
                onClick={() => setEditorTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          {renderEditorContent()}
        </aside>
      )}

      <main>
        <section id="home" className="hero section container">
          <div className="hero-copy reveal">
            <div className="intro-line">Hi, I&apos;m {profileData.name} 👋</div>
            <h1>{profileData.role.split('|')[0].trim()}</h1>
            <p className="subtitle">{profileData.role.includes('|') ? profileData.role.split('|')[1].trim() : 'Technology Enthusiast'}</p>
            <p className="lead">
              Computer Science Engineering graduate passionate about technology, web development, cloud platforms,
              databases, and building practical digital solutions.
            </p>

            <div className="status-row">
              <span className="status-pill">
                <span className="status-dot" />
                {profileData.status}
              </span>
            </div>

            <div className="cta-row">
              <a className="button primary" href="#projects">
                View Projects
              </a>
              <a className="button secondary" href={profileData.resume} target="_blank" rel="noreferrer">
                Download Resume
              </a>
            </div>

            <div className="social-row" aria-label="Social links">
              {socialLinks.map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noreferrer" aria-label={link.label}>
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="hero-visual reveal">
            <div className="profile-glow" />
            <div className="profile-card">
              <img src={profileData.profileImage} alt={`${profileData.name} portrait`} />
            </div>
          </div>
        </section>

        <section id="about" className="section container">
          <div className="section-heading">
            <span className="eyebrow">About Me</span>
            <h2>About Me</h2>
          </div>

          <div className="about-grid">
            <div className="about-copy">
              <p>
                Motivated fresher with a strong foundation in Python, full stack development, SQL, and problem-solving.
                Passionate about learning new technologies and developing real-world applications while contributing to a professional team.
              </p>
              <p>
                I am seeking an entry-level software developer opportunity where I can apply my technical knowledge, build practical solutions,
                and continue growing as a technology professional in a collaborative environment.
              </p>
            </div>

            <div className="stats-grid">
              {[
                { label: 'B.Tech Graduate', value: '2026' },
                { label: 'IT Fresher', value: 'Entry' },
                { label: 'Web Projects', value: '05+' },
                { label: 'Cloud & Database', value: 'Hands-on' },
              ].map((stat) => (
                <div key={stat.label} className="stat-card">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="skills" className="section container">
          <div className="section-heading">
            <span className="eyebrow">Technical Skills</span>
            <h2>Technical Skills</h2>
          </div>

          <div className="skills-grid">
            {skillsData.map((group) => (
              <div className="skill-group" key={group.category}>
                <h3>{group.category}</h3>
                <div className="skill-items">
                  {group.items.map((skill) => (
                    <div className="skill-card" key={`${group.category}-${skill.name}`}>
                      <span className="skill-icon">{skill.icon}</span>
                      <span>{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="projects" className="section container">
          <div className="section-heading projects-heading">
            <div>
              <span className="eyebrow">Featured Projects</span>
              <h2>Featured Projects</h2>
            </div>
            <button type="button" className="inline-button" onClick={() => setEditorOpen(true)}>
              + Add Project
            </button>
          </div>

          <div className="filter-row" aria-label="Project filters">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={filter === activeFilter ? 'filter-chip active' : 'filter-chip'}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="project-grid">
            {filteredProjects.map((project) => (
              <article className="project-card reveal" key={project.id ?? project.title}>
                <img src={project.image} alt={project.title} loading="lazy" />
                <div className="project-content">
                  <div className="project-meta">
                    <span>{project.category}</span>
                    <span>{project.date}</span>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>

                  <div className="project-tech">
                    {project.technologies.map((tech) => (
                      <span key={`${project.title}-${tech}`}>{tech}</span>
                    ))}
                  </div>

                  <ul>
                    {project.features.map((feature) => (
                      <li key={`${project.title}-${feature}`}>{feature}</li>
                    ))}
                  </ul>

                  <div className="project-actions">
                    <a href={project.liveDemo} target="_blank" rel="noreferrer" className="button secondary small">
                      Live Demo
                    </a>
                    <a href={project.github} target="_blank" rel="noreferrer" className="button primary small">
                      GitHub
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="experience" className="section container">
          <div className="section-heading">
            <span className="eyebrow">Experience</span>
            <h2>Experience</h2>
          </div>

          <div className="timeline">
            {experienceData.map((item, index) => (
              <article className="timeline-item" key={`${item.company}-${index}`}>
                <div className="timeline-bullet" />
                <div className="timeline-content">
                  <div className="timeline-header">
                    <div>
                      <h3>{item.company}</h3>
                      <p>{item.role}</p>
                    </div>
                    <span>
                      {item.startDate} - {item.endDate}
                    </span>
                  </div>
                  <p className="location">{item.location}</p>
                  <p>{item.description}</p>
                  <ul>
                    {item.responsibilities.map((responsibility) => (
                      <li key={responsibility}>{responsibility}</li>
                    ))}
                  </ul>
                  <div className="project-tech">
                    {item.technologies.map((tech) => (
                      <span key={`${item.company}-${tech}`}>{tech}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="education" className="section container">
          <div className="section-heading">
            <span className="eyebrow">Education</span>
            <h2>Education</h2>
          </div>

          <div className="timeline">
            {educationData.map((item, index) => (
              <article className="timeline-item" key={`${item.degree}-${index}`}>
                <div className="timeline-bullet" />
                <div className="timeline-content">
                  <div className="timeline-header">
                    <div>
                      <h3>{item.degree}</h3>
                      <p>{item.institution}</p>
                    </div>
                    <span>
                      {item.startYear} - {item.endYear}
                    </span>
                  </div>
                  <p className="location">{item.location}</p>
                  <p>{item.cgpa}</p>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="certifications" className="section container">
          <div className="section-heading projects-heading">
            <div>
              <span className="eyebrow">Certifications</span>
              <h2>Certifications</h2>
            </div>
            <button type="button" className="inline-button" onClick={() => setEditorOpen(true)}>
              + Add Certification
            </button>
          </div>

          <div className="cert-grid">
            {certificationsData.map((certificate) => (
              <article className="cert-card" key={certificate.name}>
                <img src={certificate.image} alt={certificate.name} loading="lazy" />
                <div className="cert-content">
                  <h3>{certificate.name}</h3>
                  <p>{certificate.organization}</p>
                  <span>{certificate.date}</span>
                  <small>{certificate.credentialId}</small>
                  <a href={certificate.url} target="_blank" rel="noreferrer">
                    View Certificate
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {achievementsData.length > 0 && (
          <section id="achievements" className="section container">
            <div className="section-heading">
              <span className="eyebrow">Achievements</span>
              <h2>Achievements</h2>
            </div>
            <div className="achievement-list">
              {achievementsData.map((achievement) => (
                <div key={achievement.title} className="achievement-item">
                  <h3>{achievement.title}</h3>
                  <p>{achievement.description}</p>
                  <span>{achievement.date}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <section id="resume" className="section container">
          <div className="resume-card">
            <div>
              <span className="eyebrow">Resume</span>
              <h2>Download My Resume</h2>
            </div>
            <div className="resume-actions">
              <a className="button primary" href={profileData.resume} download>
                Download Resume
              </a>
              <a className="button secondary" href={profileData.resume} target="_blank" rel="noreferrer">
                View Resume
              </a>
            </div>
          </div>
        </section>

        <section id="contact" className="section container">
          <div className="section-heading">
            <span className="eyebrow">Contact</span>
            <h2>Let&apos;s Connect</h2>
          </div>

          <div className="contact-grid">
            <div className="contact-info">
              <p className="contact-lead">
                Have an opportunity, project, or question? I&apos;d be happy to connect.
              </p>
              <ul>
                <li>
                  <strong>Email:</strong> <a href={`mailto:${profileData.email}`}>{profileData.email}</a>
                </li>
                <li>
                  <strong>Phone:</strong> <a href={`tel:${profileData.phone}`}>{profileData.phone}</a>
                </li>
                <li>
                  <strong>Location:</strong> {profileData.location}
                </li>
                <li>
                  <strong>LinkedIn:</strong> <a href={profileData.social.linkedin} target="_blank" rel="noreferrer">linkedin.com/in/roopsai-pavuluri-064b7b28a</a>
                </li>
                <li>
                  <strong>GitHub:</strong> <a href={profileData.social.github} target="_blank" rel="noreferrer">github.com/roopsaipavuluri</a>
                </li>
              </ul>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <label>
                  Name
                  <input type="text" name="name" value={formData.name} onChange={handleFormChange} required />
                </label>
              </div>
              <div className="form-row">
                <label>
                  Email
                  <input type="email" name="email" value={formData.email} onChange={handleFormChange} required />
                </label>
              </div>
              <div className="form-row">
                <label>
                  Subject
                  <input type="text" name="subject" value={formData.subject} onChange={handleFormChange} required />
                </label>
              </div>
              <div className="form-row">
                <label>
                  Message
                  <textarea name="message" value={formData.message} onChange={handleFormChange} required rows="5" />
                </label>
              </div>

              <button type="submit" className="button primary full-width">
                Send Message
              </button>
              {submitMessage && <p className="form-success">{submitMessage}</p>}
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <h3>{profileData.name}</h3>
            <p>{profileData.role}</p>
          </div>

          <div className="footer-links">
            {navItems.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </div>

          <div className="footer-contact">
            <a href={`mailto:${profileData.email}`}>{profileData.email}</a>
            <span>{profileData.location}</span>
            <div className="social-row footer-social">
              {socialLinks.map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noreferrer" aria-label={link.label}>
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="footer-bottom">© 2026 {profileData.name}. All rights reserved.</div>
      </footer>
    </div>
  );
}

export default App;

const projectData = {
  scratch: {
    eyebrow: 'Proyecto 01 / Scratch',
    title: 'Scratch',
    description: 'Dos proyectos creados con Scratch. Explorá cada uno.',
    placeholder: 'Próximamente'
  },
  inventor: {
    eyebrow: 'Proyecto 02 / App Inventor',
    title: 'App Inventor',
    description: 'Dos proyectos creados con MIT App Inventor. Explorá cada uno.',
    placeholder: 'El proyecto aparecerá aquí próximamente.'
  },
  pseint: {
    eyebrow: 'Proyecto 03 / PSeInt',
    title: 'PSeInt',
    description: 'Un proyecto desarrollado con PSeInt. Dos capturas forman parte del mismo algoritmo.',
    placeholder: 'El proyecto aparecerá aquí próximamente.'
  }
};

const projectLinks = {
  scratch: ['https://scratch.mit.edu/projects/1396003041/fullscreen/', 'https://scratch.mit.edu/projects/1396062693/fullscreen/'],
  inventor: ['appinventor-qr-1.png', 'appinventor-qr-2.png'],
  pseint: ['pseint-1.png', 'pseint-2.png']
};
const picker = document.querySelector('#projectPicker');
const detail = document.querySelector('#projectDetail');
const backButton = document.querySelector('#backButton');
const detailEyebrow = document.querySelector('#detailEyebrow');
const detailTitle = document.querySelector('#detailTitle');
const detailDescription = document.querySelector('#detailDescription');
const projectSlots = document.querySelector('#projectSlots');

let activeProject = '';

function renderProjectSlots(projectName) {
  projectSlots.replaceChildren();

  [1, 2].forEach((slotNumber) => {
    const projectUrl = projectLinks[projectName][slotNumber - 1];
    const slot = document.createElement('article');
    slot.className = 'project-slot';

    if (projectName === 'scratch' || projectName === 'inventor') {
      const heading = document.createElement('h2');
      heading.textContent = `Proyecto ${slotNumber}`;
      slot.append(heading);
    }

    const screen = document.createElement('div');
    screen.className = 'project-slot-screen';

    if (projectName === 'pseint' && slotNumber === 1) {
      const imageLabel = document.createElement('span');
      imageLabel.className = 'project-image-label';
      imageLabel.textContent = 'Proyecto 1';
      screen.append(imageLabel);
    }

    if ((projectName === 'inventor' || projectName === 'pseint') && projectUrl) {
      const projectImage = document.createElement('img');
      projectImage.className = 'project-qr-image';
      projectImage.src = projectUrl;
      projectImage.alt = projectName === 'inventor'
        ? `Código QR del proyecto ${slotNumber} de App Inventor`
        : `Captura del algoritmo de PSeInt ${slotNumber}`;
      projectImage.loading = 'eager';
      screen.append(projectImage);
    } else if (projectName === 'scratch' && projectUrl) {
      const projectId = getScratchProjectId(projectUrl);
      if (projectId && false) {
        const frame = document.createElement('iframe');
        frame.title = `Proyecto ${slotNumber} de ${projectData[projectName].title}`;
        frame.allow = 'autoplay; fullscreen';
        frame.allowFullscreen = true;
        frame.src = `https://scratch.mit.edu/projects/${projectId}/embed`;
        screen.append(frame);
      }

      const link = document.createElement('a');
      link.className = 'project-open-link';
      link.href = projectUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = slotNumber === 1 ? 'Jugar' : 'Ver';
      screen.append(link);
    }

    if (!screen.childElementCount) {
      const placeholder = document.createElement('p');
      placeholder.className = 'project-slot-placeholder';
      placeholder.textContent = projectData[projectName].placeholder;
      screen.append(placeholder);
    }

    slot.append(screen);
    projectSlots.append(slot);
  });
}

function getScratchProjectId(value) {
  const trimmedValue = value.trim();
  if (/^\d+$/.test(trimmedValue)) return trimmedValue;

  try {
    const url = new URL(trimmedValue);
    if (url.hostname !== 'scratch.mit.edu' && !url.hostname.endsWith('.scratch.mit.edu')) return '';
    return url.pathname.match(/\/projects\/(\d+)/)?.[1] || '';
  } catch {
    return '';
  }
}

function openProject(projectName) {
  activeProject = projectName;
  const project = projectData[projectName];
  detailEyebrow.textContent = project.eyebrow;
  detailTitle.textContent = project.title;
  detailDescription.textContent = project.description;
  picker.hidden = true;
  detail.hidden = false;
  projectSlots.hidden = false;
  renderProjectSlots(projectName);

  backButton.focus();
}

document.querySelectorAll('[data-project]').forEach((button) => {
  button.addEventListener('click', () => openProject(button.dataset.project));
});

backButton.addEventListener('click', () => {
  detail.hidden = true;
  picker.hidden = false;
  document.querySelector(`[data-project="${activeProject}"]`)?.focus();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !detail.hidden) backButton.click();
});

// DOM ready check
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded");
    initializeFilters();

    // Mobile menu toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            document.querySelector('.nav-list')?.classList.toggle('active');
        });
    }

    // Dropdown toggle for mobile navigation
    document.querySelectorAll('.with-dropdown > a').forEach(item => {
        item.addEventListener('click', function (e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation(); // Prevents interference with other clicks;
                this.nextElementSibling?.classList.toggle('active');
            }
        });
    });

    // Scholarship mobile toggle
    const scholarshipToggle = document.querySelector('.mobile-scholarship-toggle');
    if (scholarshipToggle) {
        scholarshipToggle.addEventListener('click', function () {
            this.classList.toggle('active');
        });
    }
});

// Modal for profile
function openModal(name, school, major, email = '', job = '', imageSrc) {
    const existingModal = document.getElementById("profileModal");
    if (existingModal) existingModal.remove();

    const modal = document.createElement("div");
    modal.className = "modal";
    modal.id = "profileModal";
    modal.innerHTML = `
        <span class="close" onclick="document.getElementById('profileModal').remove()">×</span>
        <div class="modal-content">
            <img src="${imageSrc}" alt="${name}">
            <h2>${name}</h2>
            <p><strong>University:</strong> ${school}</p>
            <p><strong>Major:</strong> ${major}</p>
            ${email ? `<p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>` : ''}
            ${job ? `<p><strong>Job:</strong> ${job}</p>` : ''}
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = "flex";
}

// Password screen
function checkPassword() {
    const correctPassword = "123";
    const input = document.getElementById("passwordInput").value;
    const screen = document.getElementById("passwordScreen");
    const content = document.getElementById("content");
    const error = document.getElementById("errorMessage");

    if (input === correctPassword) {
        screen.style.display = "none";
        content.style.display = "block";
    } else {
        error.textContent = "Incorrect password. Please try again.";
    }
}

// Filters: setup and populate
function initializeFilters() {
    console.log("Initializing filters...");
    const members = document.querySelectorAll('.grid-item');
    const universities = new Set();
    const majors = new Set();
    const years = new Set();

    members.forEach(member => {
        const section = member.closest('div[class^="members-row"]')?.previousElementSibling;
        if (section && section.tagName === 'H2') {
            years.add(section.textContent.replace(' Scholarship Recipients', '').trim());
        }

        const onclickText = member.getAttribute('onclick');
        if (onclickText) {
            const parts = onclickText.split("'");
            if (parts.length >= 6) {
                universities.add(parts[3].trim());
                majors.add(parts[5].trim());
            }
        }
    });

    populateSelect('universityFilter', universities);
    populateSelect('majorFilter', majors);
    populateSelect('yearFilter', years);
}

// Helper: populate a filter dropdown
function populateSelect(id, valuesSet) {
    const select = document.getElementById(id);
    if (!select) return;
    Array.from(valuesSet).sort().forEach(value => {
        if (value) {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            select.appendChild(option);
        }
    });
}

// Filter members based on dropdowns
function filterMembers() {
    const universityValue = document.getElementById('universityFilter')?.value.toLowerCase();
    const majorValue = document.getElementById('majorFilter')?.value.toLowerCase();
    const yearValue = document.getElementById('yearFilter')?.value.toLowerCase();

    const members = document.querySelectorAll('.grid-item');
    let anyVisible = false;

    members.forEach(member => {
        const onclickText = member.getAttribute('onclick');
        let matchesUniversity = true;
        let matchesMajor = true;
        let matchesYear = true;

        if (onclickText) {
            const parts = onclickText.split("'");
            if (parts.length >= 6) {
                const memberUniversity = parts[3].toLowerCase();
                const memberMajor = parts[5].toLowerCase();

                if (universityValue && !memberUniversity.includes(universityValue)) {
                    matchesUniversity = false;
                }
                if (majorValue && !memberMajor.includes(majorValue)) {
                    matchesMajor = false;
                }
            }
        }

        if (yearValue) {
            const section = member.closest('div[class^="members-row"]')?.previousElementSibling;
            const memberYear = section?.textContent.replace(' Scholarship Recipients', '').trim().toLowerCase();
            if (!memberYear || !memberYear.includes(yearValue)) {
                matchesYear = false;
            }
        }

        if (matchesUniversity && matchesMajor && matchesYear) {
            member.style.display = 'block';
            anyVisible = true;
        } else {
            member.style.display = 'none';
        }
    });

    const noResults = document.getElementById('noResults');
    if (noResults) {
        noResults.style.display = anyVisible ? 'none' : 'block';
    }
}

// Reset filters
function resetFilters() {
    ['universityFilter', 'majorFilter', 'yearFilter'].forEach(id => {
        const select = document.getElementById(id);
        if (select) select.value = '';
    });
    filterMembers();
}

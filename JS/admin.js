document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const viewStudent = document.getElementById('view-student');
    const viewTeacher = document.getElementById('view-teacher');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const text = item.textContent.trim();
            
            if (text === 'Add Student' || text === 'Add Teacher') {
                e.preventDefault();
                
                // Update Sidebar Active State
                navItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                // Toggle Views
                if (text === 'Add Student') {
                    viewStudent.style.display = 'block';
                    viewTeacher.style.display = 'none';
                } else if (text === 'Add Teacher') {
                    viewStudent.style.display = 'none';
                    viewTeacher.style.display = 'block';
                }
            }
        });
    });
});

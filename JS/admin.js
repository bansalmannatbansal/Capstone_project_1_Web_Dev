document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const viewDashboard = document.getElementById('view-dashboard');
    const viewStudent = document.getElementById('view-student');
    const viewTeacher = document.getElementById('view-teacher');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const text = item.textContent.trim();
            
            if (text.includes('Dashboard') || text.includes('Add Student') || text.includes('Add Teacher')) {
                e.preventDefault();
                
                // Update Sidebar Active State
                navItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                // Hide all views first
                viewDashboard.style.display = 'none';
                viewStudent.style.display = 'none';
                viewTeacher.style.display = 'none';

                // Toggle Views
                if (text.includes('Dashboard')) {
                    viewDashboard.style.display = 'grid'; // Uses dashboard-hero-grid
                } else if (text.includes('Add Student')) {
                    viewStudent.style.display = 'block';
                } else if (text.includes('Add Teacher')) {
                    viewTeacher.style.display = 'block';
                }
            }
        });
    });
});


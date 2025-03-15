class TodoList {
            constructor() {
                this.tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
                this.filter = 'all';
                this.initializeElements();
                this.addEventListeners();
                this.render();
            }

            initializeElements() {
                this.newTaskInput = document.getElementById('newTask');
                this.dateInput = document.getElementById('datepicker');
                this.addButton = document.getElementById('addTask');
                this.taskList = document.getElementById('taskList');
                this.filterButton = document.getElementById('filterButton');
                this.filterModal = document.getElementById('filterModal');
                this.taskCount = document.querySelector('.task-count');

                // Set default date to today
                const today = new Date().toISOString().split('T')[0];
                this.dateInput.value = today;
            }

            addEventListeners() {
                this.addButton.addEventListener('click', () => this.addTask());
                this.filterButton.addEventListener('click', () => this.toggleFilterModal());
                
                document.querySelectorAll('input[name="filter"]').forEach(radio => {
                    radio.addEventListener('change', (e) => {
                        this.filter = e.target.value;
                        this.filterButton.textContent = `Filter: ${this.filter}`;
                        this.toggleFilterModal();
                        this.render();
                    });
                });

                // Close modal when clicking outside
                this.filterModal.addEventListener('click', (e) => {
                    if (e.target === this.filterModal) {
                        this.toggleFilterModal();
                    }
                });
            }

            toggleFilterModal() {
                this.filterModal.style.display = 
                    this.filterModal.style.display === 'block' ? 'none' : 'block';
            }

            addTask() {
                const text = this.newTaskInput.value.trim();
                const dueDate = this.dateInput.value;
                
                if (text && dueDate) {
                    const task = {
                        id: Date.now().toString(),
                        text: text,
                        completed: false,
                        dueDate: new Date(dueDate)
                    };

                    this.tasks.push(task);
                    this.saveTasks();
                    this.newTaskInput.value = '';
                    this.render();
                }
            }

            toggleTask(id) {
                this.tasks = this.tasks.map(task =>
                    task.id === id ? { ...task, completed: !task.completed } : task
                );
                this.saveTasks();
                this.render();
            }

            deleteTask(id) {
                this.tasks = this.tasks.filter(task => task.id !== id);
                this.saveTasks();
                this.render();
            }

            saveTasks() {
                localStorage.setItem('tasks', JSON.stringify(this.tasks));
            }

            formatDate(date) {
                const d = new Date(date);
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return `${months[d.getMonth()]} ${d.getDate()}`;
            }

            render() {
                const filteredTasks = this.tasks.filter(task => {
                    if (this.filter === 'all') return true;
                    if (this.filter === 'active') return !task.completed;
                    if (this.filter === 'completed') return task.completed;
                    return true;
                });

                this.taskList.innerHTML = filteredTasks.map(task => `
                    <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                        <div class="task-content">
                            <div class="checkbox" onclick="todoList.toggleTask('${task.id}')"></div>
                            <span class="task-text">${task.text}</span>
                        </div>
                        <div class="task-actions">
                            <span class="task-date">${this.formatDate(task.dueDate)}</span>
                            <button onclick="todoList.deleteTask('${task.id}')">x</button>
                        </div>
                    </li>
                `).join('');

                this.taskCount.textContent = `${filteredTasks.length} tasks`;
            }
        }

        const todoList = new TodoList();
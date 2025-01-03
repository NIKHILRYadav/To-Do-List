let todos = [];
        let editingId = null;

      
        function loadTodos() {
            const savedTodos = localStorage.getItem('todos');
            if (savedTodos) {
                todos = JSON.parse(savedTodos);
                renderTodos();
                updateStats();
            }
        }

       
        function saveTodos() {
            localStorage.setItem('todos', JSON.stringify(todos));
            updateStats();
        }

        function addTodo() {
            const input = document.getElementById('todoInput');
            const category = document.getElementById('categorySelect').value;
            const priority = document.getElementById('prioritySelect').value;
            const text = input.value.trim();

            if (text) {
                if (editingId !== null) {
                   
                    const todoIndex = todos.findIndex(todo => todo.id === editingId);
                    if (todoIndex !== -1) {
                        todos[todoIndex] = {
                            ...todos[todoIndex],
                            text,
                            category,
                            priority,
                            updatedAt: new Date().toISOString()
                        };
                    }
                    editingId = null;
                } else {
                    
                    const newTodo = {
                        id: Date.now(),
                        text,
                        category,
                        priority,
                        completed: false,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    };
                    todos.unshift(newTodo);
                }

                input.value = '';
                saveTodos();
                renderTodos();
            }
        }

        function toggleTodo(id) {
            const todo = todos.find(t => t.id === id);
            if (todo) {
                todo.completed = !todo.completed;
                todo.updatedAt = new Date().toISOString();
                saveTodos();
                renderTodos();
            }
        }

        function deleteTodo(id) {
            todos = todos.filter(todo => todo.id !== id);
            saveTodos();
            renderTodos();
        }

        function editTodo(id) {
            const todo = todos.find(t => t.id === id);
            if (todo) {
                editingId = id;
                document.getElementById('todoInput').value = todo.text;
                document.getElementById('categorySelect').value = todo.category;
                document.getElementById('prioritySelect').value = todo.priority;
            }
        }

        function applyFilters() {
            renderTodos();
        }

        function getFilteredTodos() {
            const categoryFilter = document.getElementById('filterCategory').value;
            const priorityFilter = document.getElementById('filterPriority').value;
            const statusFilter = document.getElementById('filterStatus').value;

            return todos.filter(todo => {
                const categoryMatch = categoryFilter === 'all' || todo.category === categoryFilter;
                const priorityMatch = priorityFilter === 'all' || todo.priority === priorityFilter;
                const statusMatch = statusFilter === 'all' || 
                    (statusFilter === 'completed' && todo.completed) || 
                    (statusFilter === 'active' && !todo.completed);

                return categoryMatch && priorityMatch && statusMatch;
            });
        }

        function renderTodos() {
            const todoList = document.getElementById('todoList');
            const filteredTodos = getFilteredTodos();

            todoList.innerHTML = filteredTodos.map(todo => `
                <div class="todo-item ${todo.completed ? 'completed' : ''}">
                    <input type="checkbox";
                           ${todo.completed ? 'checked' : ''} 
                           onchange="toggleTodo(${todo.id})">
                    <span class="todo-text">${todo.text}</span>
                    <span class="category-tag">${todo.category}</span>
                    <span class="priority-${todo.priority}">
                        ${todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                    </span>
                    <div class="todo-actions">
                        <button class="edit-btn" onclick="editTodo(${todo.id})">Edit</button>
                        <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delets</button>
                    </div>
                </div>
            `).join('');
        }

        function updateStats() {
            const totalTasks = todos.length;
            const completedTasks = todos.filter(todo => todo.completed).length;
            const pendingTasks = totalTasks - completedTasks;

            document.getElementById('totalTasks').textContent = totalTasks;
            document.getElementById('completedTasks').textContent = completedTasks;
            document.getElementById('pendingTasks').textContent = pendingTasks;
        }

        document.getElementById('todoInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTodo();
            }
        });

        loadTodos();
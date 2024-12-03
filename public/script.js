const API_URL = '/api/employees.js';

async function fetchEmployees() {
    try {
        const response = await fetch(API_URL);
        if (response.ok) {
            const employees = await response.json();
            displayEmployees(employees);
        } else {
            console.error('Erro ao buscar funcionários:', await response.json());
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
}

// Função para adicionar funcionário
document.getElementById("addForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Formulário enviado."); // Log para confirmar envio do formulário
    const name = document.getElementById("name").value;
    const position = document.getElementById("position").value;
    const salary = document.getElementById("salary").value;
    const dob = document.getElementById("dob").value;
    const address = document.getElementById("address").value;
    console.log("Dados coletados do formulário:", { name, position, salary, dob, address }); // Log para ver os dados coletados
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, position, salary, dob, address }),
        });
        console.log("Resposta da API ao criar funcionário:", response); // Log da resposta completa da API
        if (response.ok) {
            const newEmployee = await response.json(); // Aguarda o JSON da resposta
            console.log("Funcionário criado com sucesso:", newEmployee); // Loga o funcionário criado
            fetchEmployees(); // Atualiza a lista de funcionários
            document.getElementById("addForm").reset(); // Reseta o formulário
        } else {
            console.error("Erro ao criar funcionário:", await response.json()); // Loga o erro vindo do backend
        }
    } catch (error) {
        console.error("Erro na requisição de criação:", error); // Log de erro no fetch
    }
});



// Função para buscar e exibir funcionários
async function fetchEmployees() {
    console.log("Buscando funcionários..."); // Log antes de buscar
    try {
        const response = await fetch(API_URL);
        console.log("Resposta da API ao buscar funcionários:", response); // Log da resposta completa da API
        if (response.ok) {
            const employees = await response.json();
            console.log("Funcionários recebidos:", employees); // Log dos dados recebidos
            displayEmployees(employees);
        } else {
            console.error("Erro ao buscar funcionários:", await response.json());
        }
    } catch (error) {
        console.error("Erro na requisição de busca:", error);
    }
}

// Função para buscar um funcionário específico por ID
async function fetchEmployeeById(employeeId) {
    const url = `${API_URL}/${employeeId}`;
    console.log("URL gerada:", url);  // Verifique se a URL está correta
    try {
        const response = await fetch(url);
        console.log("Resposta da API ao buscar funcionário por ID:", response);
        if (response.ok) {
            const employee = await response.json();
            console.log("Funcionário encontrado:", employee);
            // Seu código para exibir os dados do funcionário
        } else {
            console.error("Erro ao buscar funcionário:", await response.json());
        }
    } catch (error) {
        console.error("Erro na requisição de busca do funcionário:", error);
    }
}

// Função para exibir funcionários na tabela
function formatDate(date) {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Mês começa do 0 (Janeiro)
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

function displayEmployees(employees) {
    const employeeList = document.querySelector("#employeeTable tbody");
    employeeList.innerHTML = ""; // Limpa a lista antes de preencher
    employees.forEach((employee) => {
        // Formata a data corretamente antes de exibi-la
        const formattedDob = formatDate(employee.dob);
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${employee.name}</td>
            <td>${employee.position}</td>
            <td>${employee.salary}</td>
            <td>${formattedDob}</td> <!-- Exibe a data formatada -->
            <td>${employee.address}</td>
            <td>
                <button class="btn btn-warning btn-sm edit-btn" data-id="${employee._id}">Editar</button>
                <button class="btn btn-danger btn-sm delete-btn" data-id="${employee._id}">Excluir</button>
            </td>
        `;
        employeeList.appendChild(row);
    });


// Adiciona evento de clique aos botões edit e delete
document.querySelector("#employeeTable tbody").addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-btn")) {
        const employeeId = e.target.dataset.id;
        openEditForm(employeeId); // Abre o formulário de edição
    }
    if (e.target.classList.contains("delete-btn")) {
        const employeeId = e.target.dataset.id;
        deleteEmployee(employeeId); // Exclui o funcionário
    }
});
    
    // Abrir editor
    async function openEditForm(employeeId) {
        console.log("Abrindo formulário de edição para funcionário:", employeeId);
        try {
            const response = await fetch(`${API_URL}/${employeeId}`);
            if (!response.ok) {
                throw new Error(`Erro ao buscar funcionário: ${response.statusText}`);
            }
            const employee = await response.json();
    
            // Preenche os campos do formulário com os dados do funcionário
            document.getElementById("editName").value = employee.name;
            document.getElementById("editPosition").value = employee.position;
            document.getElementById("editSalary").value = employee.salary;
            document.getElementById("editDob").value = employee.dob.split('T')[0];
            document.getElementById("editAddress").value = employee.address;
    
            // Define o ID do funcionário no campo oculto
            document.getElementById("editEmployeeId").value = employeeId;
    
            // Exibe o formulário de edição
            document.getElementById("editFormContainer").style.display = "block";
        } catch (error) {
            console.error("Erro ao buscar funcionário para edição:", error);
        }
    }
    
    
    // Evento de envio do formulário de edição
    document.getElementById("editForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log("Enviando formulário de edição."); // Log de depuração
    
        const employeeId = document.getElementById("editEmployeeId").value;
        const name = document.getElementById("editName").value;
        const position = document.getElementById("editPosition").value;
        const salary = document.getElementById("editSalary").value;
        const dob = document.getElementById("editDob").value;
        const address = document.getElementById("editAddress").value;
    
        try {
            // Envia os dados atualizados para o servidor
            const response = await fetch(`${API_URL}/${employeeId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, position, salary, dob, address }),
            });
    
            if (response.ok) {
                console.log("Funcionário atualizado com sucesso.");
                fetchEmployees(); // Atualiza a lista de funcionários
                document.getElementById("editFormContainer").style.display = "none"; // Fecha o formulário
            } else {
                const error = await response.json();
                console.error("Erro ao atualizar funcionário:", error);
            }
        } catch (error) {
            console.error("Erro na requisição de atualização:", error);
        }
    });
    // Adiciona eventos aos botões
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const employeeId = e.target.dataset.id;
            openEditForm(employeeId); // Abre o formulário de edição
        });
    });
    document.getElementById("cancelEditButton").addEventListener("click", () => {
        console.log("Botão Cancelar clicado."); // Log para depuração
    
        // Esconde o formulário de edição
        document.getElementById("editFormContainer").style.display = "none";
    
        // Limpa os campos do formulário de edição
        document.getElementById("editForm").reset();
    });
    async function deleteEmployee(employeeId) {
        console.log("Tentando excluir funcionário com ID:", employeeId); // Log para depuração
    
        try {
            const response = await fetch(`${API_URL}/${employeeId}`, {
                method: "DELETE",
            });
    
            console.log("Resposta da API ao excluir funcionário:", response); // Log da resposta completa da API
    
            if (response.ok) {
                const result = await response.json(); // Resposta da API
                console.log(result.message); // Mensagem de sucesso
                fetchEmployees(); // Atualiza a lista de funcionários
            } else {
                const errorMessage = await response.text(); // Lê a mensagem de erro
                console.error("Erro ao excluir funcionário:", errorMessage);
            }
        } catch (error) {
            console.error("Erro na requisição de exclusão:", error); // Log do erro no fetch
        }
    }
    // Adiciona o evento de clique aos botões "Excluir"
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const employeeId = e.target.dataset.id; // Captura o ID do funcionário
            deleteEmployee(employeeId); // Chama a função para excluir
        });
    });
}
// Inicializa carregando os funcionários
fetchEmployees();

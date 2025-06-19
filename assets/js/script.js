document.addEventListener('DOMContentLoaded', () => {
    let consultores = [
        { id: 1, nome: 'Neymar', email: 'neymar@gmail.com', telefone: '(11) 98765-4321', status: 'Ativo' },
        { id: 2, nome: 'Maria Souza', email: 'maria.souza@gmail.com', telefone: '(21) 91234-5678', status: 'Ativo' },
        { id: 3, nome: 'Pedro Admin', email: 'luca@gmail.com', telefone: '(31) 95555-1111', status: 'Férias' }
    ];

    const tabelaBody = document.getElementById('consultoresTabelaBody');
    if (!tabelaBody) return;

    const consultorModal = new bootstrap.Modal(document.getElementById('consultorModal'));
    const form = document.getElementById('consultorForm');
    const modalTitle = document.getElementById('consultorModalLabel');
    
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Ativo': return 'bg-success';
            case 'Inativo': return 'bg-danger';
            case 'Férias': return 'bg-warning text-dark';
            default: return 'bg-secondary';
        }
    };

    const renderizarTabela = (dados = consultores) => {
        tabelaBody.innerHTML = '';
        dados.forEach(consultor => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <th>${consultor.id}</th>
                <td>${consultor.nome}</td>
                <td>${consultor.email}</td>
                <td>${consultor.telefone}</td>
                <td><span class="badge ${getStatusBadgeClass(consultor.status)}">${consultor.status}</span></td>
                <td class="text-center">
                    <button class="btn btn-sm btn-warning me-1 btn-editar" data-id="${consultor.id}" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-inativar" data-id="${consultor.id}" title="${consultor.status === 'Inativo' ? 'Ativar' : 'Inativar'}">
                        <i class="fas ${consultor.status === 'Inativo' ? 'fa-user-check' : 'fa-user-times'}"></i>
                    </button>
                </td>
            `;
            tabelaBody.appendChild(tr);
        });
    };

    document.getElementById('btnNovoConsultor').addEventListener('click', () => {
        form.reset();
        modalTitle.textContent = 'Novo Consultor';
        document.getElementById('consultorId').value = '';
        consultorModal.show();
    });

    document.getElementById('btnSalvarConsultor').addEventListener('click', () => {
        const id = document.getElementById('consultorId').value;
        const nome = document.getElementById('consultorNome').value;
        const email = document.getElementById('consultorEmail').value;
        const telefone = document.getElementById('consultorTelefone').value;
        const status = document.getElementById('consultorStatus').value;
        
        if (!nome || !email) {
            alert('Nome e E-mail são campos obrigatórios.');
            return;
        }

        if (id) {
            const index = consultores.findIndex(c => c.id == id);
            if (index !== -1) {
                consultores[index] = { id: Number(id), nome, email, telefone, status };
            }
        } else {
            const novoId = consultores.length > 0 ? Math.max(...consultores.map(c => c.id)) + 1 : 1;
            consultores.push({ id: novoId, nome, email, telefone, status });
        }
        
        renderizarTabela();
        consultorModal.hide();
    });

    tabelaBody.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;

        const id = button.dataset.id;
        
        if (button.classList.contains('btn-editar')) {
            const consultor = consultores.find(c => c.id == id);
            if (consultor) {
                modalTitle.textContent = 'Editar Consultor';
                document.getElementById('consultorId').value = consultor.id;
                document.getElementById('consultorNome').value = consultor.nome;
                document.getElementById('consultorEmail').value = consultor.email;
                document.getElementById('consultorTelefone').value = consultor.telefone;
                document.getElementById('consultorStatus').value = consultor.status;
                consultorModal.show();
            }
        }

        if (button.classList.contains('btn-inativar')) {
            const index = consultores.findIndex(c => c.id == id);
            if (index !== -1) {
                if(consultores[index].status === 'Inativo'){
                    consultores[index].status = 'Ativo';
                } else {
                    consultores[index].status = 'Inativo';
                }
                renderizarTabela();
            }
        }
    });
    
    document.getElementById('btnAplicarFiltros').addEventListener('click', () => {
        const nomeFiltro = document.getElementById('filtroNome').value.toLowerCase();
        const statusFiltro = document.getElementById('filtroStatus').value;

        const dadosFiltrados = consultores.filter(c => {
            const nomeMatch = c.nome.toLowerCase().includes(nomeFiltro);
            const statusMatch = statusFiltro === 'todos' || c.status === statusFiltro;
            return nomeMatch && statusMatch;
        });
        
        renderizarTabela(dadosFiltrados);
    });

    renderizarTabela();
});
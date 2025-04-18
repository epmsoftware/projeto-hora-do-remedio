function fetchMedicamentos() {
    fetch('http://localhost:3000/api/medicamentos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na rede');
            }
            return response.json();
        })
        .then(data => {
            const medicamentosContainer = document.getElementById('medicamentosContainer');

            // Limpa o contêiner antes de adicionar novos medicamentos
            medicamentosContainer.innerHTML = '';
            
            if (data.length === 0) {
                const mensagem = document.createElement('p');
                mensagem.textContent = 'Nenhum remédio cadastrado';
                medicamentosContainer.appendChild(mensagem);
            } else {
                data.forEach(medicamento => {
                    
                    console.log(medicamento)
                    console.log(medicamento.id);

                    // Cria um div para as informações do remédio e o ícone da lixeira
                    const infoRemLixDiv = document.createElement('div');
                    infoRemLixDiv.className = 'containerRemLix';



                    // Cria uma nova div para cada medicamento
                    const medicamentoDiv = document.createElement('div');
                    medicamentoDiv.className = 'medicamento'; // Classe para estilização

                    infoRemLixDiv.appendChild(medicamentoDiv);


                    // Adiciona o CheckBox
                    const label = document.createElement('label');
                    label.className = 'switch';
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = `checkbox-${medicamento.id}`; // Cada medicamento tem um ID único
                    label.appendChild(checkbox);


                    const span = document.createElement('span');
                    span.className = 'slider';
                    label.appendChild(span);


                    label.appendChild(document.createTextNode(' ')); // Espaço entre o checkbox e o texto
                    

                    // Adiciona o texto do medicamento
                    const textoMedicamento = document.createElement('span');
                    textoMedicamento.className = 'nomeRemedio';
                    textoMedicamento.textContent = `${medicamento.nome} - Horarios: ${medicamento.horario1}${medicamento.horario2 ? ', ' + medicamento.horario2 : ''}`;

                    // Adiciona o checkbox e o texto a uma nova div
                    medicamentoDiv.appendChild(label);
                    medicamentoDiv.appendChild(textoMedicamento);

                    // Adiciona o link para excluir as informações do medicamento
                    const linkLixeira = document.createElement('a');
                    const imagemLinkLixeira = document.createElement('img');
                    imagemLinkLixeira.className = 'imagemLixeira';
                    imagemLinkLixeira.src = './images/lixeira-removebg-preview.png';

                    // Função para confirmar e excluir o medicamento
                    function confirmarExclusao(id) {
                        const confirmacao = confirm('Deseja realmente excluir este medicamento?');

                        if (confirmacao) {
                            fetch(`http://localhost:3000/api/deletar/${id}`, {
                                method: 'DELETE'
                            })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Erro ao excluir o medicamento');
                                }
                                return response.json();
                            })
                            .then(data => {
                                fetchMedicamentos(); // Recarregar a lista de medicamentos após a exclusão
                            })
                            .catch(error => {
                                console.error('Erro', error);
                                alert('Ocorreu um erro ao tentar excluir o medicamento.');
                            });
                        }
                    }

                    // Chamar função para deletar o medicamento
                    imagemLinkLixeira.addEventListener('click', function() {
                        confirmarExclusao(medicamento.id);
                    });
                    
                    linkLixeira.appendChild(imagemLinkLixeira);
                    medicamentoDiv.appendChild(linkLixeira);


                    // Adiciona a nova div ao contâiner de medicamentos
                    medicamentosContainer.appendChild(infoRemLixDiv);


                    // Adiciona um evento de escuta ao checkbox
                    checkbox.addEventListener('change', function() {
                        if(this.checked) {
                            // Toca o som
                            document.getElementById('audioNotificacao').play();
                            // Mostra a notificação
                            alert(`Parabéns! Você tomou seu ${medicamento.nome} no horário certo.`);
                        }
                    });
                });
            }
        })
        .catch(error => {
            console.error('Erro ao buscar medicamentos:', error);
            const remedioText = document.createElement('p');
            remedioText.textContent = 'Erro ao carregar medicamentos'; // Mensagem de erro
            document.getElementById('medicamentosContainer').appendChild(remedioText);
        });
}



// Chama a função para buscar medicamentos ao carregar a página
window.onload = fetchMedicamentos;
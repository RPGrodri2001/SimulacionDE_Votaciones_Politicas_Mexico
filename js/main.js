    
        // Datos de candidatos con fotos placeholder
        const candidates = {
            judges: [
                { name: "José Delgado", photo: "https://conexion.puce.edu.ec/wp-content/uploads/2025/01/%C2%BFTe-gustaria-saber-mas-Conoce-el-perfil-de-los-16-candidatos-a-la-presidencia-en-Conexion-PUCE.-4.png" },
                { name: "José Pérez", photo: "https://conexion.puce.edu.ec/wp-content/uploads/2025/01/%C2%BFTe-gustaria-saber-mas-Conoce-el-perfil-de-los-16-candidatos-a-la-presidencia-en-Conexion-PUCE.-1.png" },
                { name: "María Iglesias", photo: "https://conexion.puce.edu.ec/wp-content/uploads/2025/01/%C2%BFTe-gustaria-saber-mas-Conoce-el-perfil-de-los-16-candidatos-a-la-presidencia-en-Conexion-PUCE.-5.png" }
            ],
            ministers: [
                { name: "Mario Ortiz", photo: "https://conexion.puce.edu.ec/wp-content/uploads/2025/01/%C2%BFTe-gustaria-saber-mas-Conoce-el-perfil-de-los-16-candidatos-a-la-presidencia-en-Conexion-PUCE.-2.png" },
                { name: "Alexa Campaña", photo: "https://conexion.puce.edu.ec/wp-content/uploads/2025/01/%C2%BFTe-gustaria-saber-mas-Conoce-el-perfil-de-los-16-candidatos-a-la-presidencia-en-Conexion-PUCE.-3.png" },
                { name: "Darío López", photo: "https://conexion.puce.edu.ec/wp-content/uploads/2025/01/%C2%BFTe-gustaria-saber-mas-Conoce-el-perfil-de-los-16-candidatos-a-la-presidencia-en-Conexion-PUCE.-6.png" }
            ],
            magistrates: [
                { name: "Henry Cordero", photo: "https://www.larepublica.ec/wp-content/uploads/2014/11/cassinelli1.jpg" },
                { name: "Augusto Fernández", photo: "https://elobservador.ec/wp-content/uploads/2022/10/2.-LOS-CANDIDATOS.jpeg" },
                { name: "Roger Gómez", photo: "https://www.valoraanalitik.com/wp-content/uploads/2024/05/Jose-Raul-Mulino-min-1024x598.jpg" }
            ]
        };

        let selectedVotes = {
            judge: null,
            minister: null,
            magistrate: null
        };

        // Inicializar sistema
        function initializeVoting() {
            if (!localStorage.getItem('votingResults')) {
                const initialResults = {
                    judges: { "José Delgado": 0, "José Pérez": 0, "María Iglesias": 0 },
                    ministers: { "Mario Ortiz": 0, "Alexa Campaña": 0, "Darío López": 0 },
                    magistrates: { "Henry Cordero": 0, "Augusto Fernández": 0, "Roger Gómez": 0 }
                };
                localStorage.setItem('votingResults', JSON.stringify(initialResults));
            }
        }

        // Mostrar pantallas
        function showHome() {
            hideAllScreens();
            document.getElementById('homeScreen').style.display = 'block';
        }

        function showRegistration() {
            hideAllScreens();
            document.getElementById('registrationScreen').style.display = 'block';
        }

        function showVoting() {
            hideAllScreens();
            document.getElementById('votingScreen').style.display = 'block';
            loadCandidates();
        }

        function hideAllScreens() {
            document.getElementById('homeScreen').style.display = 'none';
            document.getElementById('registrationScreen').style.display = 'none';
            document.getElementById('votingScreen').style.display = 'none';
        }

        // Tutorial
        function showTutorial() {
            document.getElementById('tutorialModal').classList.remove('d-none');
        }

        function closeTutorial() {
            document.getElementById('tutorialModal').classList.add('d-none');
        }

        // Cargar candidatos
        function loadCandidates() {
            loadCandidateCategory('judges', 'judgesCandidates', 'judge');
            loadCandidateCategory('ministers', 'ministersCandidates', 'minister');
            loadCandidateCategory('magistrates', 'magistratesCandidates', 'magistrate');
        }

        function loadCandidateCategory(category, containerId, type) {
            const container = document.getElementById(containerId);
            container.innerHTML = '';
            
            candidates[category].forEach((candidate, index) => {
                const candidateCard = document.createElement('div');
                candidateCard.className = 'col-md-4 mb-3';
                candidateCard.innerHTML = `
                    <div class="candidate-card ${type}" onclick="selectCandidate('${type}', '${candidate.name}', this)">
                        <div class="d-flex align-items-center">
                            <img src="${candidate.photo}" alt="${candidate.name}" class="candidate-photo me-3">
                            <div>
                                <h5 class="mb-1 fw-bold">${candidate.name}</h5>
                                <p class="mb-0 text-muted">Candidato ${index + 1}</p>
                            </div>
                        </div>
                        <div class="mt-3">
                            <i class="fas fa-check-circle text-success" style="display: none;"></i>
                        </div>
                    </div>
                `;
                container.appendChild(candidateCard);
            });
        }

        // Seleccionar candidato
        function selectCandidate(type, name, element) {
            // Deseleccionar otros candidatos del mismo tipo
            document.querySelectorAll(`.candidate-card.${type}`).forEach(card => {
                card.classList.remove('selected');
                card.querySelector('.fas.fa-check-circle').style.display = 'none';
            });
            
            // Seleccionar el candidato actual
            element.classList.add('selected');
            element.querySelector('.fas.fa-check-circle').style.display = 'inline';
            selectedVotes[type] = name;
            
            // Limpiar alertas
            document.getElementById('alertContainer').innerHTML = '';
        }

        // Validar formulario de registro
        document.getElementById('voterForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value.trim();
            const curp = document.getElementById('curp').value.trim();
            
            if (!fullName) {
                showAlert('Por favor ingrese su nombre completo', 'danger', 'registrationAlertContainer');
                return;
            }
            
            if (!curp) {
                showAlert('Por favor ingrese su CURP', 'danger', 'registrationAlertContainer');
                return;
            }
            
            if (curp.length !== 18) {
                showAlert('❌ El CURP debe tener exactamente 18 caracteres. Actualmente tiene ' + curp.length + ' caracteres. Por favor verifique e ingrese su CURP completo.', 'danger', 'registrationAlertContainer');
                return;
            }
            
            // Guardar datos del votante
            localStorage.setItem('currentVoter', JSON.stringify({
                name: fullName,
                curp: curp,
                timestamp: new Date().toISOString()
            }));
            showVoting();
        });

        // Enviar voto
        function submitVote() {
            if (!selectedVotes.judge || !selectedVotes.minister || !selectedVotes.magistrate) {
                showAlert('Por favor seleccione un candidato de cada categoría', 'danger');
                return;
            }
            
            // Verificar si ya votó
            const currentVoter = JSON.parse(localStorage.getItem('currentVoter'));
            const votedUsers = JSON.parse(localStorage.getItem('votedUsers') || '[]');
            
            if (votedUsers.includes(currentVoter.curp)) {
                showAlert('Ya ha emitido su voto anteriormente', 'danger');
                return;
            }
            
            // Registrar voto
            const results = JSON.parse(localStorage.getItem('votingResults'));
            results.judges[selectedVotes.judge]++;
            results.ministers[selectedVotes.minister]++;
            results.magistrates[selectedVotes.magistrate]++;
            
            localStorage.setItem('votingResults', JSON.stringify(results));
            
            // Marcar usuario como votado
            votedUsers.push(currentVoter.curp);
            localStorage.setItem('votedUsers', JSON.stringify(votedUsers));
            
            showAlert('¡Voto registrado exitosamente! Gracias por participar', 'success');
            
            // Resetear selecciones
            selectedVotes = { judge: null, minister: null, magistrate: null };
            document.querySelectorAll('.candidate-card').forEach(card => {
                card.classList.remove('selected');
                card.querySelector('.fas.fa-check-circle').style.display = 'none';
            });
            
            // Limpiar datos del votante y regresar al inicio después de 3 segundos
            setTimeout(() => {
                localStorage.removeItem('currentVoter');
                document.getElementById('fullName').value = '';
                document.getElementById('curp').value = '';
                document.getElementById('curpCounter').textContent = '0/18 caracteres';
                document.getElementById('curpCounter').className = 'text-muted';
                showHome();
            }, 3000);
        }

        // Mostrar alertas
        function showAlert(message, type, containerId = 'alertContainer') {
            const alertContainer = document.getElementById(containerId);
            const alertClass = type === 'success' ? 'alert-success-custom' : 'alert-danger-custom';
            const icon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle';
            
            alertContainer.innerHTML = `
                <div class="alert alert-custom ${alertClass} d-flex align-items-center">
                    <i class="${icon} me-3"></i>
                    <div>${message}</div>
                </div>
            `;
            
            // Auto-ocultar después de 5 segundos
            setTimeout(() => {
                alertContainer.innerHTML = '';
            }, 5000);
        }

        // Mostrar resultados
        function showResults() {
            const results = JSON.parse(localStorage.getItem('votingResults'));
            const resultsContent = document.getElementById('resultsContent');
            
            let html = '';
            
            // Calcular totales
            const totalJudges = Object.values(results.judges).reduce((a, b) => a + b, 0);
            const totalMinisters = Object.values(results.ministers).reduce((a, b) => a + b, 0);
            const totalMagistrates = Object.values(results.magistrates).reduce((a, b) => a + b, 0);
            
            // Resultados de Jueces
            html += `
                <div class="mb-4">
                    <h4 class="judge-badge d-inline-block"><i class="fas fa-gavel me-2"></i>Jueces</h4>
                    <p class="text-muted">Total de votos: ${totalJudges}</p>
            `;
            
            Object.entries(results.judges).forEach(([name, votes]) => {
                const percentage = totalJudges > 0 ? (votes / totalJudges * 100).toFixed(1) : 0;
                html += `
                    <div class="mb-3">
                        <div class="d-flex justify-content-between mb-1">
                            <span class="fw-bold">${name}</span>
                            <span>${votes} votos (${percentage}%)</span>
                        </div>
                        <div class="progress-custom">
                            <div class="progress-bar-custom" style="width: ${percentage}%; background: linear-gradient(135deg, var(--purple), #9b59b6);"></div>
                        </div>
                    </div>
                `;
            });
            
            html += `</div>`;
            
            // Resultados de Ministros
            html += `
                <div class="mb-4">
                    <h4 class="minister-badge d-inline-block"><i class="fas fa-university me-2"></i>Ministros</h4>
                    <p class="text-muted">Total de votos: ${totalMinisters}</p>
            `;
            
            Object.entries(results.ministers).forEach(([name, votes]) => {
                const percentage = totalMinisters > 0 ? (votes / totalMinisters * 100).toFixed(1) : 0;
                html += `
                    <div class="mb-3">
                        <div class="d-flex justify-content-between mb-1">
                            <span class="fw-bold">${name}</span>
                            <span>${votes} votos (${percentage}%)</span>
                        </div>
                        <div class="progress-custom">
                            <div class="progress-bar-custom" style="width: ${percentage}%; background: linear-gradient(135deg, var(--aqua), #1abc9c);"></div>
                        </div>
                    </div>
                `;
            });
            
            html += `</div>`;
            
            // Resultados de Magistrados
            html += `
                <div class="mb-4">
                    <h4 class="magistrate-badge d-inline-block"><i class="fas fa-balance-scale me-2"></i>Magistrados</h4>
                    <p class="text-muted">Total de votos: ${totalMagistrates}</p>
            `;
            
            Object.entries(results.magistrates).forEach(([name, votes]) => {
                const percentage = totalMagistrates > 0 ? (votes / totalMagistrates * 100).toFixed(1) : 0;
                html += `
                    <div class="mb-3">
                        <div class="d-flex justify-content-between mb-1">
                            <span class="fw-bold">${name}</span>
                            <span>${votes} votos (${percentage}%)</span>
                        </div>
                        <div class="progress-custom">
                            <div class="progress-bar-custom" style="width: ${percentage}%; background: linear-gradient(135deg, var(--yellow), #f39c12);"></div>
                        </div>
                    </div>
                `;
            });
            
            html += `</div>`;
            
            // Resumen general
            const totalVotes = totalJudges + totalMinisters + totalMagistrates;
            html += `
                <div class="text-center mt-4 p-3" style="background: linear-gradient(135deg, #f8f9fa, #e9ecef); border-radius: 15px;">
                    <h5 class="mb-2"><i class="fas fa-chart-pie me-2"></i>Resumen General</h5>
                    <p class="mb-1"><strong>Total de votos emitidos:</strong> ${Math.max(totalJudges, totalMinisters, totalMagistrates)}</p>
                    <p class="mb-0 text-muted">Última actualización: ${new Date().toLocaleString('es-MX')}</p>
                </div>
            `;
            
            resultsContent.innerHTML = html;
            document.getElementById('resultsModal').classList.remove('d-none');
        }

        // Cerrar modal de resultados
        function closeResults() {
            document.getElementById('resultsModal').classList.add('d-none');
        }

        // Función para exportar a CSV
        function exportToCSV() {
            const results = JSON.parse(localStorage.getItem('votingResults'));
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            
            // Crear contenido CSV
            let csvContent = "Categoria,Candidato,Votos,Porcentaje\n";
            
            // Jueces
            const totalJudges = Object.values(results.judges).reduce((a, b) => a + b, 0);
            Object.entries(results.judges).forEach(([name, votes]) => {
                const percentage = totalJudges > 0 ? (votes / totalJudges * 100).toFixed(2) : 0;
                csvContent += `Jueces,${name},${votes},${percentage}%\n`;
            });
            
            // Ministros
            const totalMinisters = Object.values(results.ministers).reduce((a, b) => a + b, 0);
            Object.entries(results.ministers).forEach(([name, votes]) => {
                const percentage = totalMinisters > 0 ? (votes / totalMinisters * 100).toFixed(2) : 0;
                csvContent += `Ministros,${name},${votes},${percentage}%\n`;
            });
            
            // Magistrados
            const totalMagistrates = Object.values(results.magistrates).reduce((a, b) => a + b, 0);
            Object.entries(results.magistrates).forEach(([name, votes]) => {
                const percentage = totalMagistrates > 0 ? (votes / totalMagistrates * 100).toFixed(2) : 0;
                csvContent += `Magistrados,${name},${votes},${percentage}%\n`;
            });
            
            // Totales
            csvContent += `\nResumen,,,\n`;
            csvContent += `Total Jueces,,${totalJudges},\n`;
            csvContent += `Total Ministros,,${totalMinisters},\n`;
            csvContent += `Total Magistrados,,${totalMagistrates},\n`;
            csvContent += `Total General,,${Math.max(totalJudges, totalMinisters, totalMagistrates)},\n`;
            csvContent += `Fecha Exportación,,${new Date().toLocaleString('es-MX')},\n`;
            
            // Crear archivo y descargar
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            
            link.setAttribute('href', url);
            link.setAttribute('download', `resultados_votacion_${timestamp}.csv`);
            link.style.visibility = 'hidden';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showAlert('Resultados exportados exitosamente', 'success', 'resultsContent');
        }

        // Función para limpiar datos (útil para pruebas)
        function resetVotingData() {
            localStorage.removeItem('votingResults');
            localStorage.removeItem('votedUsers');
            localStorage.removeItem('currentVoter');
            initializeVoting();
            alert('Datos de votación reiniciados');
        }

        // Formatear CURP mientras se escribe
        document.getElementById('curp').addEventListener('input', function(e) {
            let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
            if (value.length > 18) {
                value = value.substring(0, 18);
            }
            e.target.value = value;
            
            // Actualizar contador
            const counter = document.getElementById('curpCounter');
            const length = value.length;
            counter.textContent = `${length}/18 caracteres`;
            
            // Cambiar color según el progreso
            if (length === 0) {
                counter.className = 'text-muted';
            } else if (length < 18) {
                counter.className = 'text-warning';
            } else {
                counter.className = 'text-success';
            }
        });

        // Validar que solo se ingresen letras en el nombre
        document.getElementById('fullName').addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
            e.target.value = value;
        });

        // Inicializar el sistema al cargar la página
        initializeVoting();
